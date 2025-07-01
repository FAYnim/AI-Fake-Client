<?php
// public/api.php

// Define the root path of the project to make includes easier.
define('PROJECT_ROOT', dirname(__DIR__));

// Include the main application class.
require_once PROJECT_ROOT . '/src/Core/App.php';

// Create an instance of the App and run it.
$app = new App();
$app->run();
