# Requirements Document

## Introduction

The Expense Tracker is a simple client-side web application for tracking personal expenses. The application runs in the browser using HTML, CSS, and vanilla JavaScript, with data saved to Local Storage. It provides a minimal interface for adding expenses, viewing transaction history, and visualizing spending by category.

## Glossary

- **Application**: The Expense Tracker web application
- **User**: A person using the Application to track expenses
- **Transaction**: A financial record with item name, amount, and category
- **Category**: A fixed classification for transactions (Food, Transport,Fun)
- **Local_Storage**: Browser storage for saving data client-side
- **Balance**: The total sum of all transaction amounts

## Requirements

### Requirement 1: Transaction Input

**User Story:** As a User, I want to add transactions with item name, amount, and category, so that I can track my expenses.

#### Acceptance Criteria

1. THE Application SHALL provide an input form with fields for item name, amount, and category
2. WHEN a User submits a transaction with valid data, THE Application SHALL create the transaction record
3. WHEN a User submits a transaction with invalid data, THE Application SHALL display an error message
4. THE Application SHALL validate that amounts are positive numbers
5. THE Application SHALL validate that item names are not empty

### Requirement 2: Transaction List

**User Story:** As a User, I want to view all my transactions and delete them, so that I can review and manage my expense history.

#### Acceptance Criteria

1. THE Application SHALL display a scrollable list of all transactions showing item name, amount, and category
2. WHEN a User deletes a transaction, THE Application SHALL remove it from the list
3. WHEN transactions change, THE Application SHALL update the display

### Requirement 3: Balance Calculation

**User Story:** As a User, I want to see my total balance automatically updated, so that I know my total spending.

#### Acceptance Criteria

1. THE Application SHALL display the total balance of all transactions
2. WHEN a transaction is added or deleted, THE Application SHALL recalculate and display the updated balance

### Requirement 4: Fixed Categories

**User Story:** As a User, I want to select from predefined categories, so that I can classify my expenses consistently.

#### Acceptance Criteria

1. THE Application SHALL provide fixed categories: Food, Transport,Fun
2. THE Application SHALL require category selection for each transaction
3. THE Application SHALL use consistent colors for each category

### Requirement 5: Pie Chart Visualization

**User Story:** As a User, I want to see a pie chart of spending by category, so that I can understand my spending distribution.

#### Acceptance Criteria

1. THE Application SHALL display a pie chart showing expense distribution by category
2. WHEN transaction data changes, THE Application SHALL update the pie chart
3. THE Application SHALL use distinct colors for different categories in the chart

### Requirement 6: Local Storage Persistence

**User Story:** As a User, I want my transactions saved automatically, so that I don't lose my data when I close the browser.

#### Acceptance Criteria

1. WHEN a transaction is created, THE Application SHALL store it in Local_Storage
2. WHEN a transaction is deleted, THE Application SHALL remove it from Local_Storage
3. WHEN the Application loads, THE Application SHALL retrieve all stored transactions from Local_Storage
4. WHEN Local_Storage is unavailable, THE Application SHALL display an error message

### Requirement 7: Basic Responsive Design

**User Story:** As a User, I want the application to work on different screen sizes, so that I can use it on various devices.

#### Acceptance Criteria

1. THE Application SHALL display a usable layout on mobile screens (below 768px width)
2. THE Application SHALL display a usable layout on desktop screens (above 768px width)
3. THE Application SHALL ensure all content is accessible without horizontal scrolling

### Requirement 8: Code Organization

**User Story:** As a developer, I want the codebase organized clearly, so that the code is easy to understand.


#### Acceptance Criteria

1. THE Application SHALL use one HTML file, one CSS file, and one JavaScript file
2. THE Application SHALL use semantic HTML5 elements
3. THE Application SHALL use clear naming for functions and variables

### Requirement 9: Optional Features

**User Story:** As a User, I want additional features to enhance usability and experience.

#### Acceptance Criteria

1. THE Application SHALL allow users to create custom categories
2. THE Application SHALL provide sorting of transactions by amount or category
3. THE Application SHALL provide a dark/light mode toggle
