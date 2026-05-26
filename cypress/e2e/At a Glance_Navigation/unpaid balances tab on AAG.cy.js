/// <reference types="cypress" />

describe('Unpaid Balances Tab', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '/api/v2/billing/ledgers_reports/**').as('billing');

    cy.visit('/billing/overview/unpaid');

    cy.wait('@billing', { timeout: 30000 });

    cy.get('table[role="table"] tbody tr', { timeout: 30000 })
      .should('have.length.greaterThan', 0);
  });

  it('verifies student details under the unpaid balances tab', () => {
    cy.get('[data-testid="billing-nav-unpaid"]').should(
      'have.attr',
      'aria-current',
      'page'
    );

    cy.get('table[role="table"]').should('be.visible');

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

  it('navigates to a student profile from unpaid balances and back to At a Glance', () => {
    cy.get('table[role="table"] tbody tr')
      .first()
      .within(() => {
        cy.get('a[href*="/billing/students/"]').click();
      });

    cy.url().should('include', '/billing/students/');
    cy.contains('Current activity', { timeout: 20000 }).should('be.visible');
    cy.contains('Balance summary').should('be.visible');

    cy.go('back');

    cy.contains('At a Glance', { timeout: 20000 }).should('be.visible');
  });

  it("opens 'View account balance' from Actions and shows Balance summary", () => {
    cy.get('table[role="table"] tbody tr')
      .first()
      .within(() => {
        cy.contains('button, a', 'Actions', { matchCase: false }).click({ force: true });
      });

    cy.contains('[role="menu"] [role="menuitem"] span', 'View account balance', {
      timeout: 10000,
    }).click({ force: true });

    cy.url().should('include', '/billing/students/');
    cy.contains('Balance summary', { timeout: 20000 }).should('be.visible');
  });

  it("opens 'Log a payment' and shows the Payment Details modal, then returns", () => {
    cy.get('table[role="table"] tbody tr')
      .first()
      .within(() => {
        cy.contains('button, a', 'Actions', { matchCase: false })
          .should('be.visible')
          .click({ force: true });
      });

    cy.contains('[role="menu"] [role="menuitem"] span', 'Log a payment', {
      timeout: 10000,
    })
      .should('be.visible')
      .click({ force: true });

    cy.contains('h2, h3, span, div', 'Payment Details', { timeout: 20000 })
      .should('be.visible');
    cy.contains(/paid by/i).should('be.visible');
    cy.contains(/payment method/i).should('be.visible');
    cy.contains(/apply payment to open invoices/i).should('be.visible');
    cy.contains(/save & apply/i).should('be.visible');

    cy.get('button[aria-label="Close modal"]', { timeout: 4000 })
      .click({ force: true })
      .then(null, () => cy.get('body').type('{esc}', { force: true }));

    cy.url().should('include', '/billing/overview/unpaid');
    cy.contains('Unpaid balances', { timeout: 15000 }).should('be.visible');
    cy.get('table[role="table"]').should('be.visible');
  });

  it("verifies 'Send a reminder' flow from Actions menu in Unpaid Balances table", () => {
    cy.get('table[role="table"] tbody tr')
      .first()
      .within(() => {
        cy.contains('button, a', 'Actions', { matchCase: false })
          .should('be.visible')
          .click({ force: true });
      });

    cy.get('body')
      .contains('span, div, button, a', 'Send a reminder', { timeout: 10000 })
      .click({ force: true });
  });
});