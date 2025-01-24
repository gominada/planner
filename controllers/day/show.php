<?php

use Core\Database;

$db = new Database("../tasks.db");

$tasks = $db->query(
    "SELECT * FROM task WHERE date = :date", $_GET
)->fetchAll();

header('Content-Type: application/json');

echo json_encode($tasks);