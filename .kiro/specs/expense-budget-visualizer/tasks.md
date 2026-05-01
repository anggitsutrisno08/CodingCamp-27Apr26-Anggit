# Implementation Plan: Expense Budget Visualizer

## Overview

This plan breaks down the implementation of a client-side expense tracker into discrete coding tasks. The application uses vanilla JavaScript with Chart.js for visualization, stores data in Local Storage, and provides a responsive interface for tracking expenses across three fixed categories (Food, Transport, Fun).

## Tasks

- [x] 1. Set up project structure and core files
  - Create `index.html` in root directory
  - Create `css/` folder and `css/styles.css` file
  - Create `js/` folder and `js/app.js` file
  - Add Chart.js CDN link to HTML
  - _Requirements: 8.1_

- [x] 2. Build HTML structure with semantic elements
  - Create document structure with header, main, and sections
  - Add form with inputs for item name, amount, and category dropdown
  - Add balance display section
  - Add transaction list container
  - Add pie chart canvas container
  - Add error message display element
  - _Requirements: 1.1, 2.1, 3.1, 5.1, 8.2_

- [ ] 3. Implement CSS styling for responsive layout
  - [x] 3.1 Create mobile-first base styles
    - Style form inputs and buttons
    - Style transaction list items
    - Style balance display
    - Style error messages
    - _Requirements: 7.1, 7.3_
  
  - [x] 3.2 Add desktop responsive styles with media queries
    - Implement two-column grid layout for desktop (≥768px)
    - Position transaction list and chart side-by-side
    - Ensure responsive canvas sizing
    - _Requirements: 7.2_
  
  - [x] 3.3 Style category badges with fixed colors
    - Apply Food, Transport, Fun category colors
    - Style category badges in transaction items
    - _Requirements: 4.3_

- [ ] 4. Implement data management module
  - [x] 4.1 Create core data functions
    - Write `generateId()` function for unique IDs
    - Write `createTransaction()` function to build transaction objects
    - Write `calculateBalance()` function to sum all transactions
    - Write `calculateCategoryTotals()` function for category aggregation
    - Define `CATEGORIES` constant array with Food, Transport, Fun
    - _Requirements: 1.2, 3.2, 4.1_
  


- [ ] 5. Implement validation module
  - [x] 5.1 Create validation functions
    - Write `validateItemName()` to check non-empty names
    - Write `validateAmount()` to check positive numbers
    - Write `validateCategory()` to check valid categories
    - Write `validateTransaction()` to validate all fields
    - _Requirements: 1.3, 1.4, 1.5, 4.2_
  
  - [ ]* 5.2 Write unit tests for validation
    - Test empty item name rejection
    - Test negative and zero amount rejection
    - Test invalid category rejection
    - Test valid transaction acceptance
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Local Storage persistence
  - [x] 7.1 Create storage functions
    - Write `checkLocalStorageAvailability()` to detect storage support
    - Write `saveTransactions()` to persist transaction array
    - Write `loadTransactions()` to retrieve stored data
    - Write `addTransaction()` to add and save new transaction
    - Write `deleteTransaction()` to remove and update storage
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 7.2 Write unit tests for storage operations
    - Test save and load round-trip consistency
    - Test add transaction updates storage
    - Test delete transaction updates storage
    - Mock localStorage for testing
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. Implement UI rendering module
  - [x] 8.1 Create rendering functions
    - Write `renderTransactionList()` to display all transactions
    - Write `renderBalance()` to display total balance
    - Write `showError()` to display validation errors
    - Write `escapeHtml()` utility to prevent XSS
    - Write `getCategoryColor()` utility to map category colors
    - _Requirements: 2.1, 2.3, 3.1, 3.2, 1.3_
  
  - [ ]* 8.2 Write unit tests for rendering functions
    - Test empty state display
    - Test transaction list sorting by timestamp
    - Test balance formatting
    - Test HTML escaping prevents XSS
    - _Requirements: 2.1, 3.1_

- [ ] 9. Implement Chart.js pie chart integration
  - [x] 9.1 Create chart rendering function
    - Write `renderPieChart()` to create/update Chart.js pie chart
    - Configure chart with category labels and colors
    - Set up responsive canvas sizing
    - Handle chart updates when data changes
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 9.2 Write integration tests for chart
    - Test chart displays correct category totals
    - Test chart updates when transactions change
    - Test chart uses correct category colors
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 10. Implement event handlers and application initialization
  - [x] 10.1 Create event handler functions
    - Write `handleFormSubmit()` to process form submissions
    - Write `handleDelete()` to process delete button clicks
    - Write `refreshUI()` to update all UI components
    - _Requirements: 1.2, 2.2_
  
  - [x] 10.2 Create initialization function
    - Write `initializeApp()` to set up application on load
    - Check Local Storage availability and show error if unavailable
    - Attach event listeners to form and transaction list
    - Load initial data and render UI
    - _Requirements: 6.3, 6.4_
  
  - [ ]* 10.3 Write integration tests for event handlers
    - Test form submission creates transaction
    - Test form submission with invalid data shows error
    - Test delete button removes transaction
    - Test UI refreshes after data changes
    - _Requirements: 1.2, 1.3, 2.2, 2.3_

- [ ] 11. Wire all components together
  - [x] 11.1 Connect all modules in app.js
    - Ensure all functions are defined in correct order
    - Call `initializeApp()` on DOMContentLoaded
    - Verify all event listeners are attached
    - Test complete user flow from form to display
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.3_
  
  - [ ]* 11.2 Perform manual testing checklist
    - Test adding transactions with valid data
    - Test deleting transactions
    - Test balance updates correctly
    - Test chart updates correctly
    - Test Local Storage persistence across page reloads
    - Test responsive layout on mobile and desktop
    - _Requirements: 1.2, 2.2, 3.2, 5.2, 6.1, 6.3, 7.1, 7.2_

- [-] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The design document provides detailed code examples for each module
- Chart.js will be loaded via CDN (no npm/build process needed)
- All code should use vanilla JavaScript (ES6+)
- Focus on MVP scope only - custom categories, sorting, and dark mode are out of scope (Requirement 9)
