// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://schools.sandbox.bwtest.net',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    // friendlier on slow/flaky networks
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
