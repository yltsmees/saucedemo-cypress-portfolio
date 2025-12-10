class MenuPage {
  menuButton() {
    return cy.get("#react-burger-menu-btn");
  }

  closeMenuButton() {
    return cy.get("#react-burger-cross-btn");
  }

  logoutLink() {
    return cy.get("#logout_sidebar_link");
  }

  allItemsLink() {
    return cy.get("#inventory_sidebar_link");
  }

  resetAppStateLink() {
    return cy.get("#reset_sidebar_link");
  }

  aboutLink() {
    return cy.get('[data-test="about-sidebar-link"]');
  }

  openMenu() {
    this.menuButton().click();
  }

  closeMenu() {
    this.closeMenuButton().click();
  }

  logout() {
    this.openMenu();
    this.logoutLink().click();
  }
}

export default new MenuPage();
