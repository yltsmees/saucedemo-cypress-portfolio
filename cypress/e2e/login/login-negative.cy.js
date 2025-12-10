// cypress/e2e/login/login-negative.cy.js

import LoginPage from "../../pages/loginPage";
import users from "../../fixtures/users.json";

describe("Login negative scenarios", () => {
  it("SD_LOGIN_02 - locked_out_user shows locked out error", () => {
    LoginPage.visit();

    LoginPage.login(users.lockedOut.username, users.lockedOut.password);

    LoginPage.errorMessage()
      .should("be.visible")
      .and("have.text", "Epic sadface: Sorry, this user has been locked out.");
  });

  it("SD_LOGIN_03 - invalid password shows generic credentials error", () => {
    LoginPage.visit();

    LoginPage.login(
      users.invalid.wrongPassword.username,
      users.invalid.wrongPassword.password
    );

    LoginPage.errorMessage()
      .should("be.visible")
      .and(
        "have.text",
        "Epic sadface: Username and password do not match any user in this service"
      );
  });

  it("SD_LOGIN_04 - blank username and password shows username required error", () => {
    LoginPage.visit();

    // Do not type anything, just click login
    LoginPage.loginButton().click();

    LoginPage.errorMessage()
      .should("be.visible")
      .and("have.text", "Epic sadface: Username is required");
  });

  it("SD_LOGIN_05 - blank password shows password required error", () => {
    LoginPage.visit();
    LoginPage.usernameInput().type(users.standard.username);
    LoginPage.loginButton().click();
    LoginPage.errorMessage()
      .should("be.visible")
      .and("have.text", "Epic sadface: Password is required");
  });

  it("SD_LOGIN_10 - dismissing error hides it and it reappears on next invalid submit", () => {
    LoginPage.visit();

    LoginPage.login(
      users.invalid.wrongPassword.username,
      users.invalid.wrongPassword.password
    );
    LoginPage.errorMessage().should("be.visible");

    LoginPage.errorCloseButton().click();

    LoginPage.errorMessage().should("not.exist");

    LoginPage.login(
      users.invalid.wrongPassword.username,
      users.invalid.wrongPassword.password
    );

    LoginPage.errorMessage()
      .should("be.visible")
      .and(
        "have.text",
        "Epic sadface: Username and password do not match any user in this service"
      );
  });

  it("SD_EDGE_01 - username is case sensitive", () => {
    LoginPage.visit();

    LoginPage.login(
      users.invalid.wrongCaseUsername.username,
      users.invalid.wrongCaseUsername.password
    );

    LoginPage.errorMessage()
      .should("be.visible")
      .and(
        "have.text",
        "Epic sadface: Username and password do not match any user in this service"
      );
  });

  it("SD_NONFUNC_10 - login error message text is clear and exact", () => {
    LoginPage.visit();

    LoginPage.login(
      users.invalid.unknownUser.username,
      users.invalid.unknownUser.password
    );

    LoginPage.errorMessage()
      .should("be.visible")
      .and(
        "have.text",
        "Epic sadface: Username and password do not match any user in this service"
      );
  });
});
