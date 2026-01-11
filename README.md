# Water Shop - Shopify Theme

> Dự án chuyển đổi website HTML/CSS/JS tĩnh thành Shopify theme hoàn chỉnh, sử dụng Liquid templating.

## Về dự án

Dự án này để tìm hiểu cơ bản về Shopify theme development. Bắt đầu từ một template HTML/CSS/JS có sẵn, sau đó convert sang Shopify với Liquid.

**Mục tiêu:**
- Làm quen với Liquid template language
- Tìm hiểu kiến trúc Shopify 2.0
- Thử nghiệm với Shopify Ajax API

## Công nghệ sử dụng

- **HTML/CSS/JavaScript** - Frontend cơ bản
- **Liquid** - Template language của Shopify
- **Shopify Ajax API** - Xử lý giỏ hàng, products
- **Shopify CLI** - Development workflow

## Tính năng đã làm

**Các trang:**
- Trang chủ với banner, sản phẩm nổi bật
- Trang danh sách sản phẩm (có filter theo loại)
- Trang chi tiết sản phẩm (chọn variant, add to cart)
- Giỏ hàng (cập nhật số lượng, xóa item)
- Trang liên hệ (form gửi email)
- Trang About, Blog, Policy

**Chức năng:**
- Add to cart không reload trang (Ajax)
- Filter sản phẩm theo category
- Cập nhật cart count realtime
- Form liên hệ tích hợp Shopify
- Responsive mobile

## Điều mình tìm hiểu được

### 1. Liquid Template
```liquid
{{ product.title }}
{{ product.price | money }}

{% for item in cart.items %}
  {{ item.title }}
{% endfor %}
```

Làm quen với objects (product, collection, cart), filters, và logic tags cơ bản.

### 2. Shopify 2.0 Architecture
```
templates/*.json → sections/*.liquid → snippets/*.liquid
```

Tham khảo cách tổ chức code theo sections/snippets, dùng schema settings.

### 3. Ajax API
```javascript
// Add to cart
fetch('/cart/add.js', {
  method: 'POST',
  body: JSON.stringify({ id: variantId, quantity: 1 })
})

// Get cart
fetch('/cart.js').then(r => r.json())
```

Thử nghiệm với các endpoint: `/cart.js`, `/cart/add.js`, `/cart/change.js`

### 4. Một số vấn đề gặp phải

**Vấn đề 1:** Filter không khớp với product type  
**Fix:** Đổi logic từ `collection.title` sang `product.type`

**Vấn đề 2:** Cart phải reload mới cập nhật  
**Fix:** Dùng Ajax API để update realtime

**Vấn đề 3:** Code loading/notification bị lặp  
**Fix:** Tạo snippet `cart-notifications.liquid` tái sử dụng

## Cấu trúc thư mục

```
water_shop_theme/
├── assets/
│   ├── css/          # Styles
│   ├── js/           # JavaScript
│   └── images/       # Hình ảnh
├── sections/         # Các section trang (header, footer, cart...)
├── snippets/         # Components tái sử dụng
├── templates/        # Template JSON (index, product, cart...)
├── layout/
│   └── theme.liquid  # Layout chính
└── config/
    └── settings_schema.json
```

Chi tiết xem file: `SHOPIFY_LIQUID_GUIDE.md`

## Tech stack

- Liquid templating
- JavaScript ES6+ (async/await, Fetch API)
- REST API
- Responsive CSS
- Git

## Lưu ý

Vì đây là dự án học tập trong thời gian ngắn, nên có nhiều điểm chưa hoàn thiện.
