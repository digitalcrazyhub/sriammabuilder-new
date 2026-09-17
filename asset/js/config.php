<?php

declare(strict_types=1);

require_once __DIR__ . '/../../backend/config.php';

header('Content-Type: application/javascript; charset=UTF-8');

echo 'window.SAB_CONFIG = ' . json_encode([
    'projectRoot'    => PROJECT_ROOT,
    'componentsPath' => COMPONENTS_PATH
], JSON_UNESCAPED_SLASHES) . ';';