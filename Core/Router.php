<?php

namespace Core;

class Router 
{
    protected $routes = [];

    public function add($method, $uri, $controller)  
    {
        $this->routes[] = [
            'method' => $method,
            'uri' => $uri,
            'controller' => $controller
        ];
    }

    public function get($uri, $controller) 
    {
        $this->add($method = 'GET', $uri, $controller);
    }

    public function post($uri, $controller) 
    {
        $this->add($method = 'POST', $uri, $controller);
    }

    public function delete($uri, $controller) 
    {
        $this->add($method = 'DELETE', $uri, $controller);
    }

    public function route($method, $uri) 
    {

        foreach ($this->routes as $route) {
            if ($route['uri'] === $uri && $route['method'] === strtoupper($method)) {
                return require base_path($route['controller']);
            }
        }

        $this->abort();
    }

    public function abort($code = 404) 
    {
        http_response_code($code);
        view("{$code}.view.php");
        die();
    }
}