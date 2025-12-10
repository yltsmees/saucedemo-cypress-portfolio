# SauceDemo Cypress Portfolio

Cypress end-to-end tests for the [SauceDemo](https://www.saucedemo.com/) demo webshop.  
I use this project in my QA / test automation portfolio to show how I design and automate UI tests.

---

## 🔧 Quick start for reviewers

To run the project locally:

```bash
git clone https://github.com/yltsmees/saucedemo-cypress-portfolio.git
cd saucedemo-cypress-portfolio
npm install

# Open Cypress GUI
npm run cy:open

# Or run all tests headless
npm run cy:run
```

Requirements:

- Node.js 18+
- Internet access (tests run against the live saucedemo.com site)

---

## Tech stack

- **Cypress** 15.x (JavaScript)
- **Node.js** 18+ (tested locally on Windows)
- **Page Object Model (POM)** for UI structure
- **Fixtures** for test data (users, cart items)
- **Custom Cypress commands** for common flows (for example `cy.loginStandard()`)

---

## What the tests cover

### Login

- Valid login with `standard_user`
- Locked out user error
- Wrong password and empty field validation
- Session handling when accessing protected pages directly
- Basic security behaviour of the password field (password masking)

### Inventory (Products)

- Products page shows the expected number of items
- Product titles, descriptions and prices
- Sorting by:
  - Name A → Z
  - Name Z → A
  - Price low → high
  - Price high → low
- Navigation from product list to product detail and back
- Sort and state reset from the menu
- Basic state persistence and reset behaviour

### Cart

- Add and remove items from:
  - Product tiles
  - Product detail pages
- Cart icon badge count
- Cart page contents, quantities and prices
- Continue Shopping flow back to Products

### Checkout

- Required field validation (first name, last name, postal code)
- Navigation through:
  - Cart → Checkout: Your Information
  - Your Information → Checkout: Overview
  - Overview → Checkout Complete
- Item total equals sum of item prices
- Total equals item total plus tax
- Money values use two decimal places
- Finish, Cancel and Back Home behaviour
- Cart cleared or preserved in the correct places

### Non-functional and UX checks

- Price formatting uses `$` and two decimals
- No username or password in URL or web storage
- Basic cookie check for sensitive data
- State behaviour on refresh and back navigation in key flows
- Simple stability check for repeated sorting actions

Some tests document issues in the demo application and are marked as **EXPECTED BUG** in the test name.  
Test cases use IDs such as `SD_LOGIN_01`, `SD_INV_04`, `SD_CHECKOUT_07` to map back to test design.

---

## Project structure

```text
cypress/
  e2e/
    cart/
      cart.cy.js
    checkout/
      checkout.cy.js
    inventory/
      inventory-navigation.cy.js
      inventory-overview.cy.js
      inventory-sorting.cy.js
      inventory-state.cy.js
    login/
      login-negative.cy.js
      login-positive.cy.js
      login-security.cy.js
      login-session.cy.js
    menu/
      menu.cy.js
    nonfunctional/
      nonfunctional.cy.js
  fixtures/
    users.json
    cartItems.json
  pages/
    loginPage.js
    inventoryPage.js
    cartPage.js
    checkoutInfoPage.js
    checkoutOverviewPage.js
    checkoutCompletePage.js
  support/
    commands.js        # custom commands (for example cy.loginStandard)
    e2e.js             # loads commands before each spec
cypress.config.js       # Cypress configuration
package.json            # dependencies and npm scripts
.gitignore
README.md
```

Each folder under `cypress/e2e` focuses on one feature area to keep tests readable and easy to maintain.  
Page Objects in `cypress/pages` encapsulate selectors and actions for each screen.

---

## How to run the tests (detailed)

### 1. Install dependencies

```bash
npm install
```

### 2. Open Cypress in GUI mode

```bash
npm run cy:open
```

This opens the Cypress Test Runner so you can:

- Run specs one by one
- Watch the tests execute in a real browser
- Inspect DOM, network requests and console output

### 3. Run the full suite in headless mode

```bash
npm run cy:run
```

This:

- Runs all specs headless in Electron
- Prints a summary of passed / failed tests in the terminal

---

## Notes about EXPECTED BUG tests

Some tests are intentionally skipped because they cover known issues in the demo application. These are marked in the test name with `(EXPECTED BUG - SKIP IT)`.

- `SD_INV_01 - Products page shows 6 items with correct data (EXPECTED BUG)`
- `SD_NONFUNC_06 - cookies must not expose username or password (EXPECTED BUG)`

How to use them:

- Keep them as normal `it(...)` tests to show that you actively look for and document defects, or
- Change them to `it.skip(...)` if you prefer a fully green `npm run cy:run` by default.

---
