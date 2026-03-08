document.addEventListener('DOMContentLoaded', () => {
  const cartItems = document.querySelectorAll('.cart-item');

  cartItems.forEach(item => {
    const qtyDisplay = item.querySelector('.qty-number');
    const unitPrice = parseFloat(item.querySelector('.item-price-unit').textContent.replace('₱',''));

    item.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let qty = parseInt(qtyDisplay.textContent);
        qty += btn.classList.contains('plus') ? 1 : (qty > 1 ? -1 : 0);
        qtyDisplay.textContent = qty;
        item.querySelector('.item-total-price').textContent = '₱' + (unitPrice * qty).toFixed(2);
        updateTotal();
      });
    });
  });

  function updateTotal() {
    const total = Array.from(cartItems).reduce((sum, item) => {
      return sum + parseFloat(item.querySelector('.item-total-price').textContent.replace('₱',''));
    }, 0);

    const totalRow = document.querySelector('.summary-details .summary-row.total');
    if(totalRow){
      totalRow.innerHTML = `<span>Total</span><span>₱${total.toFixed(2)}</span>`;
    }
  }
});