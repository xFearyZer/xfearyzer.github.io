// admin.js - load danh sách key và cho phép xóa
async function loadKeys() {
  const tbody = document.querySelector('#keyTable tbody');
  tbody.innerHTML = '<tr><td colspan="4" class="muted">Đang tải...</td></tr>';
  try {
    const snap = await database.ref('keys').orderByChild('createdAt').once('value');
    const data = snap.val() || {};
    const arr = Object.entries(data).map(([id, v]) => ({id, ...v}));
    const filter = document.getElementById('filter').value.trim().toUpperCase();
    tbody.innerHTML = '';
    arr.reverse(); // mới nhất trước
    arr.forEach(item => {
      if (filter && !item.key.toUpperCase().includes(filter)) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.key}</td><td>${item.createdAt||''}</td><td>${item.ip||''}</td>
                      <td><button class="actionBtn" data-id="${item.id}">Xóa</button></td>`;
      tbody.appendChild(tr);
    });
    // attach delete handlers
    document.querySelectorAll('.actionBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (!confirm('Xác nhận xóa key?')) return;
        await database.ref('keys/'+id).remove();
        loadKeys();
      });
    });
    if (!arr.length) tbody.innerHTML = '<tr><td colspan="4" class="muted">Chưa có key.</td></tr>';
  } catch(err) {
    tbody.innerHTML = '<tr><td colspan="4" class="muted">Lỗi khi tải dữ liệu.</td></tr>';
    console.error(err);
  }
}

document.getElementById('refreshBtn').addEventListener('click', loadKeys);
document.getElementById('filter').addEventListener('input', loadKeys);

window.addEventListener('DOMContentLoaded', loadKeys);
