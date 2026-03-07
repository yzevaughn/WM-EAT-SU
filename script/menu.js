// Reusable Menu Toggle Handler
class MenuToggle {
  constructor(options = {}) {
    this.triggerSelector = options.triggerSelector || '#menuToggle';
    this.menuSelector = options.menuSelector || '#sidebar';
    this.trigger = document.querySelector(this.triggerSelector);
    this.menu = document.querySelector(this.menuSelector);

    if (!this.trigger || !this.menu) {
      console.warn('MenuToggle: Trigger or menu element not found');
      return;
    }

    this.init();
  }

  init() {
    // Toggle menu on trigger click
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close menu when clicking on a link
    const links = this.menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  toggle() {
    this.menu.classList.toggle('active');
  }

  open() {
    this.menu.classList.add('active');
  }

  close() {
    this.menu.classList.remove('active');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new MenuToggle({
    triggerSelector: '#menuToggle',
    menuSelector: '#sidebar'
  });
});
