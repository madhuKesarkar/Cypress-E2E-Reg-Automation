/// <reference types="cypress" />

describe('Subsidies Detail Page', { tags: ['@regression', '@billing'] }, () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*').as('subsidyAgencies');

    cy.visit('/billing/subsidies/all-agencies');

    cy.wait('@subsidyAgencies');

    cy.url().should('include', '/billing/subsidies/all-agencies');

    cy.contains('h1', 'Subsidies', { timeout: 30000 }).should('be.visible');
  });

  it('should navigate to agency details page from the agencies table', { tags: '@smoke' }, () => {
    cy.contains('a', /^Automation User/i, { timeout: 30000 })
      .should('be.visible')
      .invoke('text')
      .then((agencyName) => {
        const selectedAgencyName = agencyName.trim();

        cy.contains('a', selectedAgencyName).click();

        cy.url({ timeout: 30000 })
          .should('include', '/billing/subsidies/')
          .and('include', '/transactions/invoices');

        cy.contains('h1', selectedAgencyName, { timeout: 30000 }).should('be.visible');
      });

    cy.contains('Balance summary', { timeout: 30000 }).should('be.visible');
  });

  it('should validate agency transactions sections', { tags: '@smoke' }, () => {
  cy.contains('a', /^Automation User/i, { timeout: 30000 })
    .should('be.visible')
    .click();

  // Transactions tab should be selected by default
  cy.get('[data-testid="billing-nav-transactions"]', { timeout: 30000 })
    .should('be.visible')
    .and('have.attr', 'aria-current', 'page');

  // Balance summary section
  cy.contains('Balance summary', { timeout: 30000 }).should('be.visible');
  cy.contains('Agency balance').should('be.visible');
  cy.contains(/Past due invoices/i).should('be.visible');
  cy.contains(/Current invoices/i).should('be.visible');
  cy.contains('Available payments').should('be.visible');

  // Invoices section
  cy.get('[data-testid="billing-nav-invoices"]')
    .should('be.visible')
    .and('have.attr', 'aria-current', 'page');

  cy.contains(/^Invoices$/).should('be.visible');
  cy.contains('Payment status').should('be.visible');
  cy.contains(/Earliest due date/i).should('be.visible');
  cy.contains(/Latest due date/i).should('be.visible');
  cy.contains('button', /^Filter$/).should('be.visible');

  // Click Payments tab and verify payments section
  cy.get('[data-testid="billing-nav-payments"]')
    .should('be.visible')
    .click();

  cy.url({ timeout: 30000 })
    .should('include', '/transactions/payments');

  cy.get('[data-testid="billing-nav-payments"]')
    .should('have.attr', 'aria-current', 'page');

  cy.contains(/^Payments$/).should('be.visible');
  cy.contains(/Earliest post date/i).should('be.visible');
  cy.contains(/Latest post date/i).should('be.visible');
  cy.contains('button', /^Filter$/).should('be.visible');
});

it('should validate select an action menu options', { tags: '@smoke' }, () => {
  cy.contains('a', /^Automation User/i, { timeout: 30000 })
    .should('be.visible')
    .click();

  cy.contains('button', 'Select an action', { timeout: 30000 })
    .should('be.visible')
    .click();

  cy.contains('[role="menuitem"]', 'Add students', { timeout: 10000 })
    .should('exist')
    .click({ force: true });

  cy.get('button[aria-label="close modal"]', { timeout: 30000 })
    .should('exist');

  cy.contains(/Add students to/i).should('exist');
  cy.contains(/Select students who will receive funds from/i).should('exist');

  cy.contains('tr', 'ServiceFee Four', { timeout: 30000 })
    .within(() => {
      cy.get('input[type="checkbox"]')
        .check({ force: true })
        .should('be.checked');
    });

  cy.contains('button', /^Add students$/)
    .should('not.be.disabled')
    .click({ force: true });

  cy.contains(/Students successfully added to/i, { timeout: 30000 })
    .should('exist');

  // Open Select an action again
cy.contains('button', 'Select an action', { timeout: 30000 })
  .should('be.visible')
  .click();

cy.contains('[role="menuitem"]', 'Edit agency', { timeout: 10000 })
  .should('exist')
  .click({ force: true });

// Verify Agency Information form opens
cy.contains(/Agency Information/i, { timeout: 30000 })
  .should('exist');

cy.get('input[name="street_1"]', { timeout: 30000 })
  .should('exist')
  .clear({ force: true })
  .type('123 Automation Street 1', { force: true });

cy.contains('button', /^Update agency$/)
  .should('not.be.disabled')
  .click({ force: true });

cy.contains(/Agency successfully updated/i, { timeout: 30000 })
  .should('be.visible');

// Open Select an action again
cy.contains('button', 'Select an action', { timeout: 30000 })
  .should('be.visible')
  .click();

cy.contains('[role="menuitem"]', 'Delete agency', { timeout: 10000 })
  .should('exist')
  .click({ force: true });

// Validate delete confirmation modal
cy.contains(/Delete .*Automation User/i, { timeout: 30000 })
  .should('exist');

cy.contains(/Are you sure you want to delete/i)
  .should('exist');

cy.contains(/This is a permanent action/i)
  .should('exist');

// Verify No, cancel is present and actionable
cy.contains('button', 'No, cancel')
  .should('exist')
  .and('not.be.disabled');

// Verify delete button is present and actionable
cy.contains('button', 'Yes, delete this agency')
  .should('exist')
  .and('not.be.disabled')
  .click({ force: true });

// Validate success toast
cy.contains(/Agency successfully deleted/i, { timeout: 30000 })
  .should('exist');

// Validate user lands back on agencies list
cy.url({ timeout: 30000 })
  .should('include', '/billing/subsidies/all-agencies');

cy.contains('h1', 'Subsidies', { timeout: 30000 })
  .should('be.visible');

});

});