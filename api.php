<?php
function getConnection() {
    $host = 'localhost';
    $db = 'pc_clicker';
    $user = 'root';
    $pass = '';

    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

// Cerrar conexión
function closeConnection($conn) {
    $conn->close();
}

// Obtener progreso del usuario
function getProgress($conn, $user_id) {
    $stmt = $conn->prepare("SELECT * FROM progress WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $progress = $result->fetch_assoc();

    // INVENTARIO: dejar el valor tal cual en la BD (string) para que el cliente lo interprete.
    if ($progress && array_key_exists('inventario', $progress)) {
        $invRaw = $progress['inventario'];
        if ($invRaw === null) {
            $progress['inventario'] = '';
        } else {
            // Si en BD hay un JSON array, devolver como array para compatibilidad
            $maybe = json_decode($invRaw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($maybe)) {
                $progress['inventario'] = $maybe;
            } else {
                // devolver la cadena tal cual (ej "12112")
                $progress['inventario'] = $invRaw;
            }
        }
    } else {
        if ($progress) $progress['inventario'] = '';
    }

    // Asegura que krystal sea int. Sólo asigna default si NO existe o es NULL
    if ($progress) {
        if (array_key_exists('krystal', $progress) && $progress['krystal'] !== null) {
            $progress['krystal'] = intval($progress['krystal']);
        } else {
            $progress['krystal'] = 0;
        }
    }

    // Asegura que equippedItemIndex sea int o null
    if ($progress && array_key_exists('equippedItemIndex', $progress)) {
        $progress['equippedItemIndex'] = $progress['equippedItemIndex'] !== null ? intval($progress['equippedItemIndex']) : null;
    }
    return $progress;
}

// Guardar progreso del usuario
function saveProgress($conn, $user_id, $data) {
    $field_definitions = [
        'bitcoin' => 'i', 'incremento' => 'i', 'autoclicks' => 'i', 'autoclickerIncrement' => 'i', 'maxMonedas' => 'i',
        'gabinetepts' => 'i', 'gabcompradoM' => 'i', 'gabcompradoR' => 'i', 'gabcompradoC' => 'i', 'gabcompradoG' => 'i',
        'Clevel' => 'i', 'Rlevel' => 'i', 'Glevel' => 'i', 'Dlevel' => 'i', 'Molevel' => 'i', 'Gablevel' => 'i', 'Mlevel' => 'i', 'Elevel' => 'i',
        'fondoActual' => 's', 'fondoEquipado' => 's', 'inventario' => 's',
        'krystal' => 'i', 'equippedItemIndex' => 'i',
        'fondos_comprados' => 's', 'misiones_completadas' => 's', 'misiones_niveles' => 's',
        'cajas_abiertas' => 'i', 'max_bitcoins' => 'i', 'total_clicks' => 'i', 'total_bitcoins' => 'i', 'mejoras_compradas' => 's'
    ];
    $fields = array_keys($field_definitions);
    $placeholders = implode('=?, ', $fields) . '=?';
    $types = '';

    // Obtener valores crudos actuales de la BD para fallback (evita sobrescribir con [] / 0)
    $rawInventario = null;
    $rawKrystal = null;
    $rawEquipped = null;
    $rawStmt = $conn->prepare("SELECT inventario, krystal, equippedItemIndex FROM progress WHERE user_id = ?");
    if ($rawStmt !== false) {
        $rawStmt->bind_param("i", $user_id);
        if ($rawStmt->execute()) {
            $rawRes = $rawStmt->get_result();
            $rawRow = $rawRes ? $rawRes->fetch_assoc() : null;
            if ($rawRow) {
                $rawInventario = array_key_exists('inventario', $rawRow) ? $rawRow['inventario'] : null;
                $rawKrystal = array_key_exists('krystal', $rawRow) ? $rawRow['krystal'] : null;
                $rawEquipped = array_key_exists('equippedItemIndex', $rawRow) ? $rawRow['equippedItemIndex'] : null;
            }
        }
        // no fatal si falla el SELECT; seguir con lo que tengamos
    }

    $progress = getProgress($conn, $user_id); // carga la versión procesada (decodificada)

    $values = [];
    foreach ($fields as $f) {
        $type = $field_definitions[$f];

        $hasFieldInRequest = array_key_exists($f, $data);

        // Manejo especial para inventario: aceptar array, JSON string o cadena de IDs y guardarlo tal cual en la columna inventario (TEXT)
        if ($f === 'inventario') {
            if ($hasFieldInRequest) {
                $value = $data[$f];
                if (is_array($value)) {
                    // cliente envió array -> serializar a JSON
                    $values[] = json_encode($value);
                } elseif (is_string($value)) {
                    // Si la cadena es solo dígitos o dígitos con comas (ej "1,2,11" o "12112"), guardarla tal cual
                    if (preg_match('/^[0-9,]+$/', $value)) {
                        $values[] = $value;
                    } else {
                        // Podría ser JSON serializado u otra cadena; guardarla tal cual si no está vacía
                        $values[] = $value !== '' ? $value : ($rawInventario !== null ? $rawInventario : '');
                    }
                } elseif ($value === null) {
                    // Cliente indicó null -> conservar valor crudo de BD si existe, si no cadena vacía
                    $values[] = ($rawInventario !== null) ? $rawInventario : '';
                } else {
                    // Otros tipos -> forzar serialización segura
                    $values[] = json_encode($value);
                }
            } else {
                // No enviado: conservar el valor crudo de la BD si existe; si no, usar progreso procesado; si tampoco, cadena vacía
                if ($rawInventario !== null) {
                    $values[] = $rawInventario;
                } elseif ($progress && isset($progress['inventario'])) {
                    // Si getProgress devolvió un array, serializar; si devolvió string, guardar tal cual
                    if (is_array($progress['inventario'])) {
                        $values[] = json_encode($progress['inventario']);
                    } else {
                        $values[] = $progress['inventario'];
                    }
                } else {
                    $values[] = '';
                }
            }
            $types .= $type;
            continue;
        }

        // Manejo especial para krystal: preferir el valor enviado, si no, conservar BD/progreso
        if ($f === 'krystal') {
            if ($hasFieldInRequest) {
                $val = $data[$f];
                $values[] = isset($val) && $val !== '' ? (int)$val : 0;
            } else {
                if ($rawKrystal !== null) {
                    $values[] = (int)$rawKrystal;
                } elseif ($progress && isset($progress['krystal'])) {
                    $values[] = (int)$progress['krystal'];
                } else {
                    $values[] = 0; // default si no existe en BD ni en progreso
                }
            }
            $types .= $type;
            continue;
        }

        // Manejo general: si el cliente envía el campo lo tomamos, si no usamos el progreso cargado o null/0
        if ($hasFieldInRequest) {
            $value = $data[$f];
        } else {
            $value = $progress ? (array_key_exists($f, $progress) ? $progress[$f] : null) : null;
        }

        if ($type === 'i') {
            $values[] = isset($value) && $value !== '' ? (int)$value : 0;
        } else {
            $values[] = isset($value) ? $value : null;
        }
        $types .= $type;
    }

    // Re-cargar progreso para comprobar existencia (se mantiene la lógica existente)
    $progressExists = $progress ? true : false;
    if ($progressExists) {
        $stmt = $conn->prepare("UPDATE progress SET $placeholders WHERE user_id=?");
        $values[] = $user_id;
        $types .= 'i';
        if ($stmt === false) {
            error_log("SQL error (prepare): " . $conn->error);
            echo json_encode(['ok' => false, 'error' => 'DB prepare error']);
            exit;
        }
        $stmt->bind_param($types, ...refValues($values));
        if (!$stmt->execute()) {
            error_log("SQL error (execute): " . $stmt->error);
            echo json_encode(['ok' => false, 'error' => 'DB execute error']);
            exit;
        }
    } else {
        $cols = implode(',', $fields) . ',user_id';
        $qs = implode(',', array_fill(0, count($fields)+1, '?'));
        $stmt = $conn->prepare("INSERT INTO progress ($cols) VALUES ($qs)");
        $values[] = $user_id;
        $types .= 'i';
        if ($stmt === false) {
            error_log("SQL error (prepare): " . $conn->error);
            echo json_encode(['ok' => false, 'error' => 'DB prepare error']);
            exit;
        }
        $stmt->bind_param($types, ...refValues($values));
        if (!$stmt->execute()) {
            error_log("SQL error (execute): " . $stmt->error);
            echo json_encode(['ok' => false, 'error' => 'DB execute error']);
            exit;
        }
    }
}

// Helper para referencias en bind_param
function refValues($arr) {
    // PHP 5.3+ compatible
    $refs = [];
    foreach ($arr as $key => $value) {
        $refs[$key] = &$arr[$key];
    }
    return $refs;
}

// --- API endpoint para guardar progreso vía AJAX ---
if (isset($_GET['save']) && $_GET['save'] == '1') {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['ok' => false, 'error' => 'No autenticado']);
        exit;
    }
    $user_id = $_SESSION['user_id'];
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $conn = getConnection();
    saveProgress($conn, $user_id, $data);
    closeConnection($conn);
    echo json_encode(['ok' => true]);
    exit;
}

// --- API endpoint para cargar progreso vía AJAX ---
if (isset($_GET['load']) && $_GET['load'] == '1') {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['ok' => false, 'error' => 'No autenticado']);
        exit;
    }
    $user_id = $_SESSION['user_id'];
    $conn = getConnection();
    $progress = getProgress($conn, $user_id);
    closeConnection($conn);
    echo json_encode(['ok' => true, 'progress' => $progress]);
    exit;
}

// Otras funciones de la API...

?>