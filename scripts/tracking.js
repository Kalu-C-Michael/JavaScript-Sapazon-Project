import { getProduct } from "../data/products.js";

const orders = JSON.parse(localStorage.getItem("orders")) || [];

const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
const productId = params.get("productId");

const order = orders.find(o => o.id === orderId);

if (!order) {
  document.querySelector(".order-tracking").innerHTML = `
    <div class="delivery-date">Order not found.</div>
  `;
  throw new Error("Order not found");
}

const item = order.items.find(i => i.productId === productId);

if (!item) {
  document.querySelector(".order-tracking").innerHTML = `
    <div class="delivery-date">Item not found in this order.</div>
  `;
  throw new Error("Item not found");
}

const product = getProduct(productId);

// Fill the static HTML with real values
document.querySelector(".delivery-date").textContent =
  `Arriving on ${item.deliveryDate}`;

document.querySelectorAll(".product-info")[0].textContent =
  product.name;

document.querySelectorAll(".product-info")[1].textContent =
  `Quantity: ${item.quantity}`;

document.querySelector(".product-image").src = product.image;

