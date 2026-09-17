<?php
declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$envPath = dirname(__DIR__).'/backend';

$dotenv = Dotenv::createImmutable($envPath);
$dotenv->safeLoad();

error_log('ENV PATH: ' . $envPath);
error_log('ENV FILE EXISTS: ' . (file_exists($envPath . '/.env') ? 'YES' : 'NO'));
error_log(
    'RECAPTCHA SECRET EXISTS: ' .
    (isset($_ENV['RECAPTCHA_SECRET_KEY']) ? 'YES' : 'NO')
);
/*
|--------------------------------------------------------------------------
| Environment configuration
|--------------------------------------------------------------------------
| Secrets are intentionally read from the server environment. Do not place
| passwords, API secrets, private keys, or service-account JSON in Git.
*/

function sabEnv(string $key, string $default = ''): string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

    if ($value === false || $value === null) {
        return $default;
    }

    return trim((string) $value);
}

/*
|--------------------------------------------------------------------------
| WEBSITE
|--------------------------------------------------------------------------
*/

define('SITE_NAME', sabEnv('SITE_NAME', 'Sri Amma Industrial Developer PVT LTD'));
define('SITE_URL', rtrim(sabEnv('SITE_URL', 'https://www.sriammaindustrial.com'), '/'));

define(
    'PROJECT_ROOT',
    rtrim(sabEnv('PROJECT_ROOT', '/'), '/') . '/'
);

define(
    'COMPONENTS_PATH',
    rtrim(
        sabEnv(
            'COMPONENTS_PATH',
            PROJECT_ROOT . 'asset/includes/'
        ),
        '/'
    ) . '/'
);

/*
|--------------------------------------------------------------------------
| BUSINESS / SMTP
|--------------------------------------------------------------------------
*/

define('BUSINESS_EMAIL', sabEnv('BUSINESS_EMAIL'));
define('BUSINESS_NAME', sabEnv('BUSINESS_NAME', SITE_NAME));

define('SMTP_HOST', sabEnv('SMTP_HOST'));
define('SMTP_PORT', (int) sabEnv('SMTP_PORT', '587'));
define('SMTP_USERNAME', sabEnv('SMTP_USERNAME'));
define('SMTP_PASSWORD', sabEnv('SMTP_PASSWORD'));
define('SMTP_ENCRYPTION', sabEnv('SMTP_ENCRYPTION', 'tls'));

define('CUSTOMER_EMAIL_FROM', sabEnv('CUSTOMER_EMAIL_FROM', BUSINESS_EMAIL));
define('CUSTOMER_EMAIL_NAME', sabEnv('CUSTOMER_EMAIL_NAME', SITE_NAME));

/*
|--------------------------------------------------------------------------
| MYSQL
|--------------------------------------------------------------------------
*/

define('DB_HOST', sabEnv('DB_HOST', 'localhost'));
define('DB_NAME', sabEnv('DB_NAME'));
define('DB_USER', sabEnv('DB_USER'));
define('DB_PASSWORD', sabEnv('DB_PASSWORD'));
define('DB_CHARSET', 'utf8mb4');

/*
|--------------------------------------------------------------------------
| GOOGLE SHEETS
|--------------------------------------------------------------------------
*/

define('GOOGLE_SHEET_ID', sabEnv('GOOGLE_SHEET_ID'));
define('GOOGLE_SHEET_NAME', sabEnv('GOOGLE_SHEET_NAME', 'Leads'));
define('GOOGLE_SERVICE_ACCOUNT_FILE', sabEnv('GOOGLE_SERVICE_ACCOUNT_FILE'));

/*
|--------------------------------------------------------------------------
| GOOGLE reCAPTCHA v3
|--------------------------------------------------------------------------
*/

define('RECAPTCHA_SITE_KEY', sabEnv('RECAPTCHA_SITE_KEY'));
define('RECAPTCHA_SECRET_KEY', sabEnv('RECAPTCHA_SECRET_KEY'));
define('RECAPTCHA_MIN_SCORE', (float) sabEnv('RECAPTCHA_MIN_SCORE', '0.5'));
define('RECAPTCHA_ACTION', sabEnv('RECAPTCHA_ACTION', 'contact_form'));

/*
|--------------------------------------------------------------------------
| SECURITY / VALIDATION
|--------------------------------------------------------------------------
*/

define('CSRF_SESSION_NAME', sabEnv('CSRF_SESSION_NAME', 'sab_contact_session'));

define('MAX_NAME_LENGTH', 100);
define('MAX_EMAIL_LENGTH', 190);
define('MAX_PHONE_LENGTH', 20);
define('MAX_SERVICE_LENGTH', 100);
define('MAX_MESSAGE_LENGTH', 3000);

date_default_timezone_set(sabEnv('APP_TIMEZONE', 'Asia/Kolkata'));

ini_set('session.name', CSRF_SESSION_NAME);
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');

if (!headers_sent()) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}
