


## Core Functions and Modules

### 1. Data Management Module

```javascript
// Generate unique ID
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

// Calculate total balance
function calculateBalance(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// Calculate category totals
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
```

### 2. Validation Module

```javascript
// Validate item name
function validateItemName(name) {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Item name cannot be empty" };
  }
  return { valid: true };
}

// Validate amount
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

// Validate category
function validateCategory(category) {
  const validCategories = CATEGORIES.map(c => c.name);
  if (!validCategories.includes(category)) {
    return { valid: false, error: "Invalid category" };
  }
  return { valid: true };
}

// Validate entire transaction
function validateTransaction(itemName, amount, category) {
  const nameCheck = validateItemName(itemName);
  if (!nameCheck.valid) return nameCheck;
  
  const amountCheck = validateAmount(amount);
  if (!amountCheck.valid) return amountCheck;
  
  const categoryCheck = validateCategory(category);
  if (!categoryCheck.valid) return categoryCheck;
  
  return { valid: true };
}
```

### 3. UI Rendering Module

```javascript
// Render transaction list
function renderTransactionList(transactions) {
  const container = document.getElementById('transaction-list');
  
  if (transactions.length === 0) {
    container.innerHTML = '<p class="empty-state">No transactions yet</p>';
    return;
  }
  
  const html = transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(t => `
      <div class="transaction-item" data-id="${t.id}">
        <div class="transaction-info">
          <span class="item-name">${escapeHtml(t.itemName)}</span>
          <span class="category-badge" style="background-color: ${getCategoryColor(t.category)}">
            ${t.category}
          </span>
        </div>
        <div class="transaction-actions">
          <span class="amount">${t.amount.toFixed(2)}</span>
          <button class="delete-btn" data-id="${t.id}">&times;</button>
        </div>
      </div>
    `)
    .join('');
  
  container.innerHTML = html;
}

// Render balance
function renderBalance(balance) {
  const balanceElement = document.getElementById('balance-amount');
  balanceElement.textContent = `${balance.toFixed(2)}`;
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 3000);
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility: Get category color
function getCategoryColor(categoryName) {
  const category = CATEGORIES.find(c => c.name === categoryName);
  return category ? category.color : '#CCCCCC';
}
```

### 4. Event Handler Module

```javascript
// Handle form submission
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

// Handle delete button click
function handleDelete(event) {
  if (event.target.classList.contains('delete-btn')) {
    const id = event.target.dataset.id;
    deleteTransaction(id);
    refreshUI();
  }
}

// Refresh entire UI
function refreshUI() {
  const transactions = loadTransactions();
  const balance = calculateBalance(transactions);
  
  renderTransactionList(transactions);
  renderBalance(balance);
  renderPieChart(transactions);
}
```

## Pie Chart Implementation

### Approach: Chart.js Library

**Rationale**: Use Chart.js for pie chart visualization:
- Simple integration with minimal configuration
- Handles rendering and updates automatically
- Responsive by default
- Well-documented and widely used

### Implementation

```javascript
function renderPieChart(transactions) {
  const categoryTotals = calculateCategoryTotals(transactions);
  
  const chartData = {
    labels: CATEGORIES.map(cat => cat.name),
    datasets: [{
      data: CATEGORIES.map(cat => categoryTotals[cat.name]),
      backgroundColor: CATEGORIES.map(cat => cat.color)
    }]
  };
  
  // Chart.js will handle the rendering
  // Chart updates automatically when data changes
}
```

### Chart Features
- Pie chart displays spending distribution by category
- Each category shown with its designated color
- Chart updates automatically when transaction data changes
- Responsive sizing for different screen sizes

## Error Handling

### Local Storage Errors

```javascript
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

function initializeApp() {
  if (!checkLocalStorageAvailability()) {
    showError('Local Storage is not available. Your data will not be saved.');
    // Continue with in-memory operation
  }
  
  refreshUI();
}
```

### Input Validation Errors
- Display inline error messages below form
- Red border on invalid input fields
- Clear error after 3 seconds or on next input

### Runtime Errors
- Wrap critical operations in try-catch blocks
- Log errors to console for debugging
- Show generic error message to user

```javascript
function safeOperation(operation, errorMessage) {
  try {
    return operation();
  } catch (error) {
    console.error('Error:', error);
    showError(errorMessage || 'An error occurred. Please try again.');
    return null;
  }
}
```

## Testing Strategy

For the MVP, testing will focus on manual verification of core functionality:

### Manual Testing Checklist

1. **Adding Transactions**:
   - Add transactions with valid data
   - Verify transaction appears in list
   - Verify balance updates correctly

2. **Deleting Transactions**:
   - Delete a transaction
   - Verify it's removed from list
   - Verify balance recalculates

3. **Balance Updates**:
   - Add multiple transactions
   - Verify total balance is correct sum

4. **Chart Updates**:
   - Add transactions in different categories
   - Verify pie chart displays correctly
   - Verify chart updates when transactions change

5. **Local Storage Persistence**:
   - Add several transactions
   - Reload the page
   - Verify all transactions are still present

## Responsive Layout Strategy

### Breakpoints
- **Mobile**: < 768px (single column)
- **Desktop**: ≥ 768px (two column)

### CSS Strategy

```css
/* Mobile-first base styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.form-container,
.balance-display,
.content-area {
  width: 100%;
}

/* Desktop layout */
@media (min-width: 768px) {
  .content-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .transaction-list {
    grid-column: 1;
  }
  
  .chart-container {
    grid-column: 2;
  }
}

/* Responsive canvas */
#pie-chart {
  max-width: 100%;
  height: auto;
}
```

### Responsive Features
- Flexible form inputs (100% width on mobile)
- Scrollable transaction list with max-height
- Canvas scales proportionally
- Touch-friendly button sizes (min 44x44px)
- Readable font sizes (min 16px to prevent zoom on iOS)

## Implementation Notes

### Initialization Sequence
1. Check Local Storage availability
2. Load transactions from storage
3. Attach event listeners to form and list
4. Render initial UI state
5. Set up error handling

### Performance Considerations
- Debounce chart redrawing if needed (not critical for MVP)
- Limit transaction list rendering (pagination not needed for MVP)
- Use event delegation for delete buttons

### Accessibility
- Use semantic HTML elements
- Ensure readable layout

### Browser Support
- Modern browsers with ES6 support
- Local Storage API (IE 8+)
- Canvas API (IE 9+)
- CSS Grid and Flexbox (IE 11+ with prefixes)

## Future Enhancements (Out of MVP Scope)

These features are explicitly excluded from the MVP but documented for future consideration:

1. **Custom Categories** (Requirement 9.1): Allow users to create and manage custom categories
2. **Transaction Sorting** (Requirement 9.2): Sort by amount, date, or category
3. **Dark Mode** (Requirement 9.3): Theme toggle for dark/light mode
