class InventoryPage {
  urlPath() {
    return "/inventory.html";
  }

  title() {
    return cy.get(".title");
  }

  inventoryItems() {
    return cy.get(".inventory_item");
  }

  itemNames() {
    return cy.get(".inventory_item_name");
  }

  itemPrices() {
    return cy.get(".inventory_item_price");
  }

  cartBadge() {
    return cy.get(".shopping_cart_badge");
  }

  sortSelect() {
    return cy.get(".product_sort_container");
  }

  productTileByName(name) {
    return cy.contains(".inventory_item", name);
  }

  productTitleByName(name) {
    return cy.contains(".inventory_item_name", name);
  }

  productImageByName(name) {
    return this.productTileByName(name).find(".inventory_item_img img");
  }

  addToCartButtonByName(name) {
    return this.productTileByName(name).find("button");
  }

  removeFromCartButtonByName(name) {
    return this.productTileByName(name).find("button");
  }

  productImages() {
    return cy.get(".inventory_item_img img");
  }
}

export default new InventoryPage();
