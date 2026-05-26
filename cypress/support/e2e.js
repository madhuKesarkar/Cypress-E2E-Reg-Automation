// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// 
// Ensure custom commands load for every spec
import './commands';

// Hide automation signals so PerimeterX bot detection doesn't trigger
Cypress.on('window:before:load', (win) => {
  Object.defineProperty(win.navigator, 'webdriver', { get: () => false });
});
