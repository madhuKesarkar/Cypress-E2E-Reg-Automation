/// <reference types="cypress" />

beforeEach(() => {
  cy.login();
});

describe('upcoming invoices Tab', () => {
  it('verifies Open invoices section', () => {
    cy.contains('Open invoices as of today', { timeout: 20000 }).should('be.visible');
  });
});