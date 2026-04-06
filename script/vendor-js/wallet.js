(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.getElementById("confirmWithdrawBtn");
    const withdrawToggle = document.getElementById("withdrawToggle");
    const walletBalanceEl = document.getElementById("walletBalance");
    const transactionList = document.getElementById("transactionList");

    // Handle Active State for Payment Methods
    const methodRadios = document.querySelectorAll('input[name="withdraw-method"]');
    methodRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('active'));
        if (radio.checked) {
          const label = document.querySelector(`label[for="${radio.id}"]`);
          if (label) label.classList.add('active');
        }
      });
    });

    // Handle Active State for Quick Amounts
    const amountRadios = document.querySelectorAll('input[name="withdraw-amount"]');
    amountRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));
        if (radio.checked) {
          const label = document.querySelector(`label[for="${radio.id}"]`);
          if (label) label.classList.add('active');
        }
      });
    });

    if (!confirmBtn) return;

    confirmBtn.addEventListener("click", () => {
      // Get selected method
      const methodRadio = document.querySelector('input[name="withdraw-method"]:checked');
      // Get selected amount
      const amountRadio = document.querySelector('input[name="withdraw-amount"]:checked');

      if (!methodRadio) {
        alert("Please select a withdrawal method.");
        return;
      }

      if (!amountRadio) {
        alert("Please select a withdrawal amount.");
        return;
      }

      const withdrawAmount = parseFloat(amountRadio.value);
      let currentBalance = parseFloat(walletBalanceEl.textContent.replace(/,/g, ""));

      if (withdrawAmount > currentBalance) {
        alert("Insufficient balance for this withdrawal.");
        return;
      }

      // Deduct balance
      currentBalance -= withdrawAmount;
      walletBalanceEl.textContent = currentBalance.toFixed(2);

      // Create new transaction element
      const method = methodRadio.value;
      
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedDate = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} - ${hours}:${minutes} ${ampm}`;

      const newTx = document.createElement("div");
      newTx.className = "transaction-item";
      newTx.innerHTML = `
        <div class="transaction-icon payment">
          <i class="fa-solid fa-money-bill-transfer"></i>
        </div>
        <div class="transaction-details">
          <p class="transaction-type">Withdrawal via ${method}</p>
          <p class="transaction-date">${formattedDate}</p>
        </div>
        <div class="transaction-amount negative">-₱${withdrawAmount.toFixed(2)}</div>
      `;

      // Insert at history top
      transactionList.insertBefore(newTx, transactionList.firstChild);

      // Close modal
      withdrawToggle.checked = false;

      // Reset selection
      methodRadio.checked = false;
      amountRadio.checked = false;
      document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));
      
      alert(`Successfully withdrew ₱${withdrawAmount.toFixed(2)} via ${method}.`);
    });
  });

})();
