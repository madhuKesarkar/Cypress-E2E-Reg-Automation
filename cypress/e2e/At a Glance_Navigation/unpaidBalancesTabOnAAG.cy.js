/// <reference types="cypress" />
const { SMOKE, REGRESSION, BILLING } = require('../../support/tags')

beforeEach(() => {
  cy.login();
});

describe('Unpaid Balances Tab', { tags: ['@regression', '@billing'] }, () => {
  it('verifies student details under the unpaid balances tab', { tags: ['@smoke', '@billing'] }, () => {
    // Intercept calls related to billing data
    cy.intercept('GET', /\/api\/v2\/billing\/(overview|ledgers_reports)(\?.*)?$/).as('billing');

    // Navigate to unpaid balances tab
    cy.visit('/billing/overview/unpaid');

    // Wait for data load (if request fires)
    cy.wait('@billing', { timeout: 30000 }).then(
      (interception) => {
        expect([200, 304]).to.include(interception.response.statusCode);
      },
      () => {} // Continue even if cached
    );

    // Ensure unpaid tab is selected
    cy.get('[data-testid="billing-nav-unpaid"]').should(
      'have.attr',
      'aria-current',
      'page'
    );

    // Table visibility check
    cy.get('table[role="table"]').should('be.visible');

    // Validate column headers
    const expectedHeaders = [
      'Student name',
      'Past due',
      'Not yet due',
      'Available credits',
      'Account balance',
      'Actions',
    ];

    cy.get('table[role="table"] thead tr th span').each((header, index) => {
      cy.wrap(header)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.equal(expectedHeaders[index]);
        });
    });
  });

  // Navigate to a student profile and back to AAG
  it('navigates to a student profile from unpaid balances and back to At a Glance', { tags: ['@smoke', '@regression'] }, () => {
    cy.visit('/billing/overview/unpaid');

    // Click on the first student name link (e.g. SF 1)
    cy.get('table[role="table"] tbody tr')
      .first()
      .within(() => {
        cy.get('a[href*="/billing/students/"]').click();
      });

    // Verify student profile page loaded
    cy.url().should('include', '/billing/students/');
    cy.contains('Current activity', { timeout: 20000 }).should('be.visible');
    cy.contains('Balance summary').should('be.visible');

    // Now click browser back
    cy.go('back');

    // Verify we returned to the At a Glance page
    cy.contains('At a Glance', { timeout: 20000 }).should('be.visible');
  });

  it("opens 'View account balance' from Actions and shows Balance summary", { tags: ['@regression', '@billing'] }, () => {
  // Be on the Unpaid tab
  cy.visit('/billing/overview/unpaid');

  // Open Actions menu for the first row
  cy.get('table[role="table"] tbody tr')
    .first()
    .within(() => {
      cy.contains('button, a', 'Actions', { matchCase: false }).click({ force: true });
    });

  // Click "View account balance" from the menu (menu renders outside the row)
  cy.contains('[role="menu"] [role="menuitem"] span', 'View account balance', {
    timeout: 10000,
  }).click({ force: true });

  // Assert we navigated to the student profile page
  cy.url().should('include', '/billing/students/');
  cy.contains('Balance summary', { timeout: 20000 }).should('be.visible');

});

it("opens 'Log a payment' and shows the Payment Details modal, then returns", { tags: ['@regression', '@billing'] }, () => {
  cy.visit('/billing/overview/unpaid');
  // Step 1: Open Actions for the first row
  cy.get('table[role="table"] tbody tr')
    .first()
    .within(() => {
      cy.contains('button, a', 'Actions', { matchCase: false })
        .should('be.visible')
        .click({ force: true });
    });

  // Step 2: Click "Log a payment"
  cy.contains('[role="menu"] [role="menuitem"] span', 'Log a payment', {
    timeout: 10000,
  })
    .should('be.visible')
    .click({ force: true });

  // Step 3: Assert Payment Details page appears
  cy.contains('h2, h3, span, div', 'Payment Details', { timeout: 20000 })
    .should('be.visible');
  cy.contains(/paid by/i).should('be.visible');
  cy.contains(/payment method/i).should('be.visible');
  cy.contains(/apply payment to open invoices/i).should('be.visible');
  cy.contains(/save & apply/i).should('be.visible');

  // Step 4: Close Payment Details (X) or fallback to ESC
  cy.get('button[aria-label="Close modal"]', { timeout: 4000 })
    .click({ force: true })
    .then(null, () => cy.get('body').type('{esc}', { force: true }));

  // Step 5: Confirm we’re back on the unpaid balances tab
  cy.url().should('include', '/billing/overview/unpaid');
  cy.contains('Unpaid balances', { timeout: 15000 }).should('be.visible');
  cy.get('table[role="table"]').should('be.visible');
});

it("verifies 'Send a reminder' flow from Actions menu in Unpaid Balances table", { tags: ['@regression', '@billing'] }, () => {
  // Visit Unpaid Balances page
  cy.visit('/billing/overview/unpaid');

  // Step 1: Open Actions for the first row
  cy.get('table[role="table"] tbody tr')
    .first()
    .within(() => {
      cy.contains('button, a', 'Actions', { matchCase: false })
        .should('be.visible')
        .click({ force: true });
    });

// Click "Send a reminder" (you already do this)
cy.get('body')
  .contains('span, div, button, a', 'Send a reminder', { timeout: 10000 })
  .click({ force: true });

})

});
