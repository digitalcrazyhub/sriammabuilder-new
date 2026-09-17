-- ============================================================
-- Sri Amma Industrial Developers Pvt Ltd
-- Database: sriammabuilders
-- ============================================================

CREATE DATABASE IF NOT EXISTS `sriammabuilders`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `sriammabuilders`;

-- ============================================================
-- Leads table
-- ============================================================

CREATE TABLE IF NOT EXISTS `leads` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,

    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,

    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,

    `service` VARCHAR(255) NOT NULL,

    `message` TEXT NOT NULL,

    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,

    `recaptcha_score` DECIMAL(4,3) DEFAULT NULL,

    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),

    INDEX `idx_leads_email` (`email`),
    INDEX `idx_leads_phone` (`phone`),
    INDEX `idx_leads_service` (`service`),
    INDEX `idx_leads_created_at` (`created_at`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci;