// Reusable Dropdown Menu Handler
class DropdownMenu {
  constructor(options = {}) {
    this.triggerSelector = options.triggerSelector || '#profileBtn';
    this.dropdownSelector = options.dropdownSelector || '#profileDropdown';
    this.trigger = document.querySelector(this.triggerSelector);
    this.dropdown = document.querySelector(this.dropdownSelector);

    if (!this.trigger || !this.dropdown) {
      console.warn('DropdownMenu: Trigger or dropdown element not found');
      return;
    }

    this.init();
  }

  init() {
    // Toggle dropdown on trigger click
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target) && !this.trigger.contains(e.target)) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  toggle() {
    this.dropdown.classList.toggle('active');
  }

  open() {
    this.dropdown.classList.add('active');
  }

  close() {
    this.dropdown.classList.remove('active');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new DropdownMenu({
    triggerSelector: '#profileBtn',
    dropdownSelector: '#profileDropdown'
  });
});
