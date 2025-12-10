import LoginPage from "../pages/loginPage";
import users from "../fixtures/users.json";

Cypress.Commands.add("loginStandard", () => {
  LoginPage.visit();
  LoginPage.login(users.standard.username, users.standard.password);
});
