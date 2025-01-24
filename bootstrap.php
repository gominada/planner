<?php

$db = new SQLite3("../tasks.db");

$db->exec("CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(255) NOT NULL, 
    done BOOL NOT NULL,
    date DATE NOT NULL,
    hour INTEGER NOT NULL,
    position INTEGER NOT NULL,
    UNIQUE(hour, position, date)
);");

