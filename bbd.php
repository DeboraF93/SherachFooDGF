<?php //CONEXION
header("Content-type: application/json; charset=utf-8");

$servidor =  "localhost";
$usuario = "root";
$password = "";
$base_datos = "proyecto_final";

//Creo la conexion
$conn = mysqli_connect($servidor, $usuario, $password, $base_datos);

//Verificacion de la conexion

 if ($conn->connect_error) {
    die("Conexión fallida - ERROR de conexión: " . $conn->connect_error);
 }



