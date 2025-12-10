class CheckoutCompletePage {
  urlPath() {
    return "/checkout-complete.html";
  }

  title() {
    return cy.get(".title");
  }

  completeHeader() {
    return cy.get(".complete-header");
  }

  backHomeButton() {
    return cy.get('[data-test="back-to-products"]');
  }
}

export default new CheckoutCompletePage();
