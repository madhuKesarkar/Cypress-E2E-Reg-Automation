// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// /// <reference types="cypress" />

// // Close the intermittent "Getting started" modal if it appears.
// // Uses a stable selector: aria-label="Close modal"

// /// <reference types="cypress" />

// // Close the intermittent "Getting started" modal if it appears
// Cypress.Commands.add('closeGettingStartedModalIfPresent', () => {
//   cy.get('body').then($body => {
//     const sel = 'button[aria-label="Close modal"]';
//     if ($body.find(sel).length) {
//       cy.log('Closing Getting Started modal');
//       cy.get(sel).click({ force: true });
//     }
//   });
// });

// // Do only AUTH here (no UI assertions)
// Cypress.Commands.add('performLogin', () => {
//   cy.visit('/');
//   cy.get('[data-testid="username-input"]').type(Cypress.env('username'));
//   cy.get('[data-testid="password-input"]').type(Cypress.env('password'), { log: false });
//   cy.get('[data-testid="sign-in-button"]').click();
//   // Optional: wait for a cookie or an auth ping to confirm login completed
//   // Adjust names to your app if you know them:
//   cy.getCookie('session').should('exist'); // or a cookie your app sets when logged in
// });


// /// <reference types="cypress" />

// // Fail-fast helper if an env var is missing/empty
// const requireEnv = (key) => {
//   const val = Cypress.env(key);
//   if (!val || typeof val !== 'string' || val.trim() === '') {
//     throw new Error(
//       `Missing Cypress env "${key}". Set it in cypress.env.json, ` +
//       `as CLI env (CYPRESS_${key}=...), or in cypress.config.js.`
//     );
//   }
//   return val;
// };

// // Dismiss the intermittent onboarding modal if present
// Cypress.Commands.add('closeGettingStartedModalIfPresent', () => {
//   const sel = 'button[aria-label="Close modal"]';
//   cy.get('body').then(($body) => {
//     if ($body.find(sel).length) {
//       cy.log('Closing Getting Started modal');
//       cy.get(sel).click({ force: true });
//     }
//   });
// });

// // Perform authentication only (no UI assertions here)
// Cypress.Commands.add('performLogin', () => {
//   const username = requireEnv('username');
//   const password = requireEnv('password');

//   cy.visit('/'); // goes to baseUrl

//   cy.get('[data-testid="username-input"]').should('exist').type(username);
//   cy.get('[data-testid="password-input"]').should('exist').type(password, { log: false });
//   cy.get('[data-testid="sign-in-button"]').click();

//   // Prove login completed (use your real cookie or an API)
//   cy.getCookie('session', { timeout: 15000 }).should('exist'); // <-- replace 'session' if different
// });
// **********
// /// <reference types="cypress" />

// // Ensure creds exist. If not in Cypress.env(), load cypress.env.json and set them.
// Cypress.Commands.add('ensureCreds', () => {
//   const u = Cypress.env('username');
//   const p = Cypress.env('password');

//   if (u && typeof u === 'string' && u.trim() && p && typeof p === 'string' && p.trim()) {
//     return cy.wrap({ username: u, password: p }, { log: false });
//   }

//   // Fallback: read from project root
//   return cy.readFile('cypress.env.json', { log: false }).then((obj) => {
//     if (!obj || !obj.username || !obj.password) {
//       throw new Error(
//         'Could not find username/password in cypress.env.json. ' +
//         'Add them there or pass via CLI (CYPRESS_username / CYPRESS_password).'
//       );
//     }
//     // Set them into runtime env so the rest of the test can use Cypress.env(...)
//     Cypress.env('username', obj.username);
//     Cypress.env('password', obj.password);
//     return { username: obj.username, password: obj.password };
//   });
// });

// // Dismiss the intermittent onboarding modal if present
// Cypress.Commands.add('closeGettingStartedModalIfPresent', () => {
//   const sel = 'button[aria-label="Close modal"]';
//   cy.get('body').then(($body) => {
//     if ($body.find(sel).length) cy.get(sel).click({ force: true });
//   });
// });

// // Perform authentication (no UI assertions here)
// Cypress.Commands.add('performLogin', () => {
//   cy.ensureCreds().then(({ username, password }) => {
//     cy.visit('/');

//     cy.get('[data-testid="username-input"]').should('exist').type(username);
//     cy.get('[data-testid="password-input"]').should('exist').type(password, { log: false });
//     cy.get('[data-testid="sign-in-button"]').click();

//     // Replace '_bw_session' with your real auth cookie once you identify it
//     cy.getCookie('_bw_session', { timeout: 15000 }).should('exist');
//   });
// });
// /// <reference types="cypress" />

// // Load creds into Cypress.env() no matter how Cypress was launched.
// const ensureCredsSync = () => {
//   const ok = k => typeof Cypress.env(k) === 'string' && Cypress.env(k).trim().length > 0;
//   if (ok('username') && ok('password')) return;

//   // Try reading from cypress.env.json (relative to this file)
//   try {
//     // support/commands.js -> project root is two levels up
//     // eslint-disable-next-line import/no-dynamic-require, global-require
//     const secrets = require('../../cypress.env.json');
//     if (secrets?.username && secrets?.password) {
//       Cypress.env('username', secrets.username);
//       Cypress.env('password', secrets.password);
//       return;
//     }
//   } catch (e) {
//     // ignore; we'll try CLI envs next
//   }

//   // Last chance: CLI envs (CYPRESS_username/password)
//   const u = Cypress.env('username');
//   const p = Cypress.env('password');
//   if (u && p) return;

//   throw new Error(
//     'Missing credentials. Create cypress.env.json with { "username": "...", "password": "..." } ' +
//     'at the project root, or pass CLI envs CYPRESS_username / CYPRESS_password.'
//   );
// };

// // Dismiss the intermittent onboarding modal if present
// Cypress.Commands.add('closeGettingStartedModalIfPresent', () => {
//   const sel = 'button[aria-label="Close modal"]';
//   cy.get('body').then($b => {
//     if ($b.find(sel).length) cy.get(sel).click({ force: true });
//   });
// });

// // Perform authentication (no UI assertions here)
// Cypress.Commands.add('performLogin', () => {
//   ensureCredsSync();
//   const username = Cypress.env('username');
//   const password = Cypress.env('password');

//   cy.visit('/');

//   cy.get('[data-testid="username-input"]').should('exist').type(username);
//   cy.get('[data-testid="password-input"]').should('exist').type(password, { log: false });
//   cy.get('[data-testid="sign-in-button"]').click();

//   // TODO: replace with your real auth cookie name after you identify it
//   cy.getCookie('_bw_session', { timeout: 15000 }).should('exist');
// });
//****************

/// <reference types="cypress" />

/**
 * Robust closer for the intermittent “Getting started” modal.
 * Polls for the close button and clicks as soon as it appears,
 * then verifies the dialog is gone. Safe if the modal never shows.
 */
Cypress.Commands.add('closeGettingStartedModalIfPresent', () => {
  const candidates = [
    'button[aria-label="Close modal"]',
    'button[aria-label*="Close"]',
    '[data-testid="multiStepModalHeader"] button',
    'section[role="dialog"] button[aria-label*="Close"]',
  ];

  const clickIfPresent = () =>
    cy.document().then((doc) => {
      for (const sel of candidates) {
        const btn = doc.querySelector(sel);
        if (btn) {
          cy.wrap(btn).click({ force: true });
          return cy.wait(300); // allow close animation
        }
      }
    });

  // Poll up to ~8s (16 x 500ms) without failing if nothing to close
  const attempts = 16;
  const loop = (n) =>
    clickIfPresent().then(() =>
      cy.document().then((doc) => {
        const stillOpen = !!doc.querySelector('section[role="dialog"]');
        if (stillOpen && n > 0) {
          cy.wait(500);
          return loop(n - 1);
        }
      }),
    );

  return loop(attempts);
});

/**
 * Log in using creds from cypress.env.json (project root).
 * After submit, waits for dashboard API, closes modal (if any),
 * and asserts the “At a Glance” landing text.
 */
Cypress.Commands.add('login', () => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');

  if (!username || !password) {
    throw new Error(
      'Missing credentials. Add "username" and "password" to cypress.env.json at the project root.',
    );
  }

  // Pre-login lightweight calls (stabilize first render)
  cy.intercept('GET', '/api/v1/no_auth_flags').as('flags');
  cy.intercept('GET', '/api/v2/feature_flags/anonymous').as('anon');

  // Hit sign-in directly and ask app to land on the billing overview
  cy.visit('/sign-in?redirect_path=/billing/overview/unpaid', {
    timeout: 180000,
    failOnStatusCode: false,
  });

  cy.wait(['@flags', '@anon'], { timeout: 120000 });

  cy.get('[data-testid="username-input"]', { timeout: 60000 })
    .should('be.visible')
    .type(username);

  cy.get('[data-testid="password-input"]')
    .should('be.visible')
    .type(password, { log: false });

  cy.get('[data-testid="sign-in-button"]').click();

  // First pass: try to close modal ASAP
  cy.closeGettingStartedModalIfPresent();

  // Wait for a definitive dashboard call to complete
  cy.intercept('GET', '/api/v1/dashboard/**').as('dashboard');
  cy.wait('@dashboard', { timeout: 90000 });

  // If app kept us on a neutral path, force the intended page
  cy.location('pathname', { timeout: 45000 }).then((p) => {
    if (p === '/' || p === '/sign-in') {
      cy.visit('/billing/overview/unpaid', { timeout: 90000 });
    }
  });

  // Late-mount safety: try to close modal again
  cy.closeGettingStartedModalIfPresent();

  // Final landing assertion
  cy.contains('At a Glance', { timeout: 45000 }).should('be.visible');
});
