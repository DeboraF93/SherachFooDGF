<?php
//LOGGEO
include "./bbd.php";
if ($_POST['accion'] == 'loggeo') {

    $salida = [
        "respuesta" => ""
    ];
    
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM tb_ususrio WHERE usuario = ? AND contraseña = ?");
    $stmt->bind_param("ss", $usuario, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $respuestos = $result->fetch_assoc();
    } else {
        $respuestos = "";
    }

    $salida['respuesta'] = $respuestos;
    echo json_encode($salida);
}

//REGISTRO
if ($_POST['accion'] == 'registro') {

    $salida = [
        "respuesta" => ""
    ];

    $usuario = $_POST['usuario1'];
    $password = $_POST['password1'];
    $email = $_POST['email'];

    // Primero, verifiquemos si el usuario ya existe
    $stmt = $conn->prepare("SELECT * FROM tb_ususrio WHERE usuario = ? AND email = ?");
    $stmt->bind_param("ss", $usuario, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $respuestos = "";
    } else {
        // Si no existe, procedemos a la inserción
        $stmt = $conn->prepare("INSERT INTO tb_ususrio (usuario, contraseña, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $usuario, $password, $email);
        $ejecutarSql = $stmt->execute();

        if ($ejecutarSql) {
            $respuestos = "Usuario registrado exitosamente";
        } else {
            $respuestos = "Error en el registro";
        }
    }

    $salida['respuesta'] = $respuestos;
    echo json_encode($salida);
}

?>