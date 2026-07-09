/// <reference types="cypress" />

/**
 * landingPageAAG.cy.js — refactored with AtAGlancePage POM
 */

const AtAGlancePage = require('../../pages/AtAGlancePage');

describe('At a Glance Page Tests', () => {

  beforeEach(() => {
    cy.login();
    AtAGlancePage.open();
  });

  it('verifies Open invoices section', () => {
    AtAGlancePage.assertOpenInvoicesVisible();
  });

  it('verifies last 35 days payments section', () => {
    AtAGlancePage.paymentsSection.should('be.visible');
  });

  // it('verifies Spotlight section', () => {
  //   AtAGlancePage.spotlightSection.should('be.visible');
  // });

  it('verifies Activity last 35 days section', () => {
  AtAGlancePage.activitySection.should('be.visible');
  });

  it('navigates to Subsidies tab', () => {
    cy.visit('/billing/subsidies/all-agencies');
    cy.contains('h1', 'Subsidies', { timeout: Cypress.config('responseTimeout') }).should('be.visible');
  });

  it('searches for a student', () => {
    AtAGlancePage.searchStudent('ServiceFee One');
    cy.get('a[title="ServiceFee One"]')
      .should('be.visible')
      .and('have.text', 'ServiceFee One');
  });

  it('accesses Help Center link', () => {
    const href = 'https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard';
    cy.request(href).then((res) => expect(res.status).to.eq(200));
  });
});