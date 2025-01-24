<?php

use Core\Database;

$db = new Database("../tasks.db");

$tasks = extract_request_body_json();

foreach ($tasks as $task) {

    $db->query(
    "DELETE FROM task 
    WHERE date = :date AND hour = :hour AND position = :position", $task);
}

header('Content-Type: application/json');

if ($db->changes()) {
    echo json_encode(['accept' => 'Operation completed']);
} else {
    echo json_encode(['error' => 'Something went wrong']);
}