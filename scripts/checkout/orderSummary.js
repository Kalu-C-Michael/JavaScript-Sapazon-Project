import { cart, removeFromCart, updateDeliveryOption, updateQuantity } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary() {
  const orderSummaryContainer = document.querySelector('.js-order-summary');
  if (!orderSummaryContainer) return;

  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const matchingProduct = getProduct(cartItem.productId);
    if (!matchingProduct) return; // skip invalid items

    const deliveryOptionId = cartItem.deliveryOptionId || '1';
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    if (!deliveryOption) return;

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">₦${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span></span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach(option => {
      const dateString = calculateDeliveryDate(option);
      const priceString = option.priceCents === 0 ? 'FREE' : `₦${formatCurrency(option.priceCents)} -`;
      const isChecked = option.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${option.id}">
          <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}" ${isChecked ? 'checked' : ''}>
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
      `;
    });
    return html;
  }

  orderSummaryContainer.innerHTML = cartSummaryHTML;

  // Event listeners
  document.querySelectorAll('.js-delete-link').forEach(link => {
    link.addEventListener('click', () => {
      removeFromCart(link.dataset.productId);
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach(el => {
    el.addEventListener('click', () => {
      updateDeliveryOption(el.dataset.productId, el.dataset.deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector(`.js-cart-item-container-${link.dataset.productId}`).classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-link').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const input = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(input.value);
      updateQuantity(productId, newQuantity);

      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
