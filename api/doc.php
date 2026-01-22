<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

$f = $_GET['f'] ?? '';
$f = is_string($f) ? $f : '';
$f = basename($f);

// Разрешаем только наше безопасное имя (пример: 20260122_194500_ab12cd34ef56....pdf)
if (!$f || !preg_match('/^[0-9]{8}_[0-9]{6}_[a-f0-9]{16}\.[a-z0-9]{2,5}$/', $f)) {
  http_response_code(400);
  echo 'Bad request';
  exit;
}

$baseDir  = dirname(__DIR__, 2);
$storeDir = $baseDir . '/_uploads/tender_docs';
$path = $storeDir . '/' . $f;

if (!is_file($path)) {
  http_response_code(404);
  echo 'Not found';
  exit;
}

$size = filesize($path);
if ($size === false) $size = 0;

$mime = 'application/octet-stream';
if (function_exists('finfo_open')) {
  $fi = finfo_open(FILEINFO_MIME_TYPE);
  if ($fi) {
    $m = finfo_file($fi, $path);
    if (is_string($m) && $m) $mime = $m;
    finfo_close($fi);
  }
}

header('Content-Type: ' . $mime);
header('Content-Length: ' . (string)$size);
header('Content-Disposition: attachment; filename="' . $f . '"');
header('Cache-Control: private, max-age=0, no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$fp = fopen($path, 'rb');
if (!$fp) {
  http_response_code(500);
  echo 'Read error';
  exit;
}
while (!feof($fp)) {
  echo fread($fp, 8192);
}
fclose($fp);
