/// <reference types="cypress" />

describe('Subsidies Detail Page', { tags: ['@regression', '@billing'] }, () => {
  const openAgencyDetailsPage = () => {
    cy.get('table tbody tr')
      .contains('a', /Automation/i)
      .should('be.visible')
      .invoke('text')
      .then((agencyName) => {
        const selectedAgencyName = agencyName.trim();

        cy.contains('a', selectedAgencyName)
          .should('be.visible')
          .click();

        cy.url()
          .should('include', '/billing/subsidies/')
          .and('include', '/transactions/invoices');

        cy.contains('h1', selectedAgencyName)
          .should('be.visible');
      });
  };

  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*').as('subsidyAgencies');

    cy.visit('/billing/subsidies/all-agencies');

    cy.wait('@subsidyAgencies');

    cy.url().should('include', '/billing/subsidies/all-agencies');

    cy.contains('h1', 'Subsidies')
      .should('be.visible');
  });

  it('should navigate to agency details page from the agencies table', { tags: '@smoke' }, () => {
    openAgencyDetailsPage();

    cy.contains('Balance summary')
      .should('be.visible');
  });

  it('should validate agency transactions sections', { tags: '@smoke' }, () => {
    openAgencyDetailsPage();

    cy.get('[data-testid="billing-nav-transactions"]')
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page');

    cy.contains('Balance summary').should('be.visible');
    cy.contains('Agency balance').should('be.visible');
    cy.contains(/Past due invoices/i).should('be.visible');
    cy.contains(/Current invoices/i).should('be.visible');
    cy.contains('Available payments').should('be.visible');

    cy.get('[data-testid="billing-nav-invoices"]')
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page');

    cy.contains(/^Invoices$/).should('be.visible');
    cy.contains('Payment status').should('be.visible');
    cy.contains(/Earliest due date/i).should('be.visible');
    cy.contains(/Latest due date/i).should('be.visible');
    cy.contains('button', /^Filter$/).should('be.visible');

    cy.get('[data-testid="billing-nav-payments"]')
      .should('be.visible')
      .click();

    cy.url().should('include', '/transactions/payments');

    cy.get('[data-testid="billing-nav-payments"]')
      .should('have.attr', 'aria-current', 'page');

    cy.contains(/^Payments$/).should('be.visible');
    cy.contains(/Earliest post date/i).should('be.visible');
    cy.contains(/Latest post date/i).should('be.visible');
    cy.contains('button', /^Filter$/).should('be.visible');
  });

  it('should validate select an action menu options', { tags: '@smoke' }, () => {
    openAgencyDetailsPage();

    cy.contains('button', 'Select an action')
      .should('be.visible')
      .click();

    cy.contains('[role="menuitem"]', 'Add students')
      .should('be.visible')
      .click();

    cy.get('button[aria-label="close modal"]')
      .should('exist');

    cy.contains(/Add students to/i).should('exist');
    cy.contains(/Select students who will receive funds from/i).should('exist');

    cy.contains('tr', 'ServiceFee Four')
      .should('exist')
      .within(() => {
        cy.get('input[type="checkbox"]')
          .should('exist')
          .check({ force: true })
          .should('be.checked');
      });

    cy.contains('button', /^Add students$/)
      .should('not.be.disabled')
      .click({ force: true });

    cy.contains(/Students successfully added to/i)
      .should('exist');

    cy.contains('button', 'Select an action')
      .should('be.visible')
      .click();

    cy.contains('[role="menuitem"]', 'Edit agency')
      .should('be.visible')
      .click();

    cy.contains(/Agency Information/i)
      .should('exist');

    cy.get('input[name="street_1"]')
      .should('exist')
      .clear()
      .type('123 Automation Street 1');

    cy.contains('button', /^Update agency$/)
      .should('not.be.disabled')
      .click();

    cy.contains(/Agency successfully updated/i)
      .should('be.visible');

    cy.contains('button', 'Select an action')
      .should('be.visible')
      .click();

    cy.contains('[role="menuitem"]', 'Delete agency')
      .should('be.visible')
      .click();

    cy.contains(/Delete .*Automation/i)
      .should('exist');

    cy.contains(/Are you sure you want to delete/i)
      .should('exist');

    cy.contains(/This is a permanent action/i)
      .should('exist');

    cy.contains('button', 'No, cancel')
      .should('exist')
      .and('not.be.disabled');

    cy.contains('button', 'Yes, delete this agency')
      .should('exist')
      .and('not.be.disabled')
      .click();

    cy.contains(/Agency successfully deleted/i)
      .should('exist');

    cy.url()
      .should('include', '/billing/subsidies/all-agencies');

    cy.contains('h1', 'Subsidies')
      .should('be.visible');
  });
});