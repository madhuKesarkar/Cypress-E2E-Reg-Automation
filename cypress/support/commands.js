/// <reference types="cypress" />

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
          return cy.wait(300);
        }
      }
    });

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

Cypress.Commands.add('login', () => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');

  if (!username || !password) {
    throw new Error(
      'Missing credentials. Add "username" and "password" to cypress.env.json at the project root.',
    );
  }

  // Pre-login lightweight calls
  cy.intercept('GET', '/api/v1/no_auth_flags').as('flags');
  cy.intercept('GET', '/api/v2/feature_flags/anonymous').as('anon');

  // Open sign-in page
  cy.visit('/sign-in?redirect_path=/billing/overview/unpaid', {
    timeout: 180000,
    failOnStatusCode: false,
  });

  // Wait for initial API calls
  cy.wait(['@flags', '@anon'], { timeout: 120000 });

  // Enter username
      cy.get('[data-testid="username-input"]', { timeout: 60000 })
        .should('be.visible')
    .clear()
        .type(username);

  // Enter password
      cy.get('[data-testid="password-input"]')
        .should('be.visible')
    .clear()
        .type(password, { log: false });

  // Click sign in
  cy.get('[data-testid="sign-in-button"]')
    .should('be.visible')
    .click();

  // Verify login completed
  cy.url({ timeout: 90000 }).should('not.include', '/sign-in');

  // Close modal if present
  cy.closeGettingStartedModalIfPresent();

  // Navigate to billing overview
  cy.visit('/billing/overview/unpaid', {
    timeout: 90000,
    failOnStatusCode: false,
  });

  // Final landing assertion
  cy.contains('At a Glance', { timeout: 45000 })
    .should('be.visible');

  // Close modal again if it appears later
  cy.closeGettingStartedModalIfPresent();
});

Cypress.Commands.add('openActionsMenuForRow', (rowIndex = 0) => {
  cy.get('table[role="table"] tbody tr', { timeout: 20000 })
    .should('have.length.greaterThan', 0)
    .eq(rowIndex)
    .as('row');

  cy.get('table[role="table"]').then(($table) => {
    const scrollable = $table.parents().filter((_i, el) => el.scrollWidth > el.clientWidth).first();
    if (scrollable.length) cy.wrap(scrollable).scrollTo('right', { duration: 500 });
  });

  cy.get('@row').scrollIntoView({ offset: { top: 100, left: 0 } }).within(() => {
    cy.get('td:last-child')
      .find('button, [role="button"], a')
      .contains(/^Actions$/i, { matchCase: false })
      .should('be.visible')
      .click({ force: true });
  });

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

Cypress.Commands.add('setDateField', (labelText, { mm, dd, yyyy }) => {
  cy.contains('span, label', labelText, { matchCase: false })
    .closest('div')
    .within(() => {
      cy.get('[role="spinbutton"]').eq(0).clear().type(String(mm).padStart(2, '0'));
      cy.get('[role="spinbutton"]').eq(1).clear().type(String(dd).padStart(2, '0'));
      cy.get('[role="spinbutton"]').eq(2).clear().type(String(yyyy));
    });
});
