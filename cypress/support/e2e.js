// Ensure custom commands load for every spec
import './commands';

// Hide automation signals so PerimeterX bot detection doesn't trigger
Cypress.on('window:before:load', (win) => {
  Object.defineProperty(win.navigator, 'webdriver', { get: () => false });
});
