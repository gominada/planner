<?php

use Core\Database;

$db = new Database("../tasks.db");

$tasks = extract_request_body_json();

foreach ($tasks as $task) {

    $exist = $db->query(
    "SELECT * FROM task 
    WHERE date = :date AND hour = :hour AND position = :position", $task
    )->fetch();

    if ($exist) {
        $db->query(
        "UPDATE task 
        SET name = :name, done = :done
        WHERE date = :date AND hour = :hour AND position = :position", $task);
    } 
    else {
        $db->query(
        "INSERT INTO task (name, done, date, hour, position) 
        VALUES (:name, :done, :date, :hour, :position)", $task);
    }
}

header('Content-Type: application/json');

if ($db->changes()) {
    echo json_encode(['accept' => 'Operation completed']);
} else {
    echo json_encode(['error' => 'Something went wrong']);
}