<?php
declare(strict_types=1);

use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/vendor/autoload.php';


function addLeadToGoogleSheet(
    array $lead
): void {
    if (
        GOOGLE_SERVICE_ACCOUNT_FILE === '' ||
        !is_file(GOOGLE_SERVICE_ACCOUNT_FILE) ||
        !is_readable(GOOGLE_SERVICE_ACCOUNT_FILE)
    ) {
        throw new RuntimeException('Google service-account credentials are not configured.');
    }

    if (GOOGLE_SHEET_ID === '') {
        throw new RuntimeException('Google Sheet ID is not configured.');
    }

    $client = new Client();

    $client->setApplicationName(
        SITE_NAME . ' Lead System'
    );

    $client->setAuthConfig(
        GOOGLE_SERVICE_ACCOUNT_FILE
    );

    $client->setScopes([
        Sheets::SPREADSHEETS
    ]);

    $service = new Sheets($client);

    $values = [
        [
            date(
                'Y-m-d H:i:s'
            ),

            $lead['first_name'],
            $lead['last_name'],
            $lead['email'],
            $lead['phone'],
            $lead['service'],
            $lead['message'],

            $lead['ip_address'],

            (string) (
                $lead['recaptcha_score'] ?? ''
            )
        ]
    ];

    $body = new ValueRange([
        'values' => $values
    ]);

    $service
        ->spreadsheets_values
        ->append(
            GOOGLE_SHEET_ID,
            GOOGLE_SHEET_NAME . '!A:I',
            $body,
            [
                'valueInputOption' => 'USER_ENTERED',
                'insertDataOption' => 'INSERT_ROWS'
            ]
        );
}