// data/cart.js
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(productId, quantity = 1) {
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1' // default delivery option
    });
  }

  saveCart();
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveCart();
}

export function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = newQuantity;
  }
  saveCart();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.deliveryOptionId = deliveryOptionId;
  }
  saveCart();
}

export function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
