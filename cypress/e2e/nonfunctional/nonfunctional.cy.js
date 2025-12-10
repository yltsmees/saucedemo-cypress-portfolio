import LoginPage from "../../pages/loginPage";
import InventoryPage from "../../pages/inventoryPage";
import CartPage from "../../pages/cartPage";
import CheckoutInfoPage from "../../pages/checkoutInfoPage";
import CheckoutOverviewPage from "../../pages/checkoutOverviewPage";

import users from "../../fixtures/users.json";
import cartItems from "../../fixtures/cartItems.json";
import checkoutData from "../../fixtures/checkoutData.json";

describe("SauceDemo non-functional tests (fully automatable)", () => {
  it("SD_NONFUNC_02 - all product prices use $ and two decimals", () => {
    cy.loginStandard();

    const moneyRegex = /^\$\d+\.\d{2}$/;

    InventoryPage.itemPrices().each(($price) => {
      const text = $price.text().trim();
      expect(text).to.match(
        moneyRegex,
        `Price "${text}" should be in format $xx.xx`
      );
    });
  });

  it("SD_NONFUNC_05 - no username/password in URL or web storage", () => {
    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());

    cy.location("search").then((search) => {
      expect(search).to.not.include(users.standard.username);
      expect(search).to.not.include(users.standard.password);
    });

    cy.window().then((win) => {
      const sensitive = [users.standard.username, users.standard.password];

      const values = [];

      for (let i = 0; i < win.localStorage.length; i++) {
        const key = win.localStorage.key(i);
        values.push(win.localStorage.getItem(key));
      }

      for (let i = 0; i < win.sessionStorage.length; i++) {
        const key = win.sessionStorage.key(i);
        values.push(win.sessionStorage.getItem(key));
      }

      const combined = values.join("||") || "";

      sensitive.forEach((val) => {
        expect(
          combined.includes(val),
          `Storage should not contain sensitive value "${val}"`
        ).to.be.false;
      });
    });
  });

  it.skip("SD_NONFUNC_06 - cookies must not expose username or password (EXPECTED BUG - SKIP IT)", () => {
    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());

    cy.getCookies().then((cookies) => {
      const combined = cookies.map((c) => `${c.name}=${c.value}`).join(";");

      expect(combined).to.not.include(users.standard.username);
      expect(combined).to.not.include(users.standard.password);
    });
  });

  it("SD_NONFUNC_07 - sorting remains stable under repeated toggling", () => {
    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());

    const sortOptions = [
      "Name (A to Z)",
      "Name (Z to A)",
      "Price (low to high)",
      "Price (high to low)",
    ];

    const loops = 5; // 5 * 4 = 20 sort changes

    for (let i = 0; i < loops; i++) {
      sortOptions.forEach((option) => {
        InventoryPage.sortSelect().select(option);
        InventoryPage.inventoryItems().should("have.length", 6);
      });
    }
  });

  it("SD_NONFUNC_08 - refreshing Checkout Overview preserves state", () => {
    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.addToCartButtonByName(cartItems.bikeLight.name).click();
    InventoryPage.cartBadge().should("have.text", "2");

    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());

    CartPage.checkoutButton().click();
    cy.url().should("include", CheckoutInfoPage.urlPath());

    CheckoutInfoPage.firstNameInput().type(checkoutData.valid.firstName);
    CheckoutInfoPage.lastNameInput().type(checkoutData.valid.lastName);
    CheckoutInfoPage.postalCodeInput().type(checkoutData.valid.postalCode);
    CheckoutInfoPage.continueButton().click();

    cy.url().should("include", CheckoutOverviewPage.urlPath());

    const beforeNames = [];
    const beforePrices = [];

    CheckoutOverviewPage.itemNameElements().then(($names) => {
      $names.each((i, el) => beforeNames.push(el.innerText.trim()));
    });

    CheckoutOverviewPage.itemPriceElements().then(($prices) => {
      $prices.each((i, el) => beforePrices.push(el.innerText.trim()));
    });

    cy.reload();
    cy.url().should("include", CheckoutOverviewPage.urlPath());

    CheckoutOverviewPage.itemNameElements().then(($names) => {
      const afterNames = [];
      $names.each((i, el) => afterNames.push(el.innerText.trim()));
      expect(afterNames).to.deep.equal(beforeNames);
    });

    CheckoutOverviewPage.itemPriceElements().then(($prices) => {
      const afterPrices = [];
      $prices.each((i, el) => afterPrices.push(el.innerText.trim()));
      expect(afterPrices).to.deep.equal(beforePrices);
    });
  });

  it.skip("SD_NONFUNC_09 - Back from Overview keeps checkout form data (EXPECTED BUG - SKIP IT)", () => {
    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.cartBadge().should("have.text", "1");

    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());

    CartPage.checkoutButton().click();
    cy.url().should("include", CheckoutInfoPage.urlPath());

    CheckoutInfoPage.firstNameInput().type(checkoutData.valid.firstName);
    CheckoutInfoPage.lastNameInput().type(checkoutData.valid.lastName);
    CheckoutInfoPage.postalCodeInput().type(checkoutData.valid.postalCode);

    CheckoutInfoPage.continueButton().click();
    cy.url().should("include", CheckoutOverviewPage.urlPath());
    cy.go("back");
    cy.url().should("include", CheckoutInfoPage.urlPath());

    CheckoutInfoPage.firstNameInput().should(
      "have.value",
      checkoutData.valid.firstName
    );
    CheckoutInfoPage.lastNameInput().should(
      "have.value",
      checkoutData.valid.lastName
    );
    CheckoutInfoPage.postalCodeInput().should(
      "have.value",
      checkoutData.valid.postalCode
    );
  });

  it("SD_NONFUNC_10 - validation messages are clear and specific", () => {
    LoginPage.visit();
    LoginPage.usernameInput().type(users.standard.username);
    LoginPage.passwordInput().type("wrongpassword");
    LoginPage.loginButton().click();

    LoginPage.errorMessage()
      .should("be.visible")
      .and(
        "have.text",
        "Epic sadface: Username and password do not match any user in this service"
      );

    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());

    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());
    CartPage.checkoutButton().click();
    cy.url().should("include", CheckoutInfoPage.urlPath());

    CheckoutInfoPage.continueButton().click();

    CheckoutInfoPage.errorMessage()
      .should("be.visible")
      .and("have.text", "Error: First Name is required");
  });
});
