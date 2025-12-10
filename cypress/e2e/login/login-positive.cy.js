import LoginPage from "../../pages/loginPage";
import InventoryPage from "../../pages/inventoryPage";
import users from "../../fixtures/users.json";

describe("Login positive scenarios", () => {
  it("SD_LOGIN_01 - valid standard_user logs in and sees Products page", () => {
    LoginPage.visit();
    LoginPage.login(users.standard.username, users.standard.password);

    cy.url().should("include", InventoryPage.urlPath());

    InventoryPage.title().should("be.visible").and("have.text", "Products");

    InventoryPage.inventoryItems()
      .should("have.length", 6)
      .each(($item) => {
        cy.wrap($item).should("be.visible");
      });
    LoginPage.errorMessage().should("not.exist");
  });

  it("SD_LOGIN_09 - Enter key submits login form", () => {
    LoginPage.visit();

    LoginPage.usernameInput().type(users.standard.username);

    LoginPage.passwordInput().type(`${users.standard.password}{enter}`);
    cy.url().should("include", InventoryPage.urlPath());

    InventoryPage.title().should("be.visible").and("have.text", "Products");

    InventoryPage.inventoryItems().should("have.length.at.least", 1);

    LoginPage.errorMessage().should("not.exist");
  });
});
