class LoginPage {
  visit() {
    cy.visit("/");
  }

  usernameInput() {
    return cy.get('[data-test="username"]');
  }

  passwordInput() {
    return cy.get('[data-test="password"]');
  }

  loginButton() {
    return cy.get('[data-test="login-button"]');
  }

  errorMessage() {
    return cy.get('[data-test="error"]');
  }

  errorCloseButton() {
    return cy.get(".error-button");
  }

  login(username, password) {
    if (username !== undefined) {
      this.usernameInput().clear().type(username);
    }

    if (password !== undefined) {
      this.passwordInput().clear().type(password);
    }

    this.loginButton().click();
  }
}

export default new LoginPage();
