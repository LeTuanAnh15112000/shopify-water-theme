/**
 * Collection Page - Category Filter
 * Ajax-based filtering - fetch products from selected collection
 */

document.addEventListener('DOMContentLoaded', function() {
  const filterSection = document.getElementById('categoryFilter');
  if (!filterSection) return;

  const filterBtns = document.querySelectorAll('.products_filter_btn');
  const productsGrid = document.getElementById('productsGrid');
  
  // Store original products HTML for "All" button
  const originalHTML = productsGrid ? productsGrid.innerHTML : '';
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const collectionHandle = this.getAttribute('data-handle');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('is-active'));
      this.classList.add('is-active');
      
      // If "All" - restore original products
      if (collectionHandle === 'all') {
        productsGrid.innerHTML = originalHTML;
        return;
      }
      
      // Show loading
      if (window.showLoading) window.showLoading();
      
      try {
        // Fetch products from selected collection
        const response = await fetch(`/collections/${collectionHandle}/products.json`);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        renderProducts(data.products);
        
      } catch (error) {
        console.error('Filter error:', error);
        if (window.showNotification) {
          window.showNotification('Could not load products', 'error');
        }
      } finally {
        if (window.hideLoading) window.hideLoading();
      }
    });
  });
  
  // Render products to grid
  function renderProducts(products) {
    if (!products || products.length === 0) {
      productsGrid.innerHTML = `
        <div class="products_list_empty">
          <p>No products found in this collection.</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    products.forEach(product => {
      const variant = product.variants[0];
      const price = formatMoney(variant.price);
      const imageUrl = product.images[0]?.src || '';
      const variantTitle = variant.title !== 'Default Title' ? variant.title : '';
      
      html += `
        <a href="/products/${product.handle}" class="product_card">
          <div class="product_card_image">
            ${imageUrl 
              ? `<img src="${imageUrl}" alt="${product.title}">` 
              : '<img src="/assets/images/common/dummy.jpg" alt="Product">'}
          </div>
          <div class="product_card_content">
            <div>
              <p class="product_card_category">${(product.product_type || '').toUpperCase()}</p>
              <h3 class="product_card_name">${product.title}</h3>
            </div>
            <div class="product_card_footer">
              <span class="product_card_price">${price}</span>
              ${variantTitle ? `<span class="product_card_size">${variantTitle}</span>` : ''}
            </div>
            <button class="product_card_btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart(${variant.id})">
              <svg class="product_card_btn_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </button>
          </div>
        </a>
      `;
    });
    
    productsGrid.innerHTML = html;
  }
  
  // Format price
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
  
  console.log('✅ Collection filter ready -', filterBtns.length, 'collections');
});
