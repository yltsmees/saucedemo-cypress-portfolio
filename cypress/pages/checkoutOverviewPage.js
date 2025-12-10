class CheckoutOverviewPage {
  urlPath() {
    return "/checkout-step-two.html";
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

  itemTotalLabel() {
    return cy.get(".summary_subtotal_label");
  }

  taxLabel() {
    return cy.get(".summary_tax_label");
  }

  totalLabel() {
    return cy.get(".summary_total_label");
  }

  finishButton() {
    return cy.get('[data-test="finish"]');
  }

  cancelButton() {
    return cy.get('[data-test="cancel"]');
  }
}

export default new CheckoutOverviewPage();
