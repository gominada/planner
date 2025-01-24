<?php

function dd($value) 
{
    echo "<pre>";
    var_dump($value);
    echo "</pre>";

    die();
}

function base_path($path) 
{
    return BASE_PATH . $path;
} 

function view($path, $context = []) 
{
    extract($context);
    require base_path('views/' . $path);
}

function extract_request_body_json() {
    // Retrieve the raw request body
    $body = file_get_contents('php://input');
    // Parse it if it's JSON
    return json_decode($body, true);
}