<?php
declare(strict_types=1);

$f = isset($_GET['f']) ? (string)$_GET['f'] : '';
$n = isset($_GET['n']) ? (string)$_GET['n'] : '';

if ($f === '') {
  http_response_code(404);
  echo 'Not found';
  exit;
}

// Разрешаем только безопасные имена вида 32hex.ext
if (!preg_match('/^[a-f0-9]{32}\.[a-z0-9]{1,6}$/i', $f)) {
  http_response_code(400);
  echo 'Bad request';
  exit;
}

$baseDir = dirname(__DIR__, 2); // .../ (на уровень выше httpdocs)
$storeDir = $baseDir . '/_uploads/tender_docs';
$path = $storeDir . '/' . $f;

if (!is_file($path)) {
  http_response_code(404);
  echo 'Not found';
  exit;
}

$downloadName = $n !== '' ? $n : $f;
// примитивная очистка имени файла
$downloadName = preg_replace('/[^\pL\pN\.\-\_\(\)\s]+/u', '', $downloadName) ?: $f;

$mime = 'application/octet-stream';
if (function_exists('finfo_open')) {
  $fi = finfo_open(FILEINFO_MIME_TYPE);
  if ($fi) {
    $m = finfo_file($fi, $path);
    if (is_string($m) && $m !== '') $mime = $m;
    finfo_close($fi);
  }
}

header('Content-Type: ' . $mime);
header('Content-Length: ' . (string)filesize($path));
header('Content-Disposition: attachment; filename="' . str_replace('"', '', $downloadName) . '"');
header('X-Content-Type-Options: nosniff');

readfile($path);
exit;
