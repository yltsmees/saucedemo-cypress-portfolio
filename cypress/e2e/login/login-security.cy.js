// cypress/e2e/login/login-security.cy.js

import LoginPage from "../../pages/loginPage";

describe("Login security behaviour", () => {
  it("SD_LOGIN_06 - password field masks characters", () => {
    LoginPage.visit();

    const testPassword = "secret_sauce";

    LoginPage.passwordInput()
      .type(testPassword)
      .should("have.attr", "type", "password");

    LoginPage.passwordInput().invoke("val").should("eq", testPassword);
  });
});
