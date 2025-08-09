// Hàm tạo mã hash 16 ký tự từ thông tin người dùng
function generateUserHash() {
  // Lấy các thông tin có sẵn từ trình duyệt
  const userData = [
    navigator.userAgent,
    navigator.platform,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    navigator.language
  ].join('|');

  // Tạo hash 16 ký tự
  let hash = '';
  for (let i = 0; i < 16; i++) {
    const charCode = userData.charCodeAt(i % userData.length);
    hash += (charCode % 36).toString(36); // Chuyển sang base36 (0-9a-z)
  }

  return hash;
}

// Hàm kiểm tra và xử lý URL
function processDynamicURL() {
  const pathParts = window.location.pathname.split('/');
  const userHash = pathParts[pathParts.length - 1];

  // Nếu URL không có hash hoặc không đúng định dạng
  if (!userHash || userHash.length !== 16 || userHash === 'keysystem') {
    const newHash = generateUserHash();
    
    // Lưu hash vào cookie (có hạn 30 ngày)
    document.cookie = `user_hash=${newHash}; max-age=${30*24*60*60}; path=/`;
    
    // Chuyển hướng đến URL mới với hash
    window.location.href = `https://xfearyzer.github.io/keysystem/${newHash}`;
    return;
  }

  // Kiểm tra cookie có khớp với hash trong URL không
  const cookieHash = document.cookie.replace(/(?:(?:^|.*;\s*)user_hash\s*=\s*([^;]*).*$)|^.*$/, '$1');
  
  if (cookieHash !== userHash) {
    // Nếu không khớp, tạo lại hash mới
    const newHash = generateUserHash();
    document.cookie = `user_hash=${newHash}; max-age=${30*24*60*60}; path=/`;
    window.location.href = `https://xfearyzer.github.io/keysystem/${newHash}`;
    return;
  }

  // Nếu mọi thứ hợp lệ, tiếp tục hiển thị key
  initializeKeySystem();
}

// Hàm chính khởi tạo hệ thống key
function initializeKeySystem() {
  // Lấy hash từ URL
  const pathParts = window.location.pathname.split('/');
  const userHash = pathParts[pathParts.length - 1];
  
  // Kiểm tra key hiện có trong localStorage
  const savedKey = localStorage.getItem(`toolKey_${userHash}`);
  const expiry = localStorage.getItem(`keyExpiry_${userHash}`);
  const now = new Date().getTime();
  
  if (savedKey && expiry && now < expiry) {
    // Hiển thị key đã có
    displayKey(savedKey, new Date(parseInt(expiry)));
  } else {
    // Tạo key mới
    const newKey = generateKey();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 ngày hết hạn
    
    localStorage.setItem(`toolKey_${userHash}`, newKey);
    localStorage.setItem(`keyExpiry_${userHash}`, expiryDate.getTime());
    
    displayKey(newKey, expiryDate);
  }
}

// Hàm tạo key ngẫu nhiên
function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TOOL-${key}`;
}

// Hàm hiển thị key
function displayKey(key, expiryDate) {
  // ... (giữ nguyên phần hiển thị key từ code trước)
}

// Khởi chạy khi trang load
document.addEventListener('DOMContentLoaded', processDynamicURL);
