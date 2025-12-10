// cypress/e2e/login/login-session.cy.js

import LoginPage from "../../pages/loginPage";
import InventoryPage from "../../pages/inventoryPage";
import MenuPage from "../../pages/menuPage";

describe("Login session handling", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("SD_LOGIN_08 - protected Products page is blocked when logged out", () => {
    // Not logged in, fresh state from beforeEach

    cy.visit("/inventory.html", { failOnStatusCode: false });
    cy.contains(".title", "Products").should("not.exist");
    cy.get(".inventory_item").should("not.exist");

    cy.visit("/");
    LoginPage.usernameInput().should("be.visible");
    LoginPage.passwordInput().should("be.visible");
    LoginPage.loginButton().should("be.visible");
  });

  it("SD_LOGIN_07 - logout clears session and blocks direct Products URL", () => {
    // Login as standard_user
    cy.loginStandard();

    cy.url().should("include", InventoryPage.urlPath());
    InventoryPage.title().should("have.text", "Products");
    InventoryPage.inventoryItems().should("have.length", 6);

    MenuPage.logout();

    cy.visit("/inventory.html", { failOnStatusCode: false });

    cy.contains(".title", "Products").should("not.exist");
    cy.get(".inventory_item").should("not.exist");

    cy.visit("/");
    LoginPage.loginButton().should("be.visible");
  });
});
