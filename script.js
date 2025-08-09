function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `KEY1WEEK_${randomPart}`;
}

function saveKey(key) {
    const now = new Date();
    const expiry = now.getTime() + (7 * 24 * 60 * 60 * 1000); // 7 ngày
    localStorage.setItem('userKey', key);
    localStorage.setItem('keyExpiry', expiry);
}

function loadKey() {
    const savedKey = localStorage.getItem('userKey');
    const expiry = localStorage.getItem('keyExpiry');
    const now = new Date().getTime();

    if (savedKey && expiry && now < expiry) {
        showKey(savedKey);
        return true;
    }
    return false;
}

function showKey(key) {
    document.getElementById('keyDisplay').innerHTML = `
        <div class="key-display">
            <div>Your Key:</div>
            <div style="color: #00c6ff; font-size: 1.4rem; margin-top: 0.5rem;">${key}</div>
            <div style="font-size: 0.8rem; margin-top: 0.5rem; color: rgba(255,255,255,0.7);">
                Expires in 7 days
            </div>
        </div>
    `;
}

document.getElementById('getKeyBtn').addEventListener('click', async () => {
    const newKey = generateKey();
    saveKey(newKey);
    showKey(newKey);
    
    // Get public IP and send to Discord (optional)
    try {
        const res = await fetch('https://api64.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip || 'Unknown';
        
        const now = new Date();
        const expiry = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        const payload = {
            content: `📢 **Key mới được tạo**\n` +
                     `🔑 **Key:** \`${newKey}\`\n` +
                     `🌐 **IP:** ${ip}\n` +
                     `🔥 **Thời gian lấy key:** ${now.toLocaleString('vi-VN')}\n` +
                     `🌪️ **Thời gian hết hạn:** ${expiry.toLocaleString('vi-VN')}`
        };

        await fetch("https://canary.discord.com/api/webhooks/1403667787943120996/PA-03eIqcD8f8zT5YQD8eN0T9afY7wI6S5rT-ra1BU_9SfI4FVgQdnrAQ8z0a52jtYSs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Error sending to Discord:", error);
    }
});

// Load key when page loads
loadKey();