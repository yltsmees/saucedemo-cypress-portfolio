class CheckoutInfoPage {
  urlPath() {
    return "/checkout-step-one.html";
  }

  firstNameInput() {
    return cy.get('[data-test="firstName"]');
  }

  lastNameInput() {
    return cy.get('[data-test="lastName"]');
  }

  postalCodeInput() {
    return cy.get('[data-test="postalCode"]');
  }

  continueButton() {
    return cy.get('[data-test="continue"]');
  }

  cancelButton() {
    return cy.get('[data-test="cancel"]');
  }

  errorMessage() {
    return cy.get('[data-test="error"]');
  }

  // Labels for SD_CHECKOUT_05 (visual required indicators)
  firstNameLabel() {
    return cy.get('label[for="first-name"]');
  }

  lastNameLabel() {
    return cy.get('label[for="last-name"]');
  }

  postalCodeLabel() {
    return cy.get('label[for="postal-code"]');
  }
}

export default new CheckoutInfoPage();
