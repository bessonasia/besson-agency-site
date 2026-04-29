<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
$secret = '2d4e41d87d6f2d36853da98f55307f178be0';
$token = $_GET['token'] ?? '';
if (!hash_equals($secret, (string)$token)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Forbidden']);
  exit;
}
if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', ['POST', 'PUT'], true)) {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}
$target = __DIR__ . '/showreel2.mp4';
$tmp = $target . '.part';
$in = fopen('php://input', 'rb');
$out = fopen($tmp, 'wb');
if (!$in || !$out) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Cannot open streams']);
  exit;
}
$bytes = stream_copy_to_stream($in, $out);
fclose($in);
fclose($out);
if (!$bytes || $bytes < 1024) {
  @unlink($tmp);
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Empty upload']);
  exit;
}
if (!rename($tmp, $target)) {
  @unlink($tmp);
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Cannot save file']);
  exit;
}
chmod($target, 0644);
@unlink(__FILE__);
echo json_encode(['ok' => true, 'bytes' => $bytes, 'url' => 'https://' . ($_SERVER['HTTP_HOST'] ?? 'besson.asia') . '/assets/video/showreel2.mp4'], JSON_UNESCAPED_SLASHES);
