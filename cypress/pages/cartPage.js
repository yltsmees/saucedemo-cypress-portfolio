class CartPage {
  urlPath() {
    return "/cart.html";
  }

  cartLink() {
    return cy.get(".shopping_cart_link");
  }

  cartItems() {
    return cy.get(".cart_item");
  }

  itemNameElements() {
    return cy.get(".cart_item .inventory_item_name");
  }

  itemPriceElements() {
    return cy.get(".cart_item .inventory_item_price");
  }

  cartItemByName(name) {
    return cy.contains(".cart_item", name);
  }

  removeButtonByName(name) {
    return this.cartItemByName(name).find("button");
  }

  quantityElements() {
    return cy.get(".cart_item .cart_quantity");
  }

  continueShoppingButton() {
    return cy.get('[data-test="continue-shopping"]');
  }

  checkoutButton() {
    return cy.get('[data-test="checkout"]');
  }
}

export default new CartPage();
