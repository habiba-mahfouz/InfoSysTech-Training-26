// Cart State Management using LocalStorage

// Get cart from LocalStorage
function getCart() {
  const cart = localStorage.getItem('sheMadeCart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to LocalStorage
function saveCart(cart) {
  localStorage.setItem('sheMadeCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
}

// Remove item from cart by index
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage(); // Re-render if we are on the cart page
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem('sheMadeCart');
  renderCartPage();
}

// Render the Cart Page (cart.html)
function renderCartPage() {
  const cartContainer = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('empty-cart');
  const filledState = document.getElementById('filled-cart');
  const grandTotalEl = document.getElementById('cart-grand-total');

  if (!cartContainer || !emptyState || !filledState) return; // Not on cart page

  const cart = getCart();

  if (cart.length === 0) {
    emptyState.classList.remove('d-none');
    filledState.classList.add('d-none');
    return;
  }

  // Cart has items
  emptyState.classList.add('d-none');
  filledState.classList.remove('d-none');

  let html = '';
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const rowTotal = item.price * item.quantity;
    grandTotal += rowTotal;

    // Build color label
    let colorInfo = '';
    if (item.color) {
      colorInfo = ` | <span class="d-inline-block align-middle ms-1" style="${item.color} width: 15px; height: 15px; border-radius: 50%; border: 1px solid #ccc;"></span>`;
    }

    html += `
      <div class="cart-item card border-0 shadow-sm rounded-4 mb-3 p-3 d-flex flex-row align-items-center">
        <img src="${item.image}" class="rounded-3" style="width: 90px; height: 90px; object-fit: cover; background-color: #f8f9fa;" alt="Product">
        <div class="ms-3 flex-grow-1">
          <h5 class="fw-bold mb-1 text-custom">${item.name}</h5>
          <p class="text-muted small mb-0">Qty: ${item.quantity}${colorInfo}</p>
          <p class="text-muted small mb-0">(${item.price} EGP per item)</p>
        </div>
        <div class="text-end ms-3">
          <h5 class="fw-bold mb-0">${rowTotal} EGP</h5>
          <button class="btn btn-link text-danger p-0 mt-1 small text-decoration-none" onclick="removeFromCart(${index})">
            <i class="fas fa-trash-alt"></i> Remove
          </button>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
  grandTotalEl.innerText = `${grandTotal} EGP`;

  // Update WhatsApp Button
  const waBtn = document.getElementById('whatsapp-btn');
  if (waBtn) {
    waBtn.onclick = () => sendOrderViaWhatsApp(cart, grandTotal);
  }
}

// WhatsApp Integration
function sendOrderViaWhatsApp(cart, grandTotal) {
  let message = "Hello SHE MADE! ✨\nI would like to place an order:\n\n";
  
  cart.forEach((item, index) => {
    let colorText = item.color ? ` (Color variant selected)` : "";
    let rowTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.quantity}x ${item.name}${colorText} - ${rowTotal} EGP\n`;
  });

  message += `\n*Grand Total: ${grandTotal} EGP*\n\nLooking forward to receiving it! 💕`;

  // The phone number (starts with 015 as requested)
  // Remember to include the country code for Egypt (+20) omitting the leading 0
  const phoneNumber = "201500000000"; // Placeholder, user will update this

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(waUrl, '_blank');
}

// Call render on DOMContentLoaded (will only run its logic if on cart.html)
document.addEventListener('DOMContentLoaded', renderCartPage);
