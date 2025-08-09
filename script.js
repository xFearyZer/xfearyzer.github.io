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
    document.getElementById('key-container').innerHTML = `<div class="key-display">${key}</div>`;
}

document.getElementById('getKeyBtn').addEventListener('click', () => {
    const newKey = generateKey();
    saveKey(newKey);
    showKey(newKey);
});

// Khi load trang
loadKey();
