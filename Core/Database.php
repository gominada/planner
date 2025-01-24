<?php

namespace Core;

class Database
{
    private $db;
    private $statement;
    private $state = true;

    public function __construct($databaseName)
    {
        $this->db = new \SQLite3($databaseName);
    }

    public function query($query, $params = [])
    {
        $this->statement = $this->db->prepare($query);

        $keys = array_keys($params);
        foreach ($keys as $key) {
            $this->statement->bindValue($key, $params[$key]);
        }

        $this->statement = $this->statement->execute();

        if (!$this->statement) {
            $this->state = false;
            return false;
        }

        return $this;
    }

    public function fetch()
    {
        return $this->statement->fetchArray(SQLITE3_ASSOC);
    }

    public function fetchAll()
    {
        $items = [];

        while ($item = $this->statement->fetchArray(SQLITE3_ASSOC)) {
            $items[] = $item;
        }

        return $items;
    }

    public function changes()
    {
        return $this->state;
    }

}