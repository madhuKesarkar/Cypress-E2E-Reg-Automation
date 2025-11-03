// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'https://schools.sandbox.bwtest.net/billing/overview/unpaid',
//     env: {
//       redirectPath: '/sign-in?redirect_path=/',
//       video: true,  // Enable video recording
//       videosFolder: 'path/to/custom/video/folder', // Set a custom folder path
//     },
//     setupNodeEvents(on, config) {
//       // Implement node event listeners here
//     },
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Adjust for your test files
//   },
// });


// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'https://schools.sandbox.bwtest.net/billing/overview/unpaid',
//     env: {
//       username: process.env.CYPRESS_username || "madhu.kesarkar+ServicefeeAdmin@mybrightwheel.com",
//       password: process.env.CYPRESS_password || "Testing@BW123",
//       redirectPath: '/sign-in?redirect_path=/',
//       video: true,  // Enable video recording
//       videosFolder: 'path/to/custom/video/folder', // Set a custom folder path
//     },
//     setupNodeEvents(on, config) {
//       // Implement node event listeners here
//     },
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Adjust for your test files
//   },

// });

// export default {
//   e2e: {
//     baseUrl: 'https://schools.sandbox.bwtest.net', // <- match your runner env
//     experimentalSessionAndOrigin: true,            // good with cy.session
//   },
// };

// // cypress.config.js
// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   e2e: {
//     // keep baseUrl at the site root (not a deep page)
//     baseUrl: 'https://schools.sandbox.bwtest.net',
//     experimentalSessionAndOrigin: true,
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
//     supportFile: 'cypress/support/e2e.js',

//     // Defaults; real values can come from shell env vars
//     env: {
//       username: process.env.CYPRESS_username || '',
//       password: process.env.CYPRESS_password || '',
//       redirectPath: '/sign-in?redirect_path=/',   // optional helper
//     },

//     setupNodeEvents(on, config) {
//       // Ensure shell-provided env vars win if present
//       config.env.username = process.env.CYPRESS_username || config.env.username;
//       config.env.password = process.env.CYPRESS_password || config.env.password;
//       return config;
//     },
//   },

//   // These belong at the ROOT, not inside env
//   video: true,
//   videosFolder: 'cypress/videos',
// });


// cypress.config.js
// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'https://schools.sandbox.bwtest.net',
//     experimentalSessionAndOrigin: true,
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
//     supportFile: 'cypress/support/e2e.js',

//     // Optional defaults if you also pass via shell env (CYPRESS_username / CYPRESS_password)
//     env: {
//       username: process.env.CYPRESS_username || '',
//       password: process.env.CYPRESS_password || '',
//     },

//     setupNodeEvents(on, config) {
//       // Ensure shell vars override file values when provided
//       config.env.username = process.env.CYPRESS_username || config.env.username;
//       config.env.password = process.env.CYPRESS_password || config.env.password;
//       return config;
//     },
//   },

//   // recording folders/settings
//   video: true,
//   videosFolder: 'cypress/videos',
// });

// *********
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
