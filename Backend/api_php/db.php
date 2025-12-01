<?php
$host = 'db5019107587.hosting-data.io'; // Your MySQL host
$dbname = 'dbs15021099'; // The database you want to connect to
$user = 'dbu2748503'; // Your MySQL username
$password = 'Andrew#Lennon_bb1981'; // Your MySQL password

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Connection failed: " . $e->getMessage());
}
