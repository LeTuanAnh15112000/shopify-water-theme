/**
 * Cart Handler - Shopify Ajax Cart Functions
 * Xử lý thêm sản phẩm vào giỏ hàng và cập nhật UI
 * Sử dụng cho: Home page, Product page, Collection page
 */

// 🛒 Hàm Add to Cart Chuyên Nghiệp
async function addToCart(variantId, quantity = 1) {
  // Hiển thị loading
  showLoading();
  
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Sản phẩm không khả dụng');
    }

    const data = await response.json();
    
    // Cập nhật UI
    await updateCartCount();
    showSuccessNotification(`Đã thêm "${data.product_title}" vào giỏ hàng!`);
    
    // Tùy chọn: Chuyển đến trang giỏ hàng sau 1.5s
    // setTimeout(() => { window.location.href = '/cart'; }, 1500);
    
    return data;
    
  } catch (error) {
    console.error('Lỗi add to cart:', error);
    showErrorNotification(error.message || 'Không thể thêm sản phẩm. Vui lòng thử lại!');
    throw error;
  } finally {
    hideLoading();
  }
}

// 📊 Cập nhật số lượng giỏ hàng
async function updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    
    // Tìm và cập nhật cart count badge (hỗ trợ nhiều selector)
    const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count], .header_cart_count');
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
      
      // Hiển thị badge nếu có sản phẩm
      if (cart.item_count > 0) {
        el.classList.add('has-items');
      } else {
        el.classList.remove('has-items');
      }
    });
    
    console.log('✅ Cart updated:', cart.item_count, 'items');
    return cart;
    
  } catch (error) {
    console.error('❌ Lỗi update cart count:', error);
    return null;
  }
}

// 🔄 Hiển thị loading overlay
function showLoading() {
  const overlay = document.getElementById('cartLoadingOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

// ✅ Ẩn loading overlay
function hideLoading() {
  const overlay = document.getElementById('cartLoadingOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// ✅ Hiển thị thông báo thành công
function showSuccessNotification(message = 'Đã thêm vào giỏ hàng!') {
  const notification = document.getElementById('cartNotification');
  const messageEl = document.getElementById('cartNotificationMessage');
  
  if (notification && messageEl) {
    // Đặt nội dung
    messageEl.textContent = message;
    
    // Thêm class success
    notification.className = 'cart-notification success active';
    
    // Reset icon về checkmark
    const icon = notification.querySelector('.cart-notification-icon');
    if (icon) {
      icon.innerHTML = '<path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.classList.remove('active');
        notification.style.animation = '';
      }, 300);
    }, 3000);
  }
}

// ❌ Hiển thị thông báo lỗi
function showErrorNotification(message = 'Đã có lỗi xảy ra!') {
  const notification = document.getElementById('cartNotification');
  const messageEl = document.getElementById('cartNotificationMessage');
  
  if (notification && messageEl) {
    // Đặt nội dung
    messageEl.textContent = message;
    
    // Thêm class error
    notification.className = 'cart-notification error active';
    
    // Đổi icon thành dấu X
    const icon = notification.querySelector('.cart-notification-icon');
    if (icon) {
      icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    
    // Tự động ẩn sau 4 giây (lâu hơn success để user đọc)
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.classList.remove('active');
        notification.style.animation = '';
      }, 300);
    }, 4000);
  }
}

// 🚀 Khởi tạo khi trang load xong
document.addEventListener('DOMContentLoaded', function() {
  console.log('🛒 Cart Handler initialized');
  
  // Cập nhật cart count ban đầu
  updateCartCount();
});

// Export functions để có thể dùng ở nơi khác (nếu cần)
window.cartHandler = {
  addToCart,
  updateCartCount,
  showLoading,
  hideLoading,
  showSuccessNotification,
  showErrorNotification
};
