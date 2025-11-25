<?php
// Destruir la sesión actual
session_start();
session_unset();
session_destroy();

// Redirigir al sistema de login de Kernel Enterprise
header("Location: /Kernel Enterprise/Sistema de login/login.php");
exit;
