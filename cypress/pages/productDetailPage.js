class ProductDetailPage {
  title() {
    return cy.get(".inventory_details_name");
  }

  description() {
    return cy.get(".inventory_details_desc");
  }

  price() {
    return cy.get(".inventory_details_price");
  }

  backButton() {
    return cy.get('[data-test="back-to-products"]');
  }
}

export default new ProductDetailPage();
