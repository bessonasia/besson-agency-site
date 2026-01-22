<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Если вдруг сайт открывается с www/без www — CORS на всякий случай.
// Для same-origin не нужен, но поможет если домен гуляет.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'https://besson.asia',
  'https://www.besson.asia',
];
if ($origin && in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: {$origin}");
  header("Vary: Origin");
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Accept");
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

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

if (($f['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
  out(false, ['error' => 'Ошибка загрузки файла', 'code' => 'UPLOAD_ERR', 'detail' => (int)$f['error']]);
}

$MAX_MB = 50;
$MAX_BYTES = $MAX_MB * 1024 * 1024;

$size = (int)($f['size'] ?? 0);
if ($size <= 0) {
  out(false, ['error' => 'Пустой файл', 'code' => 'EMPTY']);
}
if ($size > $MAX_BYTES) {
  out(false, ['error' => "Файл слишком большой. Максимум {$MAX_MB}MB", 'code' => 'TOO_BIG']);
}

$origName = (string)($f['name'] ?? 'file');
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

$allowedExt = ['pdf','doc','docx','ppt','pptx','xls','xlsx','zip','rar','7z','png','jpg','jpeg'];
if (!$ext || !in_array($ext, $allowedExt, true)) {
  out(false, ['error' => 'Недопустимый тип файла', 'code' => 'BAD_EXT']);
}

// Папка ВНЕ httpdocs: /_uploads/tender_docs
$baseDir  = dirname(__DIR__, 2);          // из /httpdocs/api -> на уровень выше httpdocs
$storeDir = $baseDir . '/_uploads/tender_docs';

if (!is_dir($storeDir)) {
  if (!mkdir($storeDir, 0755, true)) {
    out(false, ['error' => 'Не удалось создать папку хранения', 'code' => 'MKDIR']);
  }
}
if (!is_writable($storeDir)) {
  out(false, ['error' => 'Папка хранения недоступна для записи', 'code' => 'NOT_WRITABLE']);
}

// Генерим безопасное имя
$rand = bin2hex(random_bytes(8));
$stamp = date('Ymd_His');
$storedName = "{$stamp}_{$rand}.{$ext}";
$dest = $storeDir . '/' . $storedName;

$tmp = (string)($f['tmp_name'] ?? '');
if (!$tmp || !is_uploaded_file($tmp)) {
  out(false, ['error' => 'Некорректный временный файл', 'code' => 'TMP']);
}

if (!move_uploaded_file($tmp, $dest)) {
  out(false, ['error' => 'Не удалось сохранить файл', 'code' => 'MOVE_FAIL']);
}

// Публичная ссылка идёт через doc.php, потому что файл лежит вне web-root
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'besson.asia';
$url = "{$scheme}://{$host}/api/doc.php?f=" . rawurlencode($storedName);

out(true, [
  'url'  => $url,
  'name' => $origName,
  'size' => $size,
  'type' => (string)($f['type'] ?? ''),
]);
