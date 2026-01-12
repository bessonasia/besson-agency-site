<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$MAX_MB = 50;
$MAX_BYTES = $MAX_MB * 1024 * 1024;

$allowedExt = ['pdf','doc','docx','ppt','pptx','xls','xlsx','zip'];

function out(bool $ok, array $payload = []): void {
  echo json_encode(array_merge(['ok' => $ok], $payload), JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  out(false, ['error' => 'Method not allowed', 'code' => 'METHOD']);
}

if (!isset($_FILES['file'])) {
  out(false, ['error' => 'Файл не получен', 'code' => 'NO_FILE']);
}

$f = $_FILES['file'];

if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
  out(false, ['error' => 'Ошибка загрузки', 'code' => 'UPLOAD_ERR_' . (int)$f['error']]);
}

$size = (int)($f['size'] ?? 0);
if ($size <= 0 || $size > $MAX_BYTES) {
  out(false, ['error' => "Файл больше {$MAX_MB} MB или пустой", 'code' => 'SIZE_LIMIT']);
}

$origName = trim((string)($f['name'] ?? 'document'));
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExt, true)) {
  out(false, ['error' => 'Неподдерживаемый формат', 'code' => 'BAD_EXT']);
}

// ID документа + токен на скачивание
$docId = 'BA-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$token = bin2hex(random_bytes(16));

// Хранилище: папка рядом с httpdocs (уровнем выше)
$vaultRoot = dirname(dirname(__DIR__)) . '/_vault_besson_docs';

if (!is_dir($vaultRoot)) {
  @mkdir($vaultRoot, 0700, true);
}
if (!is_dir($vaultRoot) || !is_writable($vaultRoot)) {
  out(false, ['error' => 'Хранилище недоступно', 'code' => 'VAULT_NOT_WRITABLE']);
}

$safeFile = $docId . '.' . $ext;
$destPath = $vaultRoot . '/' . $safeFile;

if (!move_uploaded_file((string)$f['tmp_name'], $destPath)) {
  out(false, ['error' => 'Не удалось сохранить файл', 'code' => 'MOVE_FAILED']);
}

// meta по документу (для скачивания)
$metaFile = $vaultRoot . '/' . $docId . '.json';
$meta = [
  'doc_id' => $docId,
  'token' => $token,
  'file'  => $safeFile,
  'orig'  => $origName,
  'size'  => $size,
  'ts'    => date('c'),
];
@file_put_contents($metaFile, json_encode($meta, JSON_UNESCAPED_UNICODE));

// лог заявки (удобно для аудита)
$line = [
  'doc_id' => $docId,
  'orig' => $origName,
  'size' => $size,
  'ts' => date('c'),
  'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
  'lead_name'  => $_POST['lead_name'] ?? '',
  'lead_phone' => $_POST['lead_phone'] ?? '',
  'lead_email' => $_POST['lead_email'] ?? '',
];
@file_put_contents($vaultRoot . '/_meta.jsonl', json_encode($line, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);

$docUrl = 'https://besson.asia/api/doc.php?id=' . urlencode($docId) . '&t=' . urlencode($token);

out(true, [
  'doc_id' => $docId,
  'doc_name' => $origName,
  'doc_size' => $size,
  'doc_url' => $docUrl,
]);

