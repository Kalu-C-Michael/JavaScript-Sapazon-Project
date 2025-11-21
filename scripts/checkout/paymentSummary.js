import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  const container = document.querySelector('.js-payment-summary');
  if (!container) return;

  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    if (!product) return;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId || '1');
    if (!deliveryOption) return;

    productPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;
    cartQuantity += cartItem.quantity;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  container.innerHTML = `
    <div class="payment-summary-title">
     Order Summary
    </div>

    <div class="payment-summary-row">
     <div>
       Items (${cartQuantity}):
     </div>
     <div class="payment-summary-money">
       ₦${formatCurrency(productPriceCents)}
     </div>
    </div>

    <div class="payment-summary-row">
     <div>
       Shipping &amp; handling:
     </div>
     <div class="payment-summary-money">
       ₦${formatCurrency(shippingPriceCents)}
     </div>
    </div>
    <div class="payment-summary-row subtotal-row">
     <div>
       Total before tax:
     </div>
     <div class="payment-summary-money">
       ₦${formatCurrency(totalBeforeTaxCents)}
     </div>
    </div>
    <div class="payment-summary-row">
     <div>
       Estimated tax (10%):
     </div>
     <div class="payment-summary-money">
       ₦${formatCurrency(taxCents)}
     </div>
    </div>
    <div class="payment-summary-row total-row">
     <div>
       Order total:
     </div><div class="payment-summary-money">
       ₦${formatCurrency(totalCents)}
     </div>
    </div>
    <button class="place-order-button button-primary">Place your order</button>
  `;

  // Attach event listener for "Place your order" button
const placeOrderButton = document.querySelector('.place-order-button');

placeOrderButton.addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) return alert("Your cart is empty!");

  // Retrieve existing orders array or create a new one
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  // Create new order object
  const newOrder = {
    id: crypto.randomUUID(), // unique order ID
    date: new Date().toISOString(),
    items: cart
  };

  // Add to orders array and save
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear the cart after placing order
  localStorage.removeItem('cart');

  // Redirect to orders page
  window.location.href = 'orders.html';
});

}
