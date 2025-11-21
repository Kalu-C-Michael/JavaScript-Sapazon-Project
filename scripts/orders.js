// --- IMPORTS ---
import { getProduct } from '../data/products.js';
import { getDeliveryOption, calculateDeliveryDate } from '../data/deliveryOptions.js';
import { addToCart } from '../data/cart.js';

// --- SELECTORS ---
const ordersGrid = document.querySelector('.js-orders-grid');

// --- LOAD ORDERS ---
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// --- FIX OLD ORDERS ---
let updated = false;

orders.forEach(order => {
  order.items.forEach(item => {
    if (!item.deliveryDate && item.deliveryOptionId) {
      const option = getDeliveryOption(item.deliveryOptionId);
      item.deliveryDate = option ? calculateDeliveryDate(option) : "Unknown";
      updated = true;
    }
  });
});

// Save any fixed orders back to localStorage
if (updated) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

// --- SORT ORDERS NEWEST FIRST ---
orders.sort((a, b) => new Date(b.date) - new Date(a.date));

// --- RENDER ORDERS ---
let ordersHTML = '';

orders.forEach(order => {
  // Only render orders that have items
  if (order.items.length === 0) return;

  ordersHTML += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${new Date(order.date).toLocaleDateString()}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>
              ₦${order.items.reduce((sum, item) => {
                const product = getProduct(item.productId);
                return sum + ((product.priceCents * 1500) / 100) * item.quantity;
              }, 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${order.items.map(item => {
          const product = getProduct(item.productId);

          return `
            <div class="product-image-container">
              <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-details" data-product-id="${item.productId}">
              <div class="product-name">${product.name}</div>
              <div class="product-delivery-date">
                Arriving on: ${item.deliveryDate || "Unknown"}
              </div>
              <div class="product-quantity">Quantity: ${item.quantity}</div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
});

ordersGrid.innerHTML = ordersHTML;

// --- BUY AGAIN BUTTON ---
document.addEventListener("click", e => {
  const btn = e.target.closest(".buy-again-button");
  if (!btn) return;

  const container = btn.closest(".product-details");
  const productId = container.dataset.productId;

  addToCart(productId);
  alert("Added to cart!");
  window.location.href = "index.html";
});
