<?php
header("Content-Type: application/json");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$input = json_decode(file_get_contents('php://input'), true);

$route =  explode('api.php/', $uri)[1];
$start = strpos($route, '/');
$object = $start ? substr($route, 0, $start) : $route;

switch ($object) {
  case 'users':
    include 'users.php';
    break;
  case 'gifts':
    include 'gifts.php';
    break;
  default:
    echo json_encode(['message' => 'Invalid request method: '.$object]);
    break;
}


/* function handlePost($pdo, $input)
{
  $sql = "INSERT INTO users (name, email) VALUES (:name, :email)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(['name' => $input['name'], 'email' => $input['email']]);
  echo json_encode(['message' => 'User created successfully']);
}

function handlePut($pdo, $input)
{
  $sql = "UPDATE users SET name = :name, email = :email WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(['name' => $input['name'], 'email' => $input['email'], 'id' => $input['id']]);
  echo json_encode(['message' => 'User updated successfully']);
}

function handleDelete($pdo, $input)
{
  $sql = "DELETE FROM users WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(['id' => $input['id']]);
  echo json_encode(['message' => 'User deleted successfully']);
} */
