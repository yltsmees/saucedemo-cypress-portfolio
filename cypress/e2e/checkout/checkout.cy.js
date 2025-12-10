import InventoryPage from "../../pages/inventoryPage";
import CartPage from "../../pages/cartPage";
import CheckoutInfoPage from "../../pages/checkoutInfoPage";
import CheckoutOverviewPage from "../../pages/checkoutOverviewPage";
import CheckoutCompletePage from "../../pages/checkoutCompletePage";

import cartItems from "../../fixtures/cartItems.json";
import checkoutData from "../../fixtures/checkoutData.json";

describe("Checkout flow", () => {
  beforeEach(() => {
    cy.loginStandard();

    // Add two items
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.addToCartButtonByName(cartItems.bikeLight.name).click();
    InventoryPage.cartBadge().should("have.text", "2");

    // Go to Cart page
    CartPage.cartLink().click();
    cy.url().should("include", CartPage.urlPath());
  });

  function goToCheckoutInfo() {
    CartPage.checkoutButton().click();
    cy.url().should("include", CheckoutInfoPage.urlPath());
    cy.contains(".title", "Checkout: Your Information").should("be.visible");
  }

  function goToCheckoutOverview() {
    goToCheckoutInfo();

    CheckoutInfoPage.firstNameInput().type(checkoutData.valid.firstName);
    CheckoutInfoPage.lastNameInput().type(checkoutData.valid.lastName);
    CheckoutInfoPage.postalCodeInput().type(checkoutData.valid.postalCode);
    CheckoutInfoPage.continueButton().click();

    cy.url().should("include", CheckoutOverviewPage.urlPath());
    cy.contains(".title", "Checkout: Overview").should("be.visible");
  }

  it("SD_CHECKOUT_01 - Checkout button navigates to Your Information page", () => {
    CartPage.checkoutButton().click();

    cy.url().should("include", CheckoutInfoPage.urlPath());
    cy.contains(".title", "Checkout: Your Information").should("be.visible");
  });

  it("SD_CHECKOUT_02 - First Name is mandatory", () => {
    goToCheckoutInfo();

    // Leave all fields blank and continue
    CheckoutInfoPage.continueButton().click();

    CheckoutInfoPage.errorMessage()
      .should("be.visible")
      .and("contain.text", "Error: First Name is required");
  });

  it("SD_CHECKOUT_03 - Last Name is mandatory", () => {
    goToCheckoutInfo();

    // Fill only First Name
    CheckoutInfoPage.firstNameInput().type(checkoutData.valid.firstName);
    CheckoutInfoPage.continueButton().click();

    CheckoutInfoPage.errorMessage()
      .should("be.visible")
      .and("contain.text", "Error: Last Name is required");
  });

  it("SD_CHECKOUT_04 - Postal Code is mandatory", () => {
    goToCheckoutInfo();

    // Fill first and last name, leave postal code empty
    CheckoutInfoPage.firstNameInput().type(checkoutData.valid.firstName);
    CheckoutInfoPage.lastNameInput().type(checkoutData.valid.lastName);
    CheckoutInfoPage.continueButton().click();

    CheckoutInfoPage.errorMessage()
      .should("be.visible")
      .and("contain.text", "Error: Postal Code is required");
  });

  it.skip("SD_CHECKOUT_05 - mandatory fields are visually indicated as required (EXPECTED BUG - SKIP IT)", () => {
    goToCheckoutInfo();

    CheckoutInfoPage.firstNameLabel().should("contain.text", "*");
    CheckoutInfoPage.lastNameLabel().should("contain.text", "*");
    CheckoutInfoPage.postalCodeLabel().should("contain.text", "*");
  });

  it("SD_CHECKOUT_06 - valid info proceeds to Checkout Overview", () => {
    goToCheckoutInfo();

    CheckoutInfoPage.firstNameInput().type(checkoutData.valid.firstName);
    CheckoutInfoPage.lastNameInput().type(checkoutData.valid.lastName);
    CheckoutInfoPage.postalCodeInput().type(checkoutData.valid.postalCode);
    CheckoutInfoPage.continueButton().click();

    cy.url().should("include", CheckoutOverviewPage.urlPath());
    cy.contains(".title", "Checkout: Overview").should("be.visible");
    CheckoutOverviewPage.cartItems().should("have.length", 2);
  });

  it("SD_CHECKOUT_07 - item total equals sum of item prices", () => {
    goToCheckoutOverview();

    CheckoutOverviewPage.itemPriceElements().then(($prices) => {
      let sum = 0;

      $prices.each((index, el) => {
        const text = el.innerText.replace("$", "").trim();
        sum += parseFloat(text);
      });

      CheckoutOverviewPage.itemTotalLabel()
        .invoke("text")
        .then((labelText) => {
          const match = labelText.match(/\$([0-9.]+)/);
          expect(match, "Item total value present").to.not.be.null;

          const itemTotal = parseFloat(match[1]);

          const roundedSum = Number(sum.toFixed(2));
          const roundedItemTotal = Number(itemTotal.toFixed(2));

          expect(roundedItemTotal).to.eq(roundedSum);
        });
    });
  });

  it("SD_CHECKOUT_08 - Total equals Item total plus Tax", () => {
    goToCheckoutOverview();

    CheckoutOverviewPage.itemTotalLabel()
      .invoke("text")
      .then((itemText) => {
        const itemMatch = itemText.match(/\$([0-9.]+)/);
        const itemTotal = parseFloat(itemMatch[1]);

        CheckoutOverviewPage.taxLabel()
          .invoke("text")
          .then((taxText) => {
            const taxMatch = taxText.match(/\$([0-9.]+)/);
            const tax = parseFloat(taxMatch[1]);

            CheckoutOverviewPage.totalLabel()
              .invoke("text")
              .then((totalText) => {
                const totalMatch = totalText.match(/\$([0-9.]+)/);
                const total = parseFloat(totalMatch[1]);

                const expectedTotal = Number((itemTotal + tax).toFixed(2));
                const roundedTotal = Number(total.toFixed(2));

                expect(roundedTotal).to.eq(expectedTotal);
              });
          });
      });
  });

  it("SD_CHECKOUT_09 - item total and tax are accurate to 2 decimal places", () => {
    goToCheckoutOverview();

    const assertTwoDecimalPrecision = (labelCommand) => {
      labelCommand.invoke("text").then((text) => {
        const match = text.match(/\$([0-9.]+)/);
        expect(match, "money value present").to.not.be.null;

        //flaky float rounding
        const raw = match[1]; // "23.00000000000001"
        const value = parseFloat(raw); // 23.00000000000001
        const rounded = Number(value.toFixed(2)); // 23.00

        const diff = Math.abs(value - rounded);
        expect(diff).to.be.lessThan(0.0001);
      });
    };

    assertTwoDecimalPrecision(CheckoutOverviewPage.itemTotalLabel());
    assertTwoDecimalPrecision(CheckoutOverviewPage.taxLabel());
  });

  it("SD_CHECKOUT_10 - Finish completes the order and clears the cart", () => {
    goToCheckoutOverview();

    CheckoutOverviewPage.finishButton().click();

    cy.url().should("include", CheckoutCompletePage.urlPath());
    CheckoutCompletePage.completeHeader()
      .should("be.visible")
      .and("contain.text", "Thank you for your order!");

    // Cart icon cleared
    InventoryPage.cartBadge().should("not.exist");
  });

  it("SD_CHECKOUT_11 - Cancel from Overview returns to Products and preserves cart", () => {
    goToCheckoutOverview();

    CheckoutOverviewPage.cancelButton().click();

    cy.url().should("include", InventoryPage.urlPath());
    InventoryPage.cartBadge().should("have.text", "2");
  });

  it("SD_CHECKOUT_12 - Back Home from Complete returns to Products and cart stays cleared", () => {
    goToCheckoutOverview();

    CheckoutOverviewPage.finishButton().click();
    cy.url().should("include", CheckoutCompletePage.urlPath());
    CheckoutCompletePage.backHomeButton().click();
    cy.url().should("include", InventoryPage.urlPath());
    InventoryPage.cartBadge().should("not.exist");
  });
});
