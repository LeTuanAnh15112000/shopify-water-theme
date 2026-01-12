/**
 * Cart Handler - Shopify Ajax Cart Functions
 * Handles adding products to cart and updating UI
 * Used for: Home page, Product page, Collection page
 */

// Add to Cart Function
async function addToCart(variantId, quantity = 1) {
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
      throw new Error(errorData.description || 'Product not available');
    }

    const data = await response.json();
    
    // Update UI
    await updateCartCount();
    showSuccessNotification(`Added "${data.product_title}" to cart!`);
    
    return data;
    
  } catch (error) {
    console.error('Add to cart error:', error);
    showErrorNotification(error.message || 'Could not add product. Please try again!');
    throw error;
  } finally {
    hideLoading();
  }
}

// Update cart count
async function updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    
    // Find and update cart count badge (supports multiple selectors)
    const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count], .header_cart_count');
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
      
      // Show badge if there are items
      if (cart.item_count > 0) {
        el.classList.add('has-items');
      } else {
        el.classList.remove('has-items');
      }
    });
    
    console.log('Cart updated:', cart.item_count, 'items');
    return cart;
    
  } catch (error) {
    console.error('Error updating cart count:', error);
    return null;
  }
}

// Show loading overlay
function showLoading() {
  const overlay = document.getElementById('cartLoadingOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

// Hide loading overlay
function hideLoading() {
  const overlay = document.getElementById('cartLoadingOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Show success notification
function showSuccessNotification(message = 'Added to cart!') {
  const notification = document.getElementById('cartNotification');
  const messageEl = document.getElementById('cartNotificationMessage');
  
  if (notification && messageEl) {
    messageEl.textContent = message;
    notification.className = 'cart-notification success active';
    const icon = notification.querySelector('.cart-notification-icon');
    if (icon) {
      icon.innerHTML = '<path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.classList.remove('active');
        notification.style.animation = '';
      }, 300);
    }, 3000);
  }
}

// Show error notification
function showErrorNotification(message = 'An error occurred!') {
  const notification = document.getElementById('cartNotification');
  const messageEl = document.getElementById('cartNotificationMessage');
  
  if (notification && messageEl) {
    messageEl.textContent = message;
    notification.className = 'cart-notification error active';
    const icon = notification.querySelector('.cart-notification-icon');
    if (icon) {
      icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.classList.remove('active');
        notification.style.animation = '';
      }, 300);
    }, 4000);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Cart Handler initialized');
  updateCartCount();
});

// Export functions for use elsewhere (if needed)
window.cartHandler = {
  addToCart,
  updateCartCount,
  showLoading,
  hideLoading,
  showSuccessNotification,
  showErrorNotification
};
