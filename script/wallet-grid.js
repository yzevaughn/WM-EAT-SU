
/**
 * wallet-grid.js
 * Handles data grid functionality (searching, filtering, sorting, pagination)
 * for Vendor and Canteen Wallet pages.
 */

class DataGrid {
  constructor(options) {
    this.tableId = options.tableId;
    this.data = options.initialData || [];
    this.itemsPerPage = options.itemsPerPage || 5;
    this.currentPage = 1;
    this.onRender = options.onRender;
    this.sortConfig = { key: 'date', direction: 'desc' };
    this.filters = {};
    this.searchQuery = "";

    this.init();
  }

  init() {
    this.render();
  }

  setData(newData) {
    this.data = newData;
    this.currentPage = 1;
    this.render();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase();
    this.currentPage = 1;
    this.render();
  }

  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
    this.currentPage = 1;
    this.render();
  }

  setSort(key, direction) {
    this.sortConfig = { key, direction };
    this.render();
  }

  getFilteredData() {
    return this.data.filter(item => {
      // Search
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(this.searchQuery)
      );

      if (!matchesSearch) return false;

      // Filters
      for (const [key, value] of Object.entries(this.filters)) {
        if (!value) continue;

        if (key === 'dateRange') {
          if (!this.matchesDateRange(item.date, value, this.filters.specificDate)) return false;
        } else if (key === 'specificDate') {
            // Already handled by dateRange if range is 'specific' or 'month-specific'
            continue;
        } else {
          // Case-insensitive comparison for strings
          const itemVal = String(item[key]).toLowerCase();
          const filterVal = String(value).toLowerCase();
          if (itemVal !== filterVal) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let valA = a[this.sortConfig.key];
      let valB = b[this.sortConfig.key];

      // Handle specific types (dates, amounts)
      if (this.sortConfig.key === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else if (this.sortConfig.key === 'amount') {
        valA = Math.abs(parseFloat(valA));
        valB = Math.abs(parseFloat(valB));
      }

      if (valA < valB) return this.sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  matchesDateRange(itemDateStr, range, specificValue) {
    const itemDate = new Date(itemDateStr);
    const now = new Date();
    
    if (range === 'today') {
      return itemDate.toDateString() === now.toDateString();
    }
    if (range === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return itemDate >= weekAgo;
    }
    if (range === 'month') {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }
    if (range === 'specific' && specificValue) {
      const targetDate = new Date(specificValue);
      return itemDate.toDateString() === targetDate.toDateString();
    }
    if (range === 'month-specific' && specificValue) {
        const [year, month] = specificValue.split('-');
        return itemDate.getFullYear() == year && (itemDate.getMonth() + 1) == month;
    }
    return true;
  }

  render() {
    const filteredData = this.getFilteredData();
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    
    if (this.currentPage > totalPages) this.currentPage = totalPages || 1;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedData = filteredData.slice(start, end);

    const tbody = document.querySelector(`#${this.tableId} tbody`);
    if (!tbody) return;

    tbody.innerHTML = paginatedData.map(item => this.onRender(item)).join('');

    this.renderPagination(totalItems);
  }

  renderPagination(totalItems) {
    const container = document.querySelector(`#${this.tableId}`).parentElement.querySelector('.pagination');
    if (!container) return;

    const start = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);
    
    const pageInfo = container.querySelector('.page-info');
    if (pageInfo) {
      pageInfo.innerText = `Showing ${start} to ${end} of ${totalItems} entries`;
    }

    const controls = container.querySelector('.page-controls');
    if (!controls) return;

    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    let html = `
      <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="window.${this.tableId}Grid.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="window.${this.tableId}Grid.goToPage(${i})">${i}</button>`;
        } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
            html += `<span class="page-dots">...</span>`;
        }
    }

    html += `
      <button class="page-btn" ${this.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''} onclick="window.${this.tableId}Grid.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    controls.innerHTML = html;
  }

  goToPage(page) {
    this.currentPage = page;
    this.render();
  }
}
