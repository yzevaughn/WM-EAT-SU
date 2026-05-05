/**
 * wallet.js — Shared localStorage data module for WM EAT SU Wallet
 * Manages: Balance + Transaction History
 */

const WALLET_BALANCE_KEY = "wm_eat_su_balance";
const WALLET_TRANSACTIONS_KEY = "wm_eat_su_transactions";

function getRoleKey(baseKey) {
  if (window.location.href.includes("/outsider/")) {
    return `outsider_${baseKey}`;
  } else if (window.location.href.includes("/vendor-pages/")) {
    return `vendor_${baseKey}`;
  }
  return `student_${baseKey}`;
}

/**
 * Returns the current wallet balance.
 * Default is 245.50 if no balance is stored yet.
 */
function getWalletBalance() {
  const key = getRoleKey(WALLET_BALANCE_KEY);
  const bal = localStorage.getItem(key);
  if (bal === null) return 245.50; // Initial default balance
  return parseFloat(bal);
}

/**
 * Updates the wallet balance.
 */
function updateWalletBalance(amount, isAdd) {
  const key = getRoleKey(WALLET_BALANCE_KEY);
  let current = getWalletBalance();
  let newBal = isAdd ? current + amount : current - amount;
  localStorage.setItem(key, newBal.toFixed(2));
  return newBal;
}

/**
 * Returns the transaction history.
 */
function getWalletTransactions() {
  const key = getRoleKey(WALLET_TRANSACTIONS_KEY);
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

/**
 * Adds a new transaction to the history.
 */
function addWalletTransaction(typeText, amount, isAdd, type = "payment") {
  const key = getRoleKey(WALLET_TRANSACTIONS_KEY);
  const transactions = getWalletTransactions();
  
  const newTransaction = {
    id: "TRX-" + Date.now(),
    typeText,
    amount,
    isAdd,
    type, // 'cashin', 'withdraw', 'payment', 'refunded'
    timestamp: new Date().toISOString()
  };
  
  transactions.unshift(newTransaction); // Newest first
  localStorage.setItem(key, JSON.stringify(transactions));
  return newTransaction;
}
