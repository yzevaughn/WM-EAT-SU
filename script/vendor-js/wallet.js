
(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.getElementById("confirmWithdrawBtn");
    const withdrawToggle = document.getElementById("withdrawToggle");
    const walletBalanceEl = document.getElementById("walletBalance");
    const transactionList = document.getElementById("transactionList");

    // Second Modal Selectors
    const confirmWithdrawModal = document.getElementById("confirmWithdrawModal");
    const finalConfirmBtn = document.getElementById("finalConfirmBtn");
    const cancelFinalBtn = document.getElementById("cancelFinalBtn");
    const confirmWithdrawOverlay = document.getElementById("confirmWithdrawOverlay");
    const confirmWithdrawMessage = document.getElementById("confirmWithdrawMessage");

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

    // STEP 1: Click "Confirm Withdrawal" in the first modal
    confirmBtn.addEventListener("click", () => {
      const methodRadio = document.querySelector('input[name="withdraw-method"]:checked');
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
      const currentBalance = parseFloat(walletBalanceEl.textContent.replace(/,/g, ""));

      if (withdrawAmount > currentBalance) {
        alert("Insufficient balance for this withdrawal.");
        return;
      }

      // Instead of processing, show the SECOND MODAL
      if(confirmWithdrawMessage) {
        confirmWithdrawMessage.textContent = `Are you sure you want to withdraw ₱${withdrawAmount.toLocaleString()} via ${methodRadio.value}?`;
      }
      if(confirmWithdrawModal) {
        confirmWithdrawModal.style.display = "flex";
      }
    });

    // STEP 2: Handle Final Confirmation
    if(finalConfirmBtn) {
      finalConfirmBtn.addEventListener("click", () => {
        const methodRadio = document.querySelector('input[name="withdraw-method"]:checked');
        const amountRadio = document.querySelector('input[name="withdraw-amount"]:checked');
        
        if(!methodRadio || !amountRadio) return;

        const withdrawAmount = parseFloat(amountRadio.value);
        let currentBalance = parseFloat(walletBalanceEl.textContent.replace(/,/g, ""));

        // Deduct balance
        currentBalance -= withdrawAmount;
        walletBalanceEl.textContent = currentBalance.toFixed(2);

        // Create new transaction element
        const method = methodRadio.value;
        const formattedDate = formatNow();

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
        if(transactionList) transactionList.insertBefore(newTx, transactionList.firstChild);

        // Close ALL Modals
        if(confirmWithdrawModal) confirmWithdrawModal.style.display = "none";
        if(withdrawToggle) withdrawToggle.checked = false;

        // Reset selection
        resetSelections();
        
        // Show success
        showSuccessMessage(`Successfully withdrew ₱${withdrawAmount.toFixed(2)} via ${method}.`);
      });
    }

    // STEP 3: Handle Cancellation in Second Modal
    function closeSecondModal() {
      if(confirmWithdrawModal) confirmWithdrawModal.style.display = "none";
    }

    if(cancelFinalBtn) cancelFinalBtn.addEventListener("click", closeSecondModal);
    if(confirmWithdrawOverlay) confirmWithdrawOverlay.addEventListener("click", closeSecondModal);

    // Helpers
    function formatNow() {
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} - ${hours}:${minutes} ${ampm}`;
    }

    function resetSelections() {
      document.querySelectorAll('input[name="withdraw-method"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="withdraw-amount"]').forEach(r => r.checked = false);
      document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));
    }

    function showSuccessMessage(msg) {
        // Use a simple snackbar or alert for now
        alert(msg);
    }
  });

})();
