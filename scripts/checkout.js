import { cart } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import { getDeliveryOption, calculateDeliveryDate } from '../data/deliveryOptions.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';

// Render the checkout UI
renderCheckoutHeader();
renderOrderSummary();
renderPaymentSummary();

// Select the "Place your order" button
placeOrderButton.addEventListener('click', () => {
  if (cart.length === 0) return alert('Your cart is empty!');

  const order = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    items: cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
      deliveryDate: item.deliveryOptionId
        ? calculateDeliveryDate(getDeliveryOption(item.deliveryOptionId))
        : 'Unknown'
    }))
  };

  // Save the order
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear the cart immediately
  cart.length = 0;
  localStorage.setItem('cart', JSON.stringify(cart));

  // Disable button to prevent double click
  placeOrderButton.disabled = true;

  // Redirect
  window.location.href = 'orders.html';
});

