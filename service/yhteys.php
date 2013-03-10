<?php
try {
    $yhteys = new PDO("mysql:host=localhost;dbname=db", "user", "pass");
} catch (PDOException $e) {
    die("ERROR WITH DB CONNECTION: " . $e->getMessage());
}
$yhteys->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>