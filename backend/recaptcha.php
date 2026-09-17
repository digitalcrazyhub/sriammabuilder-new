<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function verifyRecaptchaV3(
    string $token,
    string $expectedAction
): array {
    if ($token === '') {
        return [
            'success' => false,
            'message' => 'reCAPTCHA token missing.'
        ];
    }

    $postData = http_build_query([
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ]);

error_log(
        'Recaptcaha V3 file' .
        print_r($postData,true)
    );
    $ch = curl_init(
        'https://www.google.com/recaptcha/api/siteverify'
    );

    curl_setopt_array(
        $ch,
        [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ]
        ]
    );

    $result = curl_exec($ch);

    if ($result === false) {
        curl_close($ch);

        return [
            'success' => false,
            'message' => 'Unable to verify reCAPTCHA.'
        ];
    }

    curl_close($ch);

    $data = json_decode(
        $result,
        true
    );
error_log(
        'Recaptcaha V3 file' .
        print_r($data,true)
    );
    if (!is_array($data)) {
        return [
            'success' => false,
            'message' => 'Invalid reCAPTCHA response.'
        ];
    }

    if (
        empty($data['success']) ||
        !isset($data['score']) ||
        !isset($data['action'])
    ) {
        return [
            'success' => false,
            'message' => 'reCAPTCHA verification failed.'
        ];
    }

    $score = (float) $data['score'];

    $action = (string) $data['action'];

    if ($action !== $expectedAction) {
        return [
            'success' => false,
            'message' => 'Invalid reCAPTCHA action.'
        ];
    }

    if ($score < RECAPTCHA_MIN_SCORE) {
        return [
            'success' => false,
            'message' => 'reCAPTCHA verification score failed.'
        ];
    }

    return [
        'success' => true,
        'score' => $score
    ];
}