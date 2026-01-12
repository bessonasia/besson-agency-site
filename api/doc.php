<?php
declare(strict_types=1);

$id = isset($_GET['id']) ? preg_replace('/[^A-Za-z0-9\-]/', '', (string)$_GET['id']) : '';
$t  = isset($_GET['t'])  ? preg_replace('/[^a-f0-9]/', '', strtolower((string)$_GET['t'])) : '';

if (!$id || strlen($t) < 20) {
  http_response_code(400);
  echo 'Bad request';
  exit;
}

$vaultRoot = dirname(dirname(__DIR__)) . '/_vault_besson_docs';
$metaFile  = $vaultRoot . '/' . $id . '.json';

if (!is_file($metaFile)) {
  http_response_code(404);
  echo 'Not found';
  exit;
}

$meta = json_decode((string)file_get_contents($metaFile), true);
if (!is_array($meta) || ($meta['token'] ?? '') !== $t) {
  http_response_code(403);
  echo 'Forbidden';
  exit;
}

$filePath = $vaultRoot . '/' . (string)($meta['file'] ?? '');
if (!is_file($filePath)) {
  http_response_code(404);
  echo 'File missing';
  exit;
}

$orig = (string)($meta['orig'] ?? 'document');
$size = (int)($meta['size'] ?? filesize($filePath));

header('Content-Type: application/octet-stream');
header('Content-Length: ' . $size);
header('Content-Disposition: attachment; filename="' . rawurlencode($orig) . '"');
header('X-Content-Type-Options: nosniff');

readfile($filePath);

