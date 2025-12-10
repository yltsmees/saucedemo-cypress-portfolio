// cypress/e2e/cart/cart.cy.js

import LoginPage from "../../pages/loginPage";
import InventoryPage from "../../pages/inventoryPage";
import ProductDetailPage from "../../pages/productDetailPage";
import CartPage from "../../pages/cartPage";
import users from "../../fixtures/users.json";
import cartItems from "../../fixtures/cartItems.json";

describe("Cart behaviour", () => {
  beforeEach(() => {
    // Common start state for cart tests
    LoginPage.visit();
    LoginPage.login(users.standard.username, users.standard.password);
    cy.url().should("include", InventoryPage.urlPath());
  });

  /**
   * SD_CART_01
   * Verify adding an item to cart from inventory tile updates button and cart icon.
   */
  it("SD_CART_01 - add item from inventory tile updates button and cart icon", () => {
    InventoryPage.cartBadge().should("not.exist");

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).should(
      "have.text",
      "Remove"
    );

    InventoryPage.cartBadge().should("be.visible").and("have.text", "1");
  });

  /**
   * SD_CART_02
   * Verify removing an item from inventory tile reverts button and cart icon.
   */
  it("SD_CART_02 - remove item from inventory tile reverts button and cart icon", () => {
    // Precondition: item in cart
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.cartBadge().should("have.text", "1");

    // Remove from tile
    InventoryPage.removeFromCartButtonByName(cartItems.backpack.name).click();

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).should(
      "have.text",
      "Add to cart"
    );

    InventoryPage.cartBadge().should("not.exist");
  });

  /**
   * SD_CART_03
   * Verify adding an item to cart from product detail updates tile and cart icon.
   */
  it("SD_CART_03 - add item from detail page updates tile and cart icon", () => {
    // Open detail for Backpack
    InventoryPage.productTitleByName(cartItems.backpack.name).click();

    // Add to cart on detail page
    cy.get('[data-test^="add-to-cart"]').click();

    InventoryPage.cartBadge().should("be.visible").and("have.text", "1");

    // Back to Products
    ProductDetailPage.backButton().click();
    cy.url().should("include", InventoryPage.urlPath());

    // Tile button should show Remove
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).should(
      "have.text",
      "Remove"
    );
  });

  /**
   * SD_CART_04
   * Verify Cart page lists selected items with correct quantity and prices.
   */
  it("SD_CART_04 - cart page lists selected items with correct quantity and prices", () => {
    // Add two different items
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.addToCartButtonByName(cartItems.bikeLight.name).click();
    InventoryPage.cartBadge().should("have.text", "2");

    // Go to Cart page
    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());

    // Two rows
    CartPage.cartItems().should("have.length", 2);

    // Names in any order but two expected values
    CartPage.itemNameElements().then(($names) => {
      const actualNames = [];
      $names.each((index, el) => {
        actualNames.push(el.innerText.trim());
      });

      expect(actualNames.sort()).to.deep.equal(
        [cartItems.backpack.name, cartItems.bikeLight.name].sort()
      );
    });

    // All quantities are 1
    CartPage.quantityElements().each(($qty) => {
      cy.wrap($qty).should("have.text", "1");
    });

    // Prices match expected
    CartPage.itemPriceElements().then(($prices) => {
      const actualPrices = [];
      $prices.each((index, el) => {
        actualPrices.push(el.innerText.trim());
      });

      expect(actualPrices.sort()).to.deep.equal(
        [cartItems.backpack.price, cartItems.bikeLight.price].sort()
      );
    });
  });

  /**
   * SD_CART_05
   * Verify removing an item in Cart updates totals and icon number.
   * (We check item removed and icon count decreased.)
   */
  it("SD_CART_05 - remove item in cart updates icon number and rows", () => {
    // Precondition: two items in cart
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.addToCartButtonByName(cartItems.bikeLight.name).click();
    InventoryPage.cartBadge().should("have.text", "2");

    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());
    CartPage.cartItems().should("have.length", 2);

    // Remove one item
    CartPage.removeButtonByName(cartItems.bikeLight.name).click();

    // Row gone
    CartPage.cartItemByName(cartItems.bikeLight.name).should("not.exist");

    // Icon shows 1
    InventoryPage.cartBadge().should("have.text", "1");
  });

  /**
   * SD_CART_06
   * Verify Continue Shopping returns to Products and preserves cart.
   */
  it("SD_CART_06 - Continue Shopping returns to Products and preserves cart", () => {
    // Add one item
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.cartBadge().should("have.text", "1");

    // Go to cart
    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());

    // Continue Shopping
    CartPage.continueShoppingButton().click();

    // Back on Products and cart unchanged
    cy.url().should("include", InventoryPage.urlPath());
    InventoryPage.cartBadge().should("have.text", "1");

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).should(
      "have.text",
      "Remove"
    );
  });

  /**
   * SD_CART_07
   * Verify cart icon shows correct count when adding multiple different items.
   */
  it("SD_CART_07 - cart icon shows correct count for multiple items", () => {
    InventoryPage.cartBadge().should("not.exist");

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.addToCartButtonByName(cartItems.bikeLight.name).click();
    InventoryPage.addToCartButtonByName(cartItems.boltShirt.name).click();

    InventoryPage.cartBadge().should("have.text", "3");
  });

  /**
   * SD_CART_08
   * Verify state sync when adding item in detail page and removing from products list.
   */
  it("SD_CART_08 - state sync between detail page and products list", () => {
    // Add from detail page
    InventoryPage.productTitleByName(cartItems.backpack.name).click();
    cy.get('[data-test^="add-to-cart"]').click();

    InventoryPage.cartBadge().should("have.text", "1");

    // Back to Products
    ProductDetailPage.backButton().click();

    // Tile shows Remove
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).should(
      "have.text",
      "Remove"
    );

    // Remove from tile
    InventoryPage.removeFromCartButtonByName(cartItems.backpack.name).click();

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).should(
      "have.text",
      "Add to cart"
    );

    InventoryPage.cartBadge().should("not.exist");
  });

  /**
   * SD_CART_09
   * Verify cart contents stay after page refresh.
   */
  it("SD_CART_09 - cart contents stay after page refresh", () => {
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.cartBadge().should("have.text", "1");

    // Refresh page
    cy.reload();

    // Cart icon still 1
    InventoryPage.cartBadge().should("have.text", "1");

    // Cart page still shows the item
    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());
    CartPage.cartItemByName(cartItems.backpack.name).should("exist");
  });

  /**
   * SD_CART_10
   * Verify add/remove toggle works repeatedly without desync.
   */
  it("SD_CART_10 - add/remove toggle remains in sync with cart icon", () => {
    const name = cartItems.backpack.name;

    // 1. Add
    InventoryPage.addToCartButtonByName(name).click();
    InventoryPage.addToCartButtonByName(name).should("have.text", "Remove");
    InventoryPage.cartBadge().should("have.text", "1");

    // 2. Remove
    InventoryPage.removeFromCartButtonByName(name).click();
    InventoryPage.addToCartButtonByName(name).should(
      "have.text",
      "Add to cart"
    );
    InventoryPage.cartBadge().should("not.exist");

    // 3. Add again
    InventoryPage.addToCartButtonByName(name).click();
    InventoryPage.addToCartButtonByName(name).should("have.text", "Remove");
    InventoryPage.cartBadge().should("have.text", "1");
  });
});
