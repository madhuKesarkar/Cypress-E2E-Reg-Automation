/// <reference types="cypress" />

describe('Subsidies Upcoming Invoices Page', { tags: ['@regression', '@billing'] }, () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*').as('subsidyAgencies');

    cy.visit('/billing/subsidies/all-agencies');

    cy.wait('@subsidyAgencies');

    cy.contains('h1', 'Subsidies', { timeout: 30000 }).should('be.visible');
  });

  it('should validate upcoming invoices page for an agency', { tags: '@smoke' }, () => {
    cy.contains('a', /^Automation User/i, { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.url({ timeout: 30000 })
      .should('include', '/billing/subsidies/')
      .and('include', '/transactions');

    cy.contains('a', 'Upcoming invoices', { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.url({ timeout: 30000 })
      .should('include', '/upcoming');

    cy.contains('h3', 'Upcoming invoices that will post soon', { timeout: 30000 })
      .should('exist');

    cy.contains('Showing a set of upcoming invoices for each bill plan')
      .should('exist');

    cy.contains('button', 'Select an action', { timeout: 30000 })
      .should('be.visible');

    cy.contains('th', 'Student').should('exist');
    cy.contains('th', 'Invoice').should('exist');
    cy.contains('th', 'Bill plan name').should('exist');
    cy.contains('th', 'Post date').should('exist');
    cy.contains('th', 'Due date').should('exist');
    cy.contains('th', 'Amount').should('exist');
    cy.contains('th', 'Balance').should('exist');

    cy.contains(/No invoices found based on your search/i, { timeout: 30000 })
      .should('exist');
  });

  it('should validate agency info tab and edit agency modal', { tags: '@smoke' }, () => {
  cy.contains('a', /^Automation User/i, { timeout: 30000 })
    .should('be.visible')
    .click();

  cy.contains('a', 'Agency info', { timeout: 30000 })
    .should('exist')
    .click({ force: true });

  cy.url({ timeout: 30000 })
    .should('include', '/info');

  cy.contains('Agency contact info', { timeout: 30000 })
    .should('exist');

  cy.contains('Agency name').should('exist');
  cy.contains('Agency contact').should('exist');
  cy.contains('Agency email').should('exist');
  cy.contains('Phone number').should('exist');
  cy.contains('Address line 1').should('exist');
  cy.contains('City').should('exist');
  cy.contains('State').should('exist');
  cy.contains('Zip code').should('exist');

  cy.contains('button', 'Edit agency', { timeout: 30000 })
    .should('exist')
    .and('not.be.disabled')
    .click({ force: true });

  cy.contains(/Agency Information/i, { timeout: 30000 })
    .should('exist');

  cy.get('input[name="street_1"]', { timeout: 30000 })
    .should('exist');

  cy.get('button[aria-label="close modal"]', { timeout: 30000 })
    .should('exist')
    .click({ force: true });

  cy.contains(/Agency Information/i)
    .should('not.exist');
});

it('should validate students tab and add students modal', { tags: '@smoke' }, () => {
  let selectedAgencyName;

  cy.contains('a', /^Automation User/i, { timeout: 30000 })
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      selectedAgencyName = text.trim();

      cy.contains('a', selectedAgencyName)
        .click();
    });

  cy.url({ timeout: 30000 })
    .should('include', '/billing/subsidies/');

  cy.contains('h1', /^Automation User/i, { timeout: 30000 })
  .should('exist');

  cy.get('[data-testid="billing-nav-students"]', { timeout: 30000 })
  .should('exist')
  .click({ force: true });

  cy.url({ timeout: 30000 })
    .should('include', '/students');

  cy.contains('button', 'Add students', { timeout: 30000 })
    .should('exist')
    .and('not.be.disabled')
    .click({ force: true });

  cy.contains(/^Add students to/i, { timeout: 30000 })
  .should('exist');

  cy.contains(/^Select students who will receive funds from/i, { timeout: 30000 })
  .should('exist');

  cy.get('button[aria-label="close modal"]', { timeout: 30000 })
    .first()
    .click({ force: true });

  cy.contains('th', 'Student').should('exist');
  cy.contains('th', 'Rooms').should('exist');
  cy.contains('th', 'Open invoices').should('exist');
  cy.contains('th', 'On bill plan?').should('exist');

  cy.contains(/^Add students to/i, { timeout: 30000 })
  .should('not.exist');

  cy.url()
  .should('include', '/students');
});

});