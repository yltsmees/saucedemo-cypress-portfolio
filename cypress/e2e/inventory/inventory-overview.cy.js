import InventoryPage from "../../pages/inventoryPage";
import cartItems from "../../fixtures/cartItems.json";

describe("Inventory overview and product data", () => {
  beforeEach(() => {
    cy.loginStandard();
  });

  it.skip("SD_INV_01 - Products page shows 6 items with correct data (EXPECTED BUG - SKIP IT)", () => {
    const expectedNames = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
      "Sauce Labs Onesie",
      "Sauce Labs Red T-Shirt",
    ];

    InventoryPage.inventoryItems().should("have.length", expectedNames.length);

    InventoryPage.itemNames()
      .should("have.length", expectedNames.length)
      .each(($el, index) => {
        cy.wrap($el).should("have.text", expectedNames[index]);
      });

    InventoryPage.itemPrices()
      .should("have.length", expectedNames.length)
      .each(($price) => {
        cy.wrap($price)
          .invoke("text")
          .should("match", /^\$\d+\.\d{2}$/);
      });

    InventoryPage.inventoryItems().each(($item) => {
      cy.wrap($item).find(".inventory_item_img img").should("be.visible");
      cy.wrap($item)
        .find("button")
        .should("be.visible")
        .and("contain.text", "Add to cart");
    });
  });

  it.skip("SD_INV_08 - product image alt matches product name (EXPECTED BUG - SKIP IT)", () => {
    const expectedNames = cartItems.inventoryOrder;

    InventoryPage.inventoryItems()
      .should("have.length", expectedNames.length)
      .each(($item, index) => {
        const expectedName = expectedNames[index];

        const actualName = $item.find(".inventory_item_name").text().trim();
        const img = $item.find(".inventory_item_img img");

        expect(actualName).to.eq(expectedName);
        expect(img).to.have.attr("alt", expectedName);
      });
  });
});
