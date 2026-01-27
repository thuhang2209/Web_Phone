// Base URL của API - sử dụng relative path để hoạt động trên cả local và Vercel
const API_BASE = '/api';

// DOM Elements
const phoneForm = document.getElementById('phoneForm');
const phoneIdInput = document.getElementById('phoneId');
const nameInput = document.getElementById('name');
const brandInput = document.getElementById('brand');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const imageInput = document.getElementById('image');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const phoneList = document.getElementById('phoneList');

// Load danh sách điện thoại khi mở trang
document.addEventListener('DOMContentLoaded', () => {
  fetchPhones();
});

// Submit form (thêm hoặc sửa)
phoneForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const phoneData = {
    name: nameInput.value.trim(),
    brand: brandInput.value.trim(),
    price: parseInt(priceInput.value),
    quantity: parseInt(quantityInput.value),
    image: imageInput.value.trim() || null
  };

  const isEditing = phoneIdInput.value;

  try {
    if (isEditing) {
      // Update
      await fetch(`${API_BASE}/phones/${phoneIdInput.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phoneData)
      });
    } else {
      // Create
      await fetch(`${API_BASE}/phones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phoneData)
      });
    }

    // Reset form & load lại dữ liệu
    resetForm();
    fetchPhones();
    showToast(isEditing ? "Sản phẩm đã được cập nhật!" : "Sản phẩm mới đã được thêm!");
  } catch (err) {
    alert('Lỗi: ' + (err.message || 'Không thể lưu sản phẩm'));
  }
});

// Hủy chỉnh sửa
cancelBtn.addEventListener('click', resetForm);

// Lấy danh sách điện thoại
async function fetchPhones() {
  try {
    const res = await fetch(`${API_BASE}/phones`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const phones = await res.json();
    
    // Kiểm tra xem phones có phải là mảng không
    if (!Array.isArray(phones)) {
      throw new Error('Dữ liệu trả về không phải mảng');
    }

    console.log('Dữ liệu nhận từ API:', phones); // ← Xem log
    renderPhones(phones);
  } catch (err) {
    console.error('Lỗi khi tải danh sách sản phẩm:', err);
    phoneList.innerHTML = `
      <div class="error-message">
        ❌ Không thể tải danh sách sản phẩm. 
        <br><small>Lỗi: ${err.message}</small>
      </div>
    `;
  }
}

// Hiển thị danh sách sản phẩm
function renderPhones(phones) {
  if (phones.length === 0) {
    phoneList.innerHTML = '<p class="empty">Không có sản phẩm nào.</p>';
    return;
  }

  phoneList.innerHTML = phones.map(phone => `
    <div class="product-card">
      <div class="product-image">
        <img src="${phone.image || 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(phone.name)}" alt="${phone.name}">
      </div>
      <div class="product-info">
        <h3>${phone.name}</h3>
        <div class="product-brand">Brand: ${phone.brand}</div>
        <div class="product-price">${phone.price.toLocaleString()} đ</div>
        <div class="product-quantity">Stock: ${phone.quantity} cái</div>
        <div class="product-actions">
          <button class="btn-edit" onclick="editPhone(${phone.id})">✏️ Sửa</button>
          <button class="btn-delete" onclick="deletePhone(${phone.id})">🗑️ Xóa</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Chỉnh sửa điện thoại
function editPhone(id) {
  fetch(`${API_BASE}/phones/${id}`)
    .then(res => res.json())
    .then(phone => {
      phoneIdInput.value = phone.id;
      nameInput.value = phone.name;
      brandInput.value = phone.brand;
      priceInput.value = phone.price;
      quantityInput.value = phone.quantity;
      submitBtn.textContent = '✅ Cập nhật sản phẩm';
      cancelBtn.style.display = 'inline-block';
    })
    .catch(err => alert('Lỗi khi tải sản phẩm: ' + err.message));
}

// Xóa điện thoại
async function deletePhone(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

  try {
    await fetch(`${API_BASE}/phones/${id}`, { method: 'DELETE' });
    fetchPhones(); // Reload
    showToast("Sản phẩm đã bị xóa!");
  } catch (err) {
    alert('Lỗi khi xóa sản phẩm: ' + err.message);
  }
}

// Reset form về trạng thái "thêm mới"
function resetForm() {
  phoneForm.reset();
  phoneIdInput.value = '';
  submitBtn.textContent = '✅ Lưu sản phẩm';
  cancelBtn.style.display = 'none';
}

// Hiển thị toast message
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Logout (demo)
document.getElementById('logoutBtn').addEventListener('click', () => {
  alert('Đã đăng xuất!');
  // window.location.href = '/login'; // nếu có login page
});