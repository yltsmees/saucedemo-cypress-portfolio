class FooterPage {
  twitterLink() {
    return cy.get(".social_twitter a");
  }

  facebookLink() {
    return cy.get(".social_facebook a");
  }

  linkedinLink() {
    return cy.get(".social_linkedin a");
  }
}

export default new FooterPage();
