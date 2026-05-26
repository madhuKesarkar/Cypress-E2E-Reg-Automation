/// <reference types="cypress" />

describe("Verify if the user is able to add an agency from the 'Subsidies' tab", () => {
  let agencyName;

  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*')
      .as('subsidyAgencies');

    cy.visit('/billing/overview/unpaid');

    cy.contains('a', 'Subsidies', { timeout: 30000 })
      .click();

    cy.wait('@subsidyAgencies');

    cy.url()
      .should('include', '/billing/subsidies/all-agencies');

    cy.contains('h1', 'Subsidies', { timeout: 30000 })
      .should('be.visible');
  });

  it('should display the Subsidies tab with the agencies table', () => {
    cy.contains('Agency').should('be.visible');
    cy.contains('Students').should('be.visible');
    cy.contains('Open invoices').should('be.visible');
    cy.contains('Unpaid').should('be.visible');
    cy.contains('Available payments').should('be.visible');
    cy.contains('Balance').should('be.visible');
    cy.contains('Actions').should('be.visible');
  });

  it('should allow the user to add a new agency from the Subsidies tab', () => {
    agencyName = `Automation User ${Date.now()}`;

    cy.contains('button', 'Select an action')
      .should('be.visible')
      .click();

    cy.contains('Add an agency')
      .should('be.visible')
      .click();

    cy.contains('Agency Information')
      .should('be.visible');

    cy.get('button[aria-label="close modal"]')
      .should('be.visible');

    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="contact_name"]').should('be.visible');
    cy.get('input[name="phone_number"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="street_1"]').should('be.visible');
    cy.get('input[name="street_2"]').should('be.visible');
    cy.get('input[name="city"]').should('be.visible');
    cy.get('input[name="state"]').should('be.visible');
    cy.get('input[name="zip"]').should('be.visible');
    cy.get('input[name="country"]').should('be.visible');

    cy.get('input[name="name"]')
      .clear()
      .type(agencyName);

    cy.get('input[name="contact_name"]').type('Automation Contact');
    cy.get('input[name="phone_number"]').type('9876543210');
    cy.get('input[name="email"]').type('automation@test.com');
    cy.get('input[name="street_1"]').type('123 Automation Street');
    cy.get('input[name="street_2"]').type('Suite 100');
    cy.get('input[name="city"]').type('San Francisco');
    cy.get('input[name="state"]').type('California');
    cy.get('input[name="zip"]').type('94105');
    cy.get('input[name="country"]').type('USA');

    cy.contains('button', 'Create agency')
      .should('be.visible')
      .click();

    cy.get('[data-testid="confirmAddAgencyModal"]', { timeout: 30000 })
      .should('be.visible');

    cy.contains(`${agencyName} has been created!`)
      .should('be.visible');

    cy.contains(`Add students to ${agencyName}!`)
      .should('be.visible');

    cy.contains('Adding students now will make it faster')
      .should('be.visible');

    cy.contains('button', 'Add students')
      .should('be.visible');

    cy.contains('button', 'Not right now')
      .should('be.visible')
      .click();

    cy.url({ timeout: 30000 })
      .should('include', '/billing/subsidies/')
      .and('include', '/transactions/invoices');

    cy.contains('a', 'Subsidies')
      .should('be.visible');

    cy.contains('h1', agencyName, { timeout: 30000 })
      .should('be.visible');

    cy.contains('Agency')
      .should('be.visible');
  });

  it('should validate existing agency view and delete flow', () => {
    cy.wrap(null).then(() => {
      expect(agencyName, 'agency name from previous test').to.exist;
    });

    cy.contains('a', agencyName, { timeout: 30000 })
      .should('be.visible');

    cy.contains('tr', agencyName)
      .within(() => {
        cy.contains('button', 'Actions')
          .should('be.visible')
          .click();
      });

    cy.contains(/View account/i)
      .should('be.visible')
      .click();

    cy.url({ timeout: 30000 })
      .should('include', '/billing/subsidies/')
      .and('include', '/transactions/invoices');

    cy.contains('h1', agencyName, { timeout: 30000 })
      .should('be.visible');

    cy.contains('a', 'Subsidies')
      .should('be.visible')
      .click();

    cy.url({ timeout: 30000 })
      .should('include', '/billing/subsidies/all-agencies');

    cy.contains('h1', 'Subsidies', { timeout: 30000 })
      .should('be.visible');

    cy.contains('a', agencyName, { timeout: 30000 })
      .should('be.visible');

    cy.contains('tr', agencyName)
      .within(() => {
        cy.contains('button', 'Actions')
          .should('be.visible')
          .click();
      });

    cy.contains('Delete agency')
      .should('be.visible')
      .click();

    cy.contains(`Delete ${agencyName}?`)
      .should('be.visible');

    cy.contains(`Are you sure you want to delete ${agencyName}? This is a permanent action.`)
      .should('be.visible');

    cy.contains('button', 'No, cancel')
      .should('be.visible');

    cy.contains('button', 'Yes, delete this agency')
      .should('be.visible')
      .click();

    cy.contains('a', agencyName, { timeout: 30000 })
      .should('not.exist');
  });
});