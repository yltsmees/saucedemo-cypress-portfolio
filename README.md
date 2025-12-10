# SauceDemo Cypress Portfolio

Cypress end-to-end tests for the [SauceDemo](https://www.saucedemo.com/) demo webshop.  
I use this project in my QA / test automation portfolio to show how I design and automate UI tests.

---

## Tech stack

- **Cypress** 15.x (JavaScript)
- **Node.js** 18+ (tested locally on Windows)
- **Page Object Model** for UI structure
- **Fixtures** for test data (users, cart items)
- **Custom Cypress commands** for common flows (for example `cy.loginStandard()`)

---

## What the tests cover

### Login

- Valid login with `standard_user`
- Locked out user error
- Wrong password and empty field validation
- Session handling when accessing protected pages directly
- Basic security behaviour of the password field

### Inventory (Products)

- Products page shows the expected number of items
- Product titles, descriptions and prices
- Sorting by:
  - Name A → Z
  - Name Z → A
  - Price low → high
  - Price high → low
- Navigation from list to product detail and back
- Sort and state reset from the menu

### Cart

- Add and remove items from:
  - Product tiles
  - Product detail pages
- Cart icon badge count
- Cart page contents, quantities and prices
- Continue Shopping flow

### Checkout

- Required field validation (first name, last name, postal code)
- Navigation through:
  - Cart → Your Information
  - Your Information → Overview
  - Overview → Complete
- Item total equals sum of item prices
- Total equals item total plus tax
- Money values use two decimal places
- Finish, Cancel and Back Home behaviour
- Cart cleared or preserved in the correct places

### Non-functional and UX checks

- Price formatting uses `$` and two decimals
- No username or password in URL or web storage
- Basic cookie check for sensitive data
- State behaviour on refresh and back navigation
- Simple stability check for repeated sorting

Some tests document issues in the demo application and are marked as **EXPECTED BUG** in the test name.

Test cases use IDs such as `SD_LOGIN_01`, `SD_INV_04`, `SD_CHECKOUT_07` to make it easy to link back to manual test design.

---

## Project structure

```text
cypress/
  e2e/
    cart/
    checkout/
    inventory/
    login/
    menu/
    nonfunctional/
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
