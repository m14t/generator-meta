<?php

if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} elseif (array_key_exists('REMOTE_ADDR', $_SERVER)) {
    $ip = $_SERVER['REMOTE_ADDR'];
} else {
    $ip = false;
}

$ipIsAllowed = in_array(
    $ip,
    array(
        '::1',
        '127.0.0.1',
    )
);

if (!$ipIsAllowed) {
    throw new \Exception($ip .' is not allowed to access this file.');
}
