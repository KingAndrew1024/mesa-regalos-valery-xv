<?php

switch ($method) {
  case 'GET':
    handleGet($pdo);
  case 'POST':
    handlePost($pdo, $input);
    break;
  default:
    echo json_encode(['message' => 'Invalid request method: ' . $method . " in route: " . $route]);
}

function handleGet($pdo)
{
  $sql = "SELECT * FROM user";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($result);
}

function handlePost($pdo, $input)
{
  $sql = "SELECT * FROM user WHERE username=:username and password=:password";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(['username' => $input['user'], 'password' => $input['password']]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($result);
}
