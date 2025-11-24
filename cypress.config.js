// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Add the mochawesome reporter here
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    charts: true,
    overwrite: false,
    html: false,
    json: true,
    reportFilename: "mochawesome",
    saveAllAttempts: false,
  // IMPORTANT: force JSONs to .jsons folder
    outputDir: "cypress/reports/mochawesome/.jsons"
  },

  e2e: {
    // Register the reporter plugin
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);

      // 👉 Add JUnit reporter
      on('after:spec', (spec, results) => {
        const mochaJUnit = require('mocha-junit-reporter');
      });

      return config;
    },

    baseUrl: 'https://schools.sandbox.bwtest.net',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    pageLoadTimeout: 180000,
    defaultCommandTimeout: 20000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    retries: { runMode: 2, openMode: 1 },
  },

  // recordings
  video: true,
  videosFolder: 'cypress/videos',
});
