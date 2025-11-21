import { cart } from "../../data/cart.js";

export function renderCheckoutHeader() {
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkoutHeaderHTML = `
    <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html">
          <img class="sapazon-logo" src="images/sapazon white.png">
          <img class="sapazon-mobile-logo" src="images/sapazon mobile white.png">
        </a>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (${cartQuantity})
      </div>

      <div class="checkout-header-right-section">
        <img src="images/icons/checkout-lock-icon.png">
      </div>
    </div>
  `;

  const headerContainer = document.querySelector('.js-checkout-header');
  if (headerContainer) {
    headerContainer.innerHTML = checkoutHeaderHTML;
  }
}
