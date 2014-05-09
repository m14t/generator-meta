<?php

$loader = require_once __DIR__.'/../vendor/autoload.php';

//-- Allow options to be set in files that include this one
if (!isset($silexOptions)) {
    $silexOptions = array();
}

$app = new <%= projectNamespace %>\AppKernel($silexOptions);

$app->get('/', function () use ($app) {
    return 'Hello';
});

$app->run();
