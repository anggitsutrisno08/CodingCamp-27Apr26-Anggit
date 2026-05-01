// Expense Budget Visualizer - Main Application (Enhanced Version)

// Default Categories with Colors (Requirements 4.1, 4.3)
const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#FF6B6B' },
  { name: 'Transport', color: '#4ECDC4' },
  { name: 'Fun', color: '#95E1D3' }
];

// Global state for categories and sorting
let CATEGORIES = [...DEFAULT_CATEGORIES];
let currentSortBy = 'timestamp'; // 'timestamp', 'amount', 'category'
let currentSortOrder = 'desc'; // 'asc', 'desc'

// ============================================
// Data Management Module
// ============================================

// Generate unique ID for transactions
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create transaction object
function createTransaction(itemName, amount, category) {
  return {
    id: generateId(),
    itemName: itemName.trim(),
    amount: parseFloat(amount),
    category: category,
    timestamp: Date.now()
  };
}

// Calculate total balance from all transactions
function calculateBalance(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// Calculate category totals for aggregation
function calculateCategoryTotals(transactions) {
  const totals = {};
  CATEGORIES.forEach(cat => totals[cat.name] = 0);
  transactions.forEach(t => {
    if (totals.hasOwnProperty(t.category)) {
      totals[t.category] += t.amount;
    }
  });
  return totals;
}

// ============================================
// Validation Module
// ============================================

// Validate item name (Requirements 1.5)
function validateItemName(name) {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Item name cannot be empty" };
  }
  return { valid: true };
}

// Validate amount (Requirements 1.4)
function validateAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) {
    return { valid: false, error: "Amount must be a number" };
  }
  if (num <= 0) {
    return { valid: false, error: "Amount must be positive" };
  }
  return { valid: true };
}

// Validate category (Requirements 4.2)
function validateCategory(category) {
  const validCategories = CATEGORIES.map(c => c.name);
  if (!validCategories.includes(category)) {
    return { valid: false, error: "Invalid category" };
  }
  return { valid: true };
}

// Validate entire transaction (Requirements 1.3, 1.4, 1.5, 4.2)
function validateTransaction(itemName, amount, category) {
  const nameCheck = validateItemName(itemName);
  if (!nameCheck.valid) return nameCheck;
  
  const amountCheck = validateAmount(amount);
  if (!amountCheck.valid) return amountCheck;
  
  const categoryCheck = validateCategory(category);
  if (!categoryCheck.valid) return categoryCheck;
  
  return { valid: true };
}

// ============================================
// Local Storage Module
// ============================================

// Check if Local Storage is available (Requirements 6.4)
function checkLocalStorageAvailability() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Save transactions to Local Storage (Requirements 6.1)
function saveTransactions(transactions) {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
}

// Load transactions from Local Storage (Requirements 6.3)
function loadTransactions() {
  try {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load transactions:', e);
    return [];
  }
}

// Add transaction and save to storage (Requirements 6.1)
function addTransaction(transaction) {
  const transactions = loadTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}

// Delete transaction and update storage (Requirements 6.2)
function deleteTransaction(id) {
  const transactions = loadTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
}

// Save custom categories to Local Storage
function saveCategories(categories) {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
}

// Load custom categories from Local Storage
function loadCategories() {
  try {
    const data = localStorage.getItem('categories');
    return data ? JSON.parse(data) : [...DEFAULT_CATEGORIES];
  } catch (e) {
    console.error('Failed to load categories:', e);
    return [...DEFAULT_CATEGORIES];
  }
}

// Add custom category
function addCategory(name, color) {
  CATEGORIES.push({ name, color });
  saveCategories(CATEGORIES);
  updateCategoryDropdown();
}

// Delete custom category
function deleteCategory(name) {
  // Don't allow deleting if it's the last category
  if (CATEGORIES.length <= 1) {
    showError('Cannot delete the last category');
    return false;
  }
  
  // Check if any transactions use this category
  const transactions = loadTransactions();
  const hasTransactions = transactions.some(t => t.category === name);
  
  if (hasTransactions) {
    showError(`Cannot delete category "${name}" because it has transactions`);
    return false;
  }
  
  CATEGORIES = CATEGORIES.filter(c => c.name !== name);
  saveCategories(CATEGORIES);
  updateCategoryDropdown();
  return true;
}

// Save theme preference
function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

// Load theme preference
function loadTheme() {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (e) {
    console.error('Failed to load theme:', e);
    return 'light';
  }
}

// ============================================
// UI Rendering Module
// ============================================

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility: Get category color (Requirements 4.3)
function getCategoryColor(categoryName) {
  const category = CATEGORIES.find(c => c.name === categoryName);
  return category ? category.color : '#CCCCCC';
}

