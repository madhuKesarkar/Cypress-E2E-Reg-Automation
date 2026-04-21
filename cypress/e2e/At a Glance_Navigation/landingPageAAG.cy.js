/// <reference types="cypress" />

beforeEach(() => {
  cy.login();
  cy.visit('/billing/overview');
});

describe('At a Glance Page Tests', () => {
  it('verifies Open invoices section', () => {
    cy.contains('Open invoices as of today', { timeout: 20000 }).should('be.visible');
  });

  it('verifies last 35 days payments section', () => {
    cy.contains('Payments in last 35 days', { timeout: 20000 }).should('be.visible');
  });

  it('verifies activity last 35 days section', () => {
    cy.contains('Activity last 35 days', { timeout: 20000 }).scrollIntoView().should('be.visible');
  });

  it('navigates to Subsidies tab', () => {
    cy.visit('/billing/subsidies/all-agencies');
    cy.contains('h1', 'Subsidies', { timeout: 20000 }).should('be.visible');
  });

  it('searches for a student', () => {
    cy.get('#student').type('ServiceFee One', { force: true });
    cy.contains('button', 'Apply').click();
    cy.get('a[title="ServiceFee One"]').should('be.visible').and('have.text', 'ServiceFee One');
  });

  it('accesses Help Center link', () => {
    const href =
      'https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard';
    cy.request(href).then((res) => expect(res.status).to.eq(200));
  });
});
