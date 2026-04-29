<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'File is missing']);
  exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Upload failed']);
  exit;
}

$maxBytes = 50 * 1024 * 1024;
if ((int)$file['size'] > $maxBytes) {
  http_response_code(413);
  echo json_encode(['ok' => false, 'error' => 'File is too large']);
  exit;
}

$allowed = [
  'pdf' => 'application/pdf',
  'doc' => 'application/msword',
  'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'zip' => 'application/zip',
  'rar' => 'application/vnd.rar',
  '7z' => 'application/x-7z-compressed',
  'png' => 'image/png',
  'jpg' => 'image/jpeg',
  'jpeg' => 'image/jpeg',
];

$originalName = (string)$file['name'];
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!array_key_exists($extension, $allowed)) {
  http_response_code(415);
  echo json_encode(['ok' => false, 'error' => 'Unsupported file type']);
  exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']) ?: 'application/octet-stream';

$uploadRoot = dirname(__DIR__) . '/uploads';
$monthDir = date('Y-m');
$targetDir = $uploadRoot . '/' . $monthDir;

if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Cannot create upload directory']);
  exit;
}

$safeBase = preg_replace('/[^a-zA-Z0-9._-]+/', '-', pathinfo($originalName, PATHINFO_FILENAME));
$safeBase = trim((string)$safeBase, '-_.');
if ($safeBase === '') {
  $safeBase = 'document';
}

$fileName = date('Ymd-His') . '-' . bin2hex(random_bytes(5)) . '-' . $safeBase . '.' . $extension;
$targetPath = $targetDir . '/' . $fileName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Cannot save uploaded file']);
  exit;
}

chmod($targetPath, 0644);

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? '';
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/\\');
$siteRoot = preg_replace('#/api$#', '', $basePath);
$url = $scheme . '://' . $host . $siteRoot . '/uploads/' . rawurlencode($monthDir) . '/' . rawurlencode($fileName);

echo json_encode([
  'ok' => true,
  'url' => $url,
  'name' => $originalName,
  'size' => (int)$file['size'],
  'type' => $mime,
], JSON_UNESCAPED_SLASHES);