// Sort transactions
function sortTransactions(transactions, sortBy, order) {
  return transactions.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else { // timestamp
      comparison = a.timestamp - b.timestamp;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}

// Render transaction list (Requirements 2.1, 2.3)
function renderTransactionList(transactions) {
  const container = document.getElementById('transaction-list');
  
  if (transactions.length === 0) {
    container.innerHTML = '<p class="empty-state">No transactions yet</p>';
    return;
  }
  
  // Sort transactions based on current sort settings
  const sorted = sortTransactions([...transactions], currentSortBy, currentSortOrder);
  
  const html = sorted
    .map(t => `
      <div class="transaction-item" data-id="${t.id}">
        <div class="transaction-info">
          <span class="item-name">${escapeHtml(t.itemName)}</span>
          <span class="category-badge" style="background-color: ${getCategoryColor(t.category)}">
            ${t.category}
          </span>
        </div>
        <div class="transaction-actions">
          <span class="amount">$${t.amount.toFixed(2)}</span>
          <button class="delete-btn" data-id="${t.id}">&times;</button>
        </div>
      </div>
    `)
    .join('');
  
  container.innerHTML = html;
}

// Render balance (Requirements 3.1, 3.2)
function renderBalance(balance) {
  const balanceElement = document.getElementById('balance-amount');
  balanceElement.textContent = balance.toFixed(2);
}

// Show error message (Requirements 1.3)
function showError(message) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 3000);
}

// Update category dropdown
function updateCategoryDropdown() {
  const select = document.getElementById('category');
  if (!select) return;
  
  const currentValue = select.value;
  select.innerHTML = '<option value="">Select a category</option>' +
    CATEGORIES.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
  
  // Restore previous selection if still valid
  if (CATEGORIES.some(c => c.name === currentValue)) {
    select.value = currentValue;
  }
}

// Render category management UI
function renderCategoryManagement() {
  const container = document.getElementById('category-management');
  if (!container) return;
  
  const html = CATEGORIES.map(cat => `
    <div class="category-item">
      <span class="category-color" style="background-color: ${cat.color}"></span>
      <span class="category-name">${cat.name}</span>
      ${CATEGORIES.length > 1 ? `<button class="delete-category-btn" data-name="${cat.name}">×</button>` : ''}
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// ============================================
// Chart Rendering Module
// ============================================

// Global chart instance to allow updates
let pieChartInstance = null;

// Render pie chart showing expense distribution by category (Requirements 5.1, 5.2, 5.3)
function renderPieChart(transactions) {
  const canvas = document.getElementById('pie-chart');
  const ctx = canvas.getContext('2d');
  
  // Calculate category totals
  const categoryTotals = calculateCategoryTotals(transactions);
  
  // Prepare chart data with category labels and colors
  const chartData = {
    labels: CATEGORIES.map(cat => cat.name),
    datasets: [{
      data: CATEGORIES.map(cat => categoryTotals[cat.name]),
      backgroundColor: CATEGORIES.map(cat => cat.color),
      borderWidth: 2,
      borderColor: 'var(--chart-border-color, #ffffff)'
    }]
  };
  
  // Chart configuration
  const chartConfig = {
    type: 'pie',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 14
            },
            color: 'var(--text-color, #333)'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: $${value.toFixed(2)}`;
            }
          }
        }
      }
    }
  };
  
  // If chart already exists, update it; otherwise create new chart
  if (pieChartInstance) {
    // Update existing chart data (Requirements 5.2)
    pieChartInstance.data.datasets[0].data = chartData.datasets[0].data;
    pieChartInstance.data.labels = chartData.labels;
    pieChartInstance.data.datasets[0].backgroundColor = chartData.datasets[0].backgroundColor;
    pieChartInstance.update();
  } else {
    // Create new chart instance
    pieChartInstance = new Chart(ctx, chartConfig);
  }
}

// ============================================
// Theme Module
// ============================================

// Apply theme
function applyTheme(theme) {
  console.log('🎨 Applying theme:', theme);
  document.body.setAttribute('data-theme', theme);
  saveTheme(theme);
  
  // Update theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    console.log('✅ Theme toggle button updated');
  } else {
    console.error('❌ Theme toggle button not found!');
  }
  
  // Update chart if it exists
  if (pieChartInstance) {
    const transactions = loadTransactions();
    renderPieChart(transactions);
  }
}

// Toggle theme
function toggleTheme() {
  console.log('🔄 Toggle theme clicked');
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  console.log('Switching from', currentTheme, 'to', newTheme);
  applyTheme(newTheme);
}

// ============================================
// Sorting Module
// ============================================

// Handle sort change
function handleSortChange(sortBy) {
  if (currentSortBy === sortBy) {
    // Toggle order if same sort field
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    // New sort field, default to descending
    currentSortBy = sortBy;
    currentSortOrder = 'desc';
  }
  
  // Update UI to show active sort
  updateSortButtons();
  
  // Refresh transaction list
  const transactions = loadTransactions();
  renderTransactionList(transactions);
}

