/// <reference types="cypress" />

/**
 * subsidiesDetailPage.cy.js — refactored with SubsidiesPage POM
 */
const SubsidiesPage = require('../../pages/SubsidiesPage');

describe('Subsidies Detail Page', { tags: ['@regression', '@billing'] }, () => {

  /**
   * Helper: clicks the first agency whose name contains "Automation"
   * and returns the agency name for further assertions.
   */
  const openAutomationAgency = () => {
    cy.get('table tbody tr')
      .contains('a', /Automation/i)
      .should('be.visible')
      .invoke('text')
      .then((agencyName) => {
        const name = agencyName.trim();
        cy.contains('a', name).should('be.visible').click();
        SubsidiesPage.assertDetailPageLoaded(name);
      });
  };

  beforeEach(() => {
    cy.login();
    SubsidiesPage.open();
  });

  it('should navigate to agency details page from the agencies table', { tags: '@smoke' }, () => {
    openAutomationAgency();
    SubsidiesPage.balanceSummary.should('be.visible');
  });

  it('should validate agency transactions sections', { tags: '@smoke' }, () => {
    openAutomationAgency();

    // Transactions tab assertions
    SubsidiesPage.assertTransactionsTabActive();
    SubsidiesPage.agencyBalanceSection.should('be.visible');
    cy.contains(/Past due invoices/i).should('be.visible');
    cy.contains(/Current invoices/i).should('be.visible');
    cy.contains('Available payments').should('be.visible');

    // Invoices section
    SubsidiesPage.invoicesNav
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page');
    cy.contains(/^Invoices$/).should('be.visible');
    cy.contains('Payment status').should('be.visible');
    cy.contains(/Earliest due date/i).should('be.visible');
    cy.contains(/Latest due date/i).should('be.visible');
    cy.contains('button', /^Filter$/).should('be.visible');

    // Navigate to Payments tab
    SubsidiesPage.goToPaymentsTab();
    SubsidiesPage.assertPaymentsTabActive();
    cy.contains(/Earliest post date/i).should('be.visible');
    cy.contains(/Latest post date/i).should('be.visible');
    cy.contains('button', /^Filter$/).should('be.visible');
  });

  it('should validate select an action menu options', { tags: '@smoke' }, () => {
    openAutomationAgency();

    // Add students flow
    SubsidiesPage.openDetailSelectAnAction();
    SubsidiesPage.addStudentsMenuOption.should('be.visible').click();
    SubsidiesPage.closeModalBtn.should('exist');
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
    cy.contains(/Students successfully added to/i).should('exist');

    // Edit agency flow
    SubsidiesPage.openDetailSelectAnAction();
    SubsidiesPage.editAgencyMenuOption.should('be.visible').click();
    cy.contains(/Agency Information/i).should('exist');
    SubsidiesPage.updateStreet1('123 Automation Street 1');
    SubsidiesPage.assertAgencySuccessfullyUpdated();

    // Delete agency flow
    SubsidiesPage.openDetailSelectAnAction();
    SubsidiesPage.deleteAgencyMenuOption.should('be.visible').click();
    cy.contains(/Delete .*Automation/i).should('exist');
    cy.contains(/Are you sure you want to delete/i).should('exist');
    cy.contains(/This is a permanent action/i).should('exist');
    SubsidiesPage.deleteCancelBtn.should('exist').and('not.be.disabled');
    SubsidiesPage.deleteConfirmBtn.should('exist').and('not.be.disabled').click();
    SubsidiesPage.assertAgencySuccessfullyDeleted();
  });
});