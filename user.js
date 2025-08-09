// user.js - tạo key, lưu localStorage + push lên Realtime Database
function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rnd = '';
  for (let i=0;i<10;i++) rnd += chars.charAt(Math.floor(Math.random()*chars.length));
  return `KEY1WEEK_${rnd}`;
}

function saveLocal(key) {
  const now = Date.now();
  const expiry = now + 7*24*60*60*1000;
  localStorage.setItem('tool_key', key);
  localStorage.setItem('tool_key_expiry', expiry.toString());
}

function loadLocal() {
  const key = localStorage.getItem('tool_key');
  const exp = parseInt(localStorage.getItem('tool_key_expiry')||'0',10);
  if (key && Date.now() < exp) return key;
  localStorage.removeItem('tool_key'); localStorage.removeItem('tool_key_expiry');
  return null;
}

async function getIP() {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const j = await r.json();
    return j.ip || 'Unknown';
  } catch(e) { return 'Unknown'; }
}

function showKey(key) {
  document.getElementById('getKeyBtn').style.display = 'none';
  const kd = document.getElementById('keyDisplay');
  kd.style.display = 'inline-block';
  kd.textContent = key;
}

document.addEventListener('DOMContentLoaded', () => {
  const existing = loadLocal();
  if (existing) showKey(existing);

  document.getElementById('getKeyBtn').addEventListener('click', async () => {
    const key = generateKey();
    saveLocal(key);
    showKey(key);

    const ip = await getIP();
    const now = new Date().toLocaleString();
    // push to realtime db
    try {
      await database.ref('keys').push({
        key: key,
        createdAt: now,
        expiry: Date.now() + 7*24*60*60*1000,
        ip: ip,
        ua: navigator.userAgent || ''
      });
    } catch(err) {
      console.error('DB push error', err);
    }
  });
});