// Update sort button states
function updateSortButtons() {
  const buttons = document.querySelectorAll('.sort-btn');
  buttons.forEach(btn => {
    const sortBy = btn.getAttribute('data-sort');
    if (sortBy === currentSortBy) {
      btn.classList.add('active');
      btn.textContent = btn.textContent.split(' ')[0] + (currentSortOrder === 'asc' ? ' ↑' : ' ↓');
    } else {
      btn.classList.remove('active');
      btn.textContent = btn.textContent.split(' ')[0];
    }
  });
}

// ============================================
// Event Handler Module
// ============================================

// Handle form submission (Requirements 1.2)
function handleFormSubmit(event) {
  event.preventDefault();
  
  const itemName = document.getElementById('item-name').value;
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  
  const validation = validateTransaction(itemName, amount, category);
  if (!validation.valid) {
    showError(validation.error);
    return;
  }
  
  const transaction = createTransaction(itemName, amount, category);
  addTransaction(transaction);
  
  // Clear form
  event.target.reset();
  
  // Refresh UI
  refreshUI();
}

// Handle delete button click (Requirements 2.2)
function handleDelete(event) {
  if (event.target.classList.contains('delete-btn')) {
    const id = event.target.dataset.id;
    deleteTransaction(id);
    refreshUI();
  }
}

// Handle category form submission
function handleCategoryFormSubmit(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('new-category-name');
  const colorInput = document.getElementById('new-category-color');
  
  const name = nameInput.value.trim();
  const color = colorInput.value;
  
  if (!name) {
    showError('Category name cannot be empty');
    return;
  }
  
  // Check if category already exists
  if (CATEGORIES.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    showError('Category already exists');
    return;
  }
  
  addCategory(name, color);
  
  // Clear form
  nameInput.value = '';
  colorInput.value = '#' + Math.floor(Math.random()*16777215).toString(16);
  
  // Refresh UI
  renderCategoryManagement();
  refreshUI();
}

// Handle category delete
function handleCategoryDelete(event) {
  if (event.target.classList.contains('delete-category-btn')) {
    const name = event.target.getAttribute('data-name');
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      if (deleteCategory(name)) {
        renderCategoryManagement();
        refreshUI();
      }
    }
  }
}

// Refresh entire UI (Requirements 2.3, 3.2, 5.2)
function refreshUI() {
  const transactions = loadTransactions();
  const balance = calculateBalance(transactions);
  
  renderTransactionList(transactions);
  renderBalance(balance);
  renderPieChart(transactions);
  updateSortButtons();
}

// ============================================
// Modal Management
// ============================================

// Open modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// ============================================
// Application Initialization
// ============================================

// Initialize application on page load (Requirements 6.3, 6.4)
function initializeApp() {
  // Check Local Storage availability (Requirements 6.4)
  if (!checkLocalStorageAvailability()) {
    showError('Local Storage is not available. Your data will not be saved.');
  }
  
  // Load custom categories
  CATEGORIES = loadCategories();
  
  // Load and apply theme
  const savedTheme = loadTheme();
  applyTheme(savedTheme);
  
  // Attach event listeners
  const form = document.getElementById('transaction-form');
  const transactionList = document.getElementById('transaction-list');
  const themeToggle = document.getElementById('theme-toggle');
  const categoryForm = document.getElementById('category-form');
  const categoryManagement = document.getElementById('category-management');
  const manageCategoriesBtn = document.getElementById('manage-categories-btn');
  const categoryModal = document.getElementById('category-modal');
  const closeCategoryModal = document.getElementById('close-category-modal');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  if (transactionList) {
    transactionList.addEventListener('click', handleDelete);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    console.log('✅ Theme toggle event listener attached');
  } else {
    console.error('❌ Theme toggle button not found in DOM!');
  }
  
  if (categoryForm) {
    categoryForm.addEventListener('submit', handleCategoryFormSubmit);
  }
  
  if (categoryManagement) {
    categoryManagement.addEventListener('click', handleCategoryDelete);
  }
  
  if (manageCategoriesBtn) {
    manageCategoriesBtn.addEventListener('click', () => {
      renderCategoryManagement();
      openModal('category-modal');
    });
  }
  
  if (closeCategoryModal) {
    closeCategoryModal.addEventListener('click', () => closeModal('category-modal'));
  }
  
  if (categoryModal) {
    categoryModal.addEventListener('click', (e) => {
      if (e.target === categoryModal) {
        closeModal('category-modal');
      }
    });
  }
  
  // Attach sort button listeners
  const sortButtons = document.querySelectorAll('.sort-btn');
  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sortBy = btn.getAttribute('data-sort');
      handleSortChange(sortBy);
    });
  });
  
  // Update category dropdown
  updateCategoryDropdown();
  
  // Load initial data and render UI (Requirements 6.3)
  refreshUI();
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
