import InventoryPage from "../../pages/inventoryPage";
import MenuPage from "../../pages/menuPage";
import FooterPage from "../../pages/footerPage";

import menuLinks from "../../fixtures/menuLinks.json";
import cartItems from "../../fixtures/cartItems.json";

describe("Menu and footer links", () => {
  beforeEach(() => {
    cy.loginStandard();
    cy.url().should("include", InventoryPage.urlPath());
  });

  it("SD_MENU_01 - About link points to Sauce Labs website", () => {
    MenuPage.openMenu();
    MenuPage.aboutLink()
      .should("be.visible")
      .and("have.attr", "href", menuLinks.aboutUrl); // "https://saucelabs.com/"

    MenuPage.aboutLink().click();

    cy.origin("https://saucelabs.com", () => {
      cy.location("href").should("include", "saucelabs.com");
    });
  });

  it("SD_MENU_02 - Reset App State from Menu clears cart and sort", () => {
    InventoryPage.addToCartButtonByName(cartItems.backpack.name).click();
    InventoryPage.addToCartButtonByName(cartItems.bikeLight.name).click();
    InventoryPage.cartBadge().should("have.text", "2");

    InventoryPage.sortSelect().select("Name (Z to A)");
    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (Z to A)");

    MenuPage.openMenu();
    MenuPage.resetAppStateLink().click();

    cy.reload();
    cy.url().should("include", InventoryPage.urlPath());

    InventoryPage.inventoryItems()
      .find("button")
      .each(($btn) => {
        cy.wrap($btn).should("have.text", "Add to cart");
      });

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (A to Z)");

    InventoryPage.cartBadge().should("not.exist");
    cy.get(".shopping_cart_link").click();
    cy.url().should("include", "/cart.html");
    cy.get(".cart_item").should("have.length", 0);
  });

  it("SD_MENU_03 - Twitter footer link points to Twitter profile", () => {
    FooterPage.twitterLink()
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", menuLinks.twitterDomain);

    FooterPage.twitterLink().should("have.attr", "target", "_blank");
  });

  it("SD_MENU_04 - Facebook footer link points to Facebook profile", () => {
    FooterPage.facebookLink()
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", menuLinks.facebookDomain);

    FooterPage.facebookLink().should("have.attr", "target", "_blank");
  });

  it("SD_MENU_05 - LinkedIn footer link points to LinkedIn profile", () => {
    FooterPage.linkedinLink()
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", menuLinks.linkedinDomain);

    FooterPage.linkedinLink().should("have.attr", "target", "_blank");
  });
});
