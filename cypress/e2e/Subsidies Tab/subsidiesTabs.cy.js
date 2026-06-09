/// <reference types="cypress" />

describe('Subsidies Upcoming Invoices Page', { tags: ['@regression', '@billing'] }, () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*').as('subsidyAgencies');

    cy.visit('/billing/subsidies/all-agencies');

    cy.wait('@subsidyAgencies');

    cy.contains('h1', 'Subsidies')
      .should('be.visible');
  });

  it('should validate upcoming invoices page for an agency', { tags: '@smoke' }, () => {
    cy.contains('a', /Automation/i)
      .should('be.visible')
      .click();

    cy.url()
      .should('include', '/billing/subsidies/')
      .and('include', '/transactions');

    cy.contains('a', 'Upcoming invoices')
      .should('be.visible')
      .click();

    cy.url()
      .should('include', '/upcoming');

    cy.contains('h3', 'Upcoming invoices that will post soon')
      .should('exist');

    cy.contains('Showing a set of upcoming invoices for each bill plan')
      .should('exist');

    cy.contains('button', 'Select an action')
      .should('be.visible');

    cy.contains('th', 'Student').should('exist');
    cy.contains('th', 'Invoice').should('exist');
    cy.contains('th', 'Bill plan name').should('exist');
    cy.contains('th', 'Post date').should('exist');
    cy.contains('th', 'Due date').should('exist');
    cy.contains('th', 'Amount').should('exist');
    cy.contains('th', 'Balance').should('exist');

    cy.contains(/No invoices found based on your search/i)
      .should('exist');
  });

  it('should validate agency info tab and edit agency modal', { tags: '@smoke' }, () => {
    cy.contains('a', /Automation/i)
      .should('be.visible')
      .click();

    cy.contains('a', 'Agency info')
      .should('be.visible')
      .click();

    cy.url()
      .should('include', '/info');

    cy.contains('Agency contact info')
      .should('exist');

    cy.contains('Agency name').should('exist');
    cy.contains('Agency contact').should('exist');
    cy.contains('Agency email').should('exist');
    cy.contains('Phone number').should('exist');
    cy.contains('Address line 1').should('exist');
    cy.contains('City').should('exist');
    cy.contains('State').should('exist');
    cy.contains('Zip code').should('exist');

    cy.contains('button', 'Edit agency')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.contains(/Agency Information/i)
      .should('exist');

    cy.get('input[name="street_1"]')
      .should('exist');

    cy.get('button[aria-label="close modal"]')
      .should('be.visible')
      .click();

    cy.contains(/Agency Information/i)
      .should('not.exist');
  });

  it('should validate students tab and add students modal', { tags: '@smoke' }, () => {
    let selectedAgencyName;

    cy.contains('a', /Automation/i)
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        selectedAgencyName = text.trim();

        cy.contains('a', selectedAgencyName)
          .should('be.visible')
          .click();
      });

    cy.url()
      .should('include', '/billing/subsidies/');

    cy.contains('h1', /Automation/i)
      .should('exist');

    cy.get('[data-testid="billing-nav-students"]')
      .should('be.visible')
      .and('not.have.attr', 'aria-disabled', 'true')
      .click();

    cy.url()
      .should('include', '/students');

    cy.contains('button', 'Add students')
      .should('be.visible')
      .and('be.enabled')
      .click();

    cy.contains(/^Add students to/i)
      .should('exist');

    cy.contains(/^Select students who will receive funds from/i)
      .should('exist');

    cy.get('button[aria-label="close modal"]')
      .first()
      .should('exist')
      .click({ force: true });

    cy.contains('th', 'Student').should('exist');
    cy.contains('th', 'Rooms').should('exist');
    cy.contains('th', 'Open invoices').should('exist');
    cy.contains('th', 'On bill plan?').should('exist');

    cy.contains(/^Add students to/i)
      .should('not.exist');

    cy.url()
      .should('include', '/students');
  });
});