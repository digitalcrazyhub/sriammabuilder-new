<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/recaptcha.php';
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/google-sheets.php';

/*
|--------------------------------------------------------------------------
| HTTP SECURITY HEADERS
|--------------------------------------------------------------------------
*/

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');


/*
|--------------------------------------------------------------------------
| SESSION
|--------------------------------------------------------------------------
*/

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}


/*
|--------------------------------------------------------------------------
| GET = CSRF TOKEN
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    jsonResponse(
        true,
        csrfToken()
    );
}


/*
|--------------------------------------------------------------------------
| POST ONLY
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    jsonResponse(
        false,
        'Invalid request method.',
        405
    );
}


/*
|--------------------------------------------------------------------------
| CONTENT TYPE
|--------------------------------------------------------------------------
*/

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));

if (
    $contentType !== '' &&
    !str_starts_with($contentType, 'multipart/form-data') &&
    !str_starts_with($contentType, 'application/x-www-form-urlencoded')
) {
    jsonResponse(false, 'Invalid content type.', 415);
}


/*
|--------------------------------------------------------------------------
| HONEYPOT
|--------------------------------------------------------------------------
*/



$website = cleanString(
    $_POST['website'] ?? '',
    255
);

if ($website !== '') {

    jsonResponse(
        false,
        'Invalid submission.',
        400
    );
}


/*
|--------------------------------------------------------------------------
| CSRF
|--------------------------------------------------------------------------
*/

$csrfToken = cleanString(
    $_POST['csrf_token'] ?? '',
    128
);

if (!verifyCsrfToken($csrfToken)) {

    jsonResponse(
        false,
        'Security verification failed. Please refresh the page and try again.',
        403
    );
}


/*
|--------------------------------------------------------------------------
| FORM DATA
|--------------------------------------------------------------------------
*/

$firstName = cleanString(
    $_POST['firstName'] ?? '',
    MAX_NAME_LENGTH
);

$lastName = cleanString(
    $_POST['lastName'] ?? '',
    MAX_NAME_LENGTH
);

$email = trim(
    (string) (
        $_POST['email'] ?? ''
    )
);

$phone = cleanString(
    $_POST['phone'] ?? '',
    MAX_PHONE_LENGTH
);

$service = cleanString(
    $_POST['service'] ?? '',
    MAX_SERVICE_LENGTH
);

$message = cleanString(
    $_POST['message'] ?? '',
    MAX_MESSAGE_LENGTH
);

$recaptchaToken = cleanString(
    $_POST['recaptcha_token'] ?? '',
    5000
);


/*
|--------------------------------------------------------------------------
| REQUIRED FIELDS
|--------------------------------------------------------------------------
*/

if (
    $firstName === '' ||
    $lastName === '' ||
    $email === '' ||
    $phone === '' ||
    $message === ''
) {

    jsonResponse(
        false,
        'Please complete all required fields.',
        422
    );
}


/*
|--------------------------------------------------------------------------
| NAME VALIDATION
|--------------------------------------------------------------------------
*/

if (
    !preg_match(
        "/^[A-Za-zÀ-ÿ\s.'-]{2,100}$/u",
        $firstName
    )
) {

    jsonResponse(
        false,
        'Enter a valid first name.',
        422
    );
}


if (
    !preg_match(
        "/^[A-Za-zÀ-ÿ\s.'-]{2,100}$/u",
        $lastName
    )
) {

    jsonResponse(
        false,
        'Enter a valid last name.',
        422
    );
}


/*
|--------------------------------------------------------------------------
| EMAIL
|--------------------------------------------------------------------------
*/

if (
    mb_strlen($email) > MAX_EMAIL_LENGTH ||
    !filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )
) {

    jsonResponse(
        false,
        'Enter a valid email address.',
        422
    );
}


/*
|--------------------------------------------------------------------------
| PHONE
|--------------------------------------------------------------------------
*/

$phoneDigits = preg_replace(
    '/\D+/',
    '',
    $phone
);

