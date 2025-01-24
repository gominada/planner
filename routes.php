<?php

// Dayly routes
$router->get('/', 'controllers/day/index.php');

$router->get('/day', 'controllers/day/show.php');
$router->post('/day', 'controllers/day/store.php');
$router->delete('/day', 'controllers/day/destroy.php');


$router->get('/statistics', 'controllers/statistics/index.php');
$router->get('/statistics/analysis', 'controllers/statistics/show.php');
