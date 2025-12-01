<?php

switch ($method) {
  case 'GET':
    handleGetGifts($pdo);
    break;
  case 'PATCH':
    if (strpos($route, 'block') > -1) {
      handleBlockGift($pdo, $input, $route);
    } else
      handleUpdateGift($pdo, $input, $route);
    break;
  default:
    echo json_encode(['message' => 'Invalid request method: ' . $method . " in route: " . $route]);
}

function handleGetGifts($pdo)
{
  $sql = "SELECT * FROM gift ORDER BY status ASC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($result);
}

function handleBlockGift($pdo, $input, $route)
{
  try {
    date_default_timezone_set("America/Mexico_City");

    $id = explode('/', $route)[2];
    $sql = "UPDATE gift SET status=1, username=:username, email=:email, purchase_date= :purchaseDate WHERE id=:id AND status=0";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute(['username' => $input['username'], 'email' => $input['email'], 'purchaseDate' => date('d/m/Y,H:i:s'), 'id' => $id]);
    echo json_encode(['message' => 'Gift updated successfully', 'result' => $result]);
  } catch (ErrorException $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
}

function handleUpdateGift($pdo, $input, $route)
{
  http_response_code(500);
  try {
    $id = explode('/', $route)[1];
    $sql = "UPDATE gift 
      SET title=:title, image=:image, description=:description, links=:links WHERE id=:id";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute(['title' => $input['title'], 'image' => $input['image'], 'description' => $input['description'], 'links' => $input['links'], 'id' => $id]);
    http_response_code(200);
    echo json_encode(['message' => 'Gift updated successfully', 'result' => $result]);
  } catch (ErrorException $e) {
    echo json_encode(['message' => $e->getMessage()]);
  }
}