if (
    strlen($phoneDigits) === 12 &&
    str_starts_with(
        $phoneDigits,
        '91'
    )
) {
    $phoneDigits =
        substr(
            $phoneDigits,
            2
        );
}

if (
    !preg_match(
        '/^[6-9][0-9]{9}$/',
        $phoneDigits
    )
) {

    jsonResponse(
        false,
        'Enter a valid 10-digit mobile number.',
        422
    );
}


/*
|--------------------------------------------------------------------------
| MESSAGE
|--------------------------------------------------------------------------
*/

if (
    mb_strlen($message) < 10
) {

    jsonResponse(
        false,
        'Message must be at least 10 characters.',
        422
    );
}


/*
|--------------------------------------------------------------------------
| reCAPTCHA
|--------------------------------------------------------------------------
*/

$captcha = verifyRecaptchaV3(
    $recaptchaToken,
    RECAPTCHA_ACTION
);

if (
    empty($captcha['success'])
) {

    jsonResponse(
        false,
        'reCAPTCHA verification failed. Please try again.',
        403
    );
}


/*
|--------------------------------------------------------------------------
| LEAD ARRAY
|--------------------------------------------------------------------------
*/

$lead = [
    'first_name' => $firstName,
    'last_name' => $lastName,

    'full_name' =>
        trim(
            $firstName .
            ' ' .
            $lastName
        ),

    'email' => $email,
    'phone' => $phoneDigits,
    'service' => $service,
    'message' => $message,

    'ip_address' => getClientIp(),

    'user_agent' => getUserAgent(),

    'recaptcha_score' =>
        (float) (
            $captcha['score'] ?? 0
        )
];


/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/

try {

    $pdo = db();

    $stmt = $pdo->prepare(
        '
        INSERT INTO leads
        (
            first_name,
            last_name,
            email,
            phone,
            service,
            message,
            ip_address,
            user_agent,
            recaptcha_score
        )
        VALUES
        (
            :first_name,
            :last_name,
            :email,
            :phone,
            :service,
            :message,
            :ip_address,
            :user_agent,
            :recaptcha_score
        )
        '
    );

    $stmt->execute([
        ':first_name' =>
            $lead['first_name'],

        ':last_name' =>
            $lead['last_name'],

        ':email' =>
            $lead['email'],

        ':phone' =>
            $lead['phone'],

        ':service' =>
            $lead['service'],

        ':message' =>
            $lead['message'],

        ':ip_address' =>
            $lead['ip_address'],

        ':user_agent' =>
            $lead['user_agent'],

        ':recaptcha_score' =>
            $lead['recaptcha_score']
    ]);

} catch (Throwable $e) {

    error_log(
        'Database Error: ' .
        $e->getMessage()
    );

    jsonResponse(
        false,
        'Unable to save your enquiry. Please try again later.',
        500
    );
}


/*
|--------------------------------------------------------------------------
| BUSINESS EMAIL
|--------------------------------------------------------------------------
*/

try {

    sendLeadEmail($lead);

} catch (Throwable $e) {

    error_log(
        'Lead Email Error: ' .
        $e->getMessage()
    );
}


/*
|--------------------------------------------------------------------------
| CUSTOMER EMAIL
|--------------------------------------------------------------------------
*/

try {

    sendCustomerThankYouEmail(
        $lead
    );

} catch (Throwable $e) {

    error_log(
        'Customer Email Error: ' .
        $e->getMessage()
    );
}


/*
|--------------------------------------------------------------------------
| GOOGLE SHEET
|--------------------------------------------------------------------------
*/

try {

    addLeadToGoogleSheet(
        $lead
    );

} catch (Throwable $e) {

    error_log(
        'Google Sheets Error: ' .
        $e->getMessage()
    );
}


/*
|--------------------------------------------------------------------------
| SUCCESS
|--------------------------------------------------------------------------
*/

jsonResponse(
    true,
    'Thank you! Your enquiry has been submitted successfully.'
);