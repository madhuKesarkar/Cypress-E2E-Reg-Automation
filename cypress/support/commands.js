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

// Cypress.Commands.add('login', () => {
//   // If we’re already in the app, don’t try to open the sign-in page again.
//   cy.location('pathname', { timeout: 15000 }).then((p) => {
//     if (p.startsWith('/billing')) return; // already authed/session cached
//     // …otherwise do your real login…
//     cy.visit('/sign-in');
//     cy.get('[data-testid="username-input"]').type(Cypress.env('username'));
//     cy.get('[data-testid="password-input"]').type(Cypress.env('password'), { log: false });
//     cy.get('[data-testid="sign-in-button"]').click();
//   });

//   // Land on AAG to stabilize
//   cy.visit('/billing/overview/payments', { timeout: 60000 });
//   cy.contains('Recent payments', { timeout: 30000 }).should('have.attr', 'aria-current', 'page');
// });

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

Cypress.Commands.add('openActionsMenuForRow', (rowIndex = 0) => {
  // Wait until the table and rows are visible
  cy.get('table[role="table"] tbody tr', { timeout: 20000 })
    .should('have.length.greaterThan', 0)
    .eq(rowIndex)
    .as('row');

  // Scroll horizontally if the Actions column is clipped
  cy.get('table[role="table"]').then(($table) => {
    const scrollable = $table.parents().filter((i, el) => el.scrollWidth > el.clientWidth).first();
    if (scrollable.length) cy.wrap(scrollable).scrollTo('right', { duration: 500 });
  });

  // Scroll the row into view and find the Actions button in its last cell
  cy.get('@row').scrollIntoView({ offset: { top: 100, left: 0 } }).within(() => {
    cy.get('td:last-child')
      .find('button, [role="button"], a')
      .contains(/^Actions$/i, { matchCase: false })
      .should('be.visible')
      .click({ force: true });
  });

  // Confirm the popover actually opened (portal-safe)
  cy.get('body', { timeout: 8000 }).should(($body) => {
    const found =
      $body.find('[role="menu"]').length > 0 ||
      $body.find('span,div,button,a').filter((_, el) => {
        const t = (el.textContent || '').trim();
        return ['View account balance', 'Log a payment', 'Send a reminder'].includes(t);
      }).length > 0;
    expect(found, 'Actions menu opened').to.be.true;
  });
});

Cypress.Commands.add('clickActionsMenuItem', (label) => {
  cy.contains('body span, body div, body button, body a, [role="menuitem"]', label, {
    timeout: 10000,
    matchCase: false,
  }).should('be.visible').click({ force: true });
});

/**
 * Fill a React-Aria DateField by label, e.g. "Earliest post date" or "Latest post date".
 * mm, dd, yyyy are numbers.
 */
Cypress.Commands.add('setDateField', (labelText, { mm, dd, yyyy }) => {
  // Find the DateField by its visible label
  cy.contains('span, label', labelText, { matchCase: false })
    .closest('div')                      // container that holds the date segments
    .within(() => {
      // React-Aria date segments are spinbuttons in order: MM, DD, YYYY
      cy.get('[role="spinbutton"]').eq(0).clear().type(String(mm).padStart(2, '0'));
      cy.get('[role="spinbutton"]').eq(1).clear().type(String(dd).padStart(2, '0'));
      cy.get('[role="spinbutton"]').eq(2).clear().type(String(yyyy));
    });
});
});
