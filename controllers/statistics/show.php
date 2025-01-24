<?php

use Core\Database;

$db = new Database('../tasks.db');

$doneTasksByDate = $db->query("SELECT date, COUNT(*) AS 'completed'
                               FROM task 
                               WHERE done = 1 GROUP BY date"
)->fetchAll();

header('Content-Type: application/json');

echo json_encode($doneTasksByDate);