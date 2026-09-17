<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/vendor/autoload.php';


function createMailer(): PHPMailer
{
    $mail = new PHPMailer(true);

    $mail->isSMTP();

    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;

    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;

    $mail->SMTPSecure = SMTP_ENCRYPTION;
    $mail->Port = SMTP_PORT;

    $mail->CharSet = 'UTF-8';

    $mail->setFrom(
        CUSTOMER_EMAIL_FROM,
        CUSTOMER_EMAIL_NAME
    );

    return $mail;
}


function sendLeadEmail(array $lead): void
{
    $mail = createMailer();

    $mail->addAddress(
        BUSINESS_EMAIL,
        BUSINESS_NAME
    );

    $mail->addReplyTo(
        $lead['email'],
        $lead['full_name']
    );

    $mail->isHTML(true);

    $mail->Subject =
        'New Website Enquiry - ' .
        $lead['full_name'];

    $mail->Body = '
        <h2>New Website Enquiry</h2>

        <p><strong>Name:</strong> ' .
        htmlspecialchars(
            $lead['full_name']
        ) .
        '</p>

        <p><strong>Email:</strong> ' .
        htmlspecialchars(
            $lead['email']
        ) .
        '</p>

        <p><strong>Phone:</strong> ' .
        htmlspecialchars(
            $lead['phone']
        ) .
        '</p>

        <p><strong>Service:</strong> ' .
        htmlspecialchars(
            $lead['service']
        ) .
        '</p>

        <p><strong>Message:</strong></p>

        <p>' .
        nl2br(
            htmlspecialchars(
                $lead['message']
            )
        ) .
        '</p>

        <hr>

        <p>
            <strong>IP:</strong> ' .
        htmlspecialchars(
            $lead['ip_address']
        ) .
        '</p>

        <p>
            <strong>Date:</strong> ' .
        date('d-m-Y H:i:s') .
        '</p>
    ';

    $mail->AltBody =
        "New Website Enquiry\n\n" .
        "Name: {$lead['full_name']}\n" .
        "Email: {$lead['email']}\n" .
        "Phone: {$lead['phone']}\n" .
        "Service: {$lead['service']}\n\n" .
        "Message:\n{$lead['message']}";

    $mail->send();
}


function sendCustomerThankYouEmail(
    array $lead
): void {
    $mail = createMailer();

    $mail->addAddress(
        $lead['email'],
        $lead['full_name']
    );

    $mail->isHTML(true);

    $mail->Subject =
        'Thank You for Your Enquiry';

    $mail->Body = '
        <h2>Thank You for Contacting Us</h2>

        <p>Dear ' .
        htmlspecialchars(
            $lead['first_name']
        ) .
        ',</p>

        <p>
            Thank you for contacting
            Sri Amma Industrial Developer
            PVT LTD.
        </p>

        <p>
            We have received your enquiry
            successfully.
        </p>

        <p>
            Our team will review your requirements
            and get back to you shortly.
        </p>

        <p>
            Regards,<br>
            Sri Amma Industrial Developer PVT LTD
        </p>
    ';

    $mail->AltBody =
        "Dear {$lead['first_name']},\n\n" .
        "Thank you for contacting us.\n\n" .
        "We have received your enquiry " .
        "successfully and our team will get " .
        "back to you shortly.\n\n" .
        "Regards,\n" .
        "Sri Amma Industrial Developer PVT LTD";

    $mail->send();
}