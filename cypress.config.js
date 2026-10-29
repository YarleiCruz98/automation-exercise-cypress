const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 1000,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 90000,
  requestTimeout: 20000,
  responseTimeout: 30000,
  retries: { runMode: 1, openMode: 0 },
  video: true,
  screenshotOnRunFailure: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportFilename: 'index',
    reportTitle: 'Automation Exercise — Trabalho Final',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
  },
  e2e: {
    baseUrl: 'https://automationexercise.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    testIsolation: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
