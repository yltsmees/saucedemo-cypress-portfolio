import InventoryPage from "../../pages/inventoryPage";
import ProductDetailPage from "../../pages/productDetailPage";

const PRODUCT_NAME = "Sauce Labs Backpack";

describe("Inventory navigation to product detail", () => {
  beforeEach(() => {
    cy.loginStandard();
  });

  it("SD_INV_06 - clicking product title opens detail page", () => {
    InventoryPage.productTitleByName(PRODUCT_NAME).click();

    ProductDetailPage.title()
      .should("be.visible")
      .and("have.text", PRODUCT_NAME);

    ProductDetailPage.backButton().should("be.visible");
  });

  it("SD_INV_07 - clicking product image opens detail page", () => {
    InventoryPage.productImageByName(PRODUCT_NAME).click();

    ProductDetailPage.title()
      .should("be.visible")
      .and("have.text", PRODUCT_NAME);

    ProductDetailPage.backButton().should("be.visible");
  });
});
