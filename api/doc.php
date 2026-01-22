<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function out(bool $ok, array $payload = []): void {
  echo json_encode(array_merge(['ok' => $ok], $payload), JSON_UNESCAPED_UNICODE);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  out(false, ['error' => 'Method not allowed', 'code' => 'METHOD']);
}

if (!isset($_FILES['file'])) {
  out(false, ['error' => 'Файл не получен', 'code' => 'NO_FILE']);
}

$f = $_FILES['file'];

if (!empty($f['error']) && $f['error'] !== UPLOAD_ERR_OK) {
  out(false, ['error' => 'Ошибка загрузки файла', 'code' => 'UPLOAD_ERR', 'php_error' => $f['error']]);
}

$MAX_MB = 50;
$MAX_BYTES = $MAX_MB * 1024 * 1024;

if (($f['size'] ?? 0) > $MAX_BYTES) {
  out(false, ['error' => "Файл слишком большой. Максимум {$MAX_MB}MB", 'code' => 'TOO_LARGE']);
}

$allowedExt = ['pdf','doc','docx','ppt','pptx','xls','xlsx','zip','rar','7z','png','jpg','jpeg'];

$origName = (string)($f['name'] ?? 'file');
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

if (!$ext || !in_array($ext, $allowedExt, true)) {
  out(false, ['error' => 'Недопустимый тип файла', 'code' => 'BAD_EXT']);
}

// Папка вне httpdocs: /_uploads/tender_docs
$baseDir = dirname(__DIR__, 2); // .../ (на уровень выше httpdocs)
$storeDir = $baseDir . '/_uploads/tender_docs';

if (!is_dir($storeDir) && !mkdir($storeDir, 0755, true)) {
  out(false, ['error' => 'Не удалось создать папку хранения', 'code' => 'MKDIR']);
}

if (!is_writable($storeDir)) {
  out(false, ['error' => 'Папка хранения недоступна для записи', 'code' => 'NOT_WRITABLE']);
}

$token = bin2hex(random_bytes(16));
$saveName = $token . '.' . $ext;
$savePath = $storeDir . '/' . $saveName;

if (!move_uploaded_file((string)$f['tmp_name'], $savePath)) {
  out(false, ['error' => 'Не удалось сохранить файл', 'code' => 'MOVE_FAIL']);
}

// Ссылка отдачи через doc.php (привязка к твоему серверу)
$publicUrl = '/api/doc.php?f=' . rawurlencode($saveName) . '&n=' . rawurlencode($origName);

out(true, [
  'url'  => $publicUrl,
  'name' => $origName,
  'size' => (int)($f['size'] ?? 0),
  'type' => (string)($f['type'] ?? '')
]);
