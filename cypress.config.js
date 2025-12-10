// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",

    // Keep timeouts reasonable, so tests rely on proper waits
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,

    video: false,
    screenshotOnRunFailure: false,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      // Node event listeners can be added here if needed later
      return config;
    },
  },
});
