import InventoryPage from "../../pages/inventoryPage";
import ProductDetailPage from "../../pages/productDetailPage";
import MenuPage from "../../pages/menuPage";

describe("Inventory state and reset", () => {
  beforeEach(() => {
    cy.loginStandard();
  });

  function collectNames() {
    return InventoryPage.itemNames().then(($els) => {
      const names = [];
      $els.each((index, el) => {
        names.push(el.innerText.trim());
      });
      return names;
    });
  }

  it.skip("SD_INV_09 - sort and order persist after visiting a detail page and going back (EXPECTED BUG - SKIP IT)", () => {
    InventoryPage.sortSelect().select("Price (high to low)");

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Price (high to low)");

    collectNames().then((initialNames) => {
      cy.wrap(initialNames).as("initialNames");
    });

    InventoryPage.itemNames().first().click();

    ProductDetailPage.backButton().click();

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Price (high to low)");

    collectNames().then((namesAfter) => {
      cy.get("@initialNames").then((initialNames) => {
        expect(namesAfter).to.deep.equal(initialNames);
      });
    });
  });

  it("SD_INV_10 - Reset App State clears cart and restores default sort and order", () => {
    collectNames().then((defaultOrder) => {
      cy.wrap(defaultOrder).as("defaultOrder");
    });

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (A to Z)");

    InventoryPage.sortSelect().select("Name (Z to A)");

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (Z to A)");

    collectNames().then((changedOrder) => {
      cy.get("@defaultOrder").then((defaultOrder) => {
        expect(changedOrder).to.not.deep.equal(defaultOrder);
      });
    });

    InventoryPage.addToCartButtonByName("Sauce Labs Backpack").click();
    InventoryPage.addToCartButtonByName("Sauce Labs Bike Light").click();
    InventoryPage.cartBadge().should("have.text", "2");

    MenuPage.openMenu();

    MenuPage.resetAppStateLink().click();
    cy.reload();

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (A to Z)");

    collectNames().then((orderAfterReset) => {
      cy.get("@defaultOrder").then((defaultOrder) => {
        expect(orderAfterReset).to.deep.equal(defaultOrder);
      });
    });

    InventoryPage.cartBadge().should("not.exist");

    InventoryPage.inventoryItems()
      .find("button")
      .each(($btn) => {
        cy.wrap($btn).should("have.text", "Add to cart");
      });
  });
});
