<?php
// Lấy IP người dùng
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// Tạo key chỉ gồm chữ in hoa và số
function generateKey() {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $key = 'KEYWEEK_';
    for ($i = 0; $i < 10; $i++) {
        $key .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $key;
}

$key = generateKey();
$ip = getUserIP();
$date = date('Y-m-d H:i:s');

// Gửi lên Discord webhook
$webhookURL = "https://canary.discord.com/api/webhooks/1403667787943120996/PA-03eIqcD8f8zT5YQD8eN0T9afY7wI6S5rT-ra1BU_9SfI4FVgQdnrAQ8z0a52jtYSs";
$data = [
    "content" => "📢 **Người dùng vừa lấy key!**\n🔑 Key: `$key`\n📅 Thời gian: $date\n🌐 IP: $ip"
];
$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json",
        'content' => json_encode($data)
    ]
];
file_get_contents($webhookURL, false, stream_context_create($options));

// Hiển thị key ra web
echo "<h1 style='font-family: Arial; text-align: center;'>$key</h1>";
?>
