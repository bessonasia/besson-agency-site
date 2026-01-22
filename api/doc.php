<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function respond(array $payload, int $code = 200): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fail(string $msg, int $code = 400): void {
  respond(['success' => false, 'error' => $msg], $code);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  fail('Method not allowed', 405);
}

if (!isset($_FILES['file'])) {
  fail('Файл не получен');
}

$f = $_FILES['file'];

if (!isset($f['error']) || is_array($f['error'])) {
  fail('Некорректная загрузка файла');
}

if ($f['error'] !== UPLOAD_ERR_OK) {
  $map = [
    UPLOAD_ERR_INI_SIZE   => 'Файл превышает лимит PHP (upload_max_filesize).',
    UPLOAD_ERR_FORM_SIZE  => 'Файл превышает лимит формы.',
    UPLOAD_ERR_PARTIAL    => 'Файл загружен частично.',
    UPLOAD_ERR_NO_FILE    => 'Файл не выбран.',
    UPLOAD_ERR_NO_TMP_DIR => 'Нет временной папки на сервере.',
    UPLOAD_ERR_CANT_WRITE => 'Не удалось записать файл на диск.',
    UPLOAD_ERR_EXTENSION  => 'Загрузка остановлена расширением PHP.',
  ];
  fail($map[$f['error']] ?? 'Ошибка загрузки файла');
}

$MAX_BYTES = 50 * 1024 * 1024; // 50MB
if (($f['size'] ?? 0) > $MAX_BYTES) {
  fail('Файл слишком большой. Максимум 50MB.');
}

$origName = (string)($f['name'] ?? 'file');
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

$allowedExt = ['pdf','doc','docx','zip','rar','7z','png','jpg','jpeg'];
if (!in_array($ext, $allowedExt, true)) {
  fail('Недопустимый тип файла.');
}

$tmp = (string)$f['tmp_name'];
if (!is_uploaded_file($tmp)) {
  fail('Некорректный источник файла.');
}

$mime = '';
if (class_exists('finfo')) {
  $fi = new finfo(FILEINFO_MIME_TYPE);
  $mime = (string)($fi->file($tmp) ?: '');
}

$allowedMime = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.rar',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'image/png',
  'image/jpeg',
];

if ($mime !== '' && !in_array($mime, $allowedMime, true)) {
  // иногда архивы приходят как application/octet-stream — разрешаем только для архивов
  $okOctet = ($mime === 'application/octet-stream') && in_array($ext, ['zip','rar','7z'], true);
  if (!$okOctet) {
    fail('Недопустимый MIME-тип файла.');
  }
}

// Папка для загрузок (внутри httpdocs/uploads/tender)
$uploadDir = realpath(__DIR__ . '/..') . '/uploads/tender';
if ($uploadDir === false) {
  // если httpdocs не резолвится через realpath (редко), fallback
  $uploadDir = __DIR__ . '/../uploads/tender';
}

if (!is_dir($uploadDir)) {
  if (!mkdir($uploadDir, 0755, true)) {
    fail('Не удалось создать папку для загрузок.', 500);
  }
}

try {
  $rand = bin2hex(random_bytes(16));
} catch (Throwable $e) {
  $rand = bin2hex(openssl_random_pseudo_bytes(16));
}

$safeName = date('Ymd_His') . '_' . $rand . '.' . $ext;
$dest = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $safeName;

if (!move_uploaded_file($tmp, $dest)) {
  fail('Не удалось сохранить файл.', 500);
}

@chmod($dest, 0644);

// публичный URL
$publicPath = '/uploads/tender/' . rawurlencode($safeName);
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
$scheme = $https ? 'https' : 'http';
$host = (string)($_SERVER['HTTP_HOST'] ?? '');

$url = $host ? ($scheme . '://' . $host . $publicPath) : $publicPath;

respond([
  'success' => true,
  'url'     => $url,
  'name'    => $origName,
  'size'    => (int)$f['size'],
  'mime'    => $mime,
]);
