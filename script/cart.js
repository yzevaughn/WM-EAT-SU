// Shopping Cart - Quantity Management
// Prototype Only - No data is stored or transferred

document.addEventListener('DOMContentLoaded', () => {
  setupQuantityControls();
});

// Setup quantity buttons for all cart items
function setupQuantityControls() {
  const cartItems = document.querySelectorAll('.cart-item');

  cartItems.forEach(item => {
    const minusBtn = item.querySelector('.qty-btn.minus');
    const plusBtn = item.querySelector('.qty-btn.plus');
    const qtyNumbers = item.querySelector('.qty-number');
    const unitPrice = parseFloat(item.querySelector('.item-price-unit').textContent.replace('₱', ''));

    // Minus button
    minusBtn?.addEventListener('click', () => {
      let currentQty = parseInt(qtyNumbers.textContent);
      if (currentQty > 1) {
        currentQty--;
        qtyNumbers.textContent = currentQty;
        updateItemTotal(item, currentQty, unitPrice);
      }
    });

    // Plus button
    plusBtn?.addEventListener('click', () => {
      let currentQty = parseInt(qtyNumbers.textContent);
      currentQty++;
      qtyNumbers.textContent = currentQty;
      updateItemTotal(item, currentQty, unitPrice);
    });
  });
}

// Update item total price and order summary
function updateItemTotal(item, quantity, unitPrice) {
  const totalPrice = (unitPrice * quantity).toFixed(2);
  item.querySelector('.item-total-price').textContent = '₱' + totalPrice;

  // Recalculate order summary
  updateOrderSummary();
}

// Recalculate order summary total
function updateOrderSummary() {
  const cartItems = document.querySelectorAll('.cart-item');
  let subtotal = 0;

  cartItems.forEach(item => {
    const totalPriceText = item.querySelector('.item-total-price').textContent;
    const price = parseFloat(totalPriceText.replace('₱', ''));
    subtotal += price;
  });

  // Update summary details
  const summaryDetails = document.querySelector('.summary-details');
  if (summaryDetails) {
    const subtotalRow = summaryDetails.querySelector('.summary-row:nth-child(1)');
    const walletRow = summaryDetails.querySelector('.summary-row:nth-child(2)');
    const totalRow = summaryDetails.querySelector('.summary-row.total');

    if (subtotalRow) {
      subtotalRow.innerHTML = `<span>Subtotal</span><span>₱${subtotal.toFixed(2)}</span>`;
    }

    // Assuming wallet balance is -₱5.00 (hardcoded in prototype)
    const walletBalance = -5.00;
    const finalTotal = (subtotal + walletBalance).toFixed(2);

    if (walletRow) {
      walletRow.innerHTML = `<span>Wallet Balance</span><span>-₱${Math.abs(walletBalance).toFixed(2)}</span>`;
    }

    if (totalRow) {
      totalRow.innerHTML = `<span>Total</span><span>₱${finalTotal}</span>`;
    }
  }
}
