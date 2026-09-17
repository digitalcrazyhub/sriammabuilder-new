<?php
declare(strict_types=1);

function jsonResponse(
    bool $success,
    string $message,
    int $statusCode = 200,
    array $extra = []
): never {
    http_response_code($statusCode);

    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');

    echo json_encode(
        array_merge(
            [
                'success' => $success,
                'message' => $message
            ],
            $extra
        ),
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


function cleanString(
    mixed $value,
    int $maxLength = 255
): string {
    $value = trim((string) $value);

    $value = preg_replace(
        '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u',
        '',
        $value
    ) ?? '';

    if (mb_strlen($value) > $maxLength) {
        $value = mb_substr($value, 0, $maxLength);
    }

    return $value;
}


function getClientIp(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';

    return filter_var(
        $ip,
        FILTER_VALIDATE_IP
    ) ? $ip : '';
}


function getUserAgent(): string
{
    return cleanString(
        $_SERVER['HTTP_USER_AGENT'] ?? '',
        500
    );
}