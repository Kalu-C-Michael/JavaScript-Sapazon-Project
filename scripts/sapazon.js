// scripts/sapazon.js
import { products } from '../data/products.js';
import { addToCart, cart } from '../data/cart.js';
import { formatCurrency } from './utils/money.js';

let productsHTML = '';
products.forEach(product => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">${product.name}</div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">${product.rating.count}</div>
      </div>

      <div class="product-price">
        ₦${(product.priceCents * 1500 / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          ${[...Array(10).keys()].map(i => `<option value="${i+1}">${i+1}</option>`).join('')}
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png"> Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity() {
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

updateCartQuantity();

const addedMessageTimeouts = {};

document.querySelectorAll('.js-add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    addToCart(productId, quantity); // <-- correct call to cart.js

    updateCartQuantity();

    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    addedMessage.classList.add('added-to-cart-visible');

    // clear previous timeout
    if (addedMessageTimeouts[productId]) {
      clearTimeout(addedMessageTimeouts[productId]);
    }

    addedMessageTimeouts[productId] = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);
  });
});
