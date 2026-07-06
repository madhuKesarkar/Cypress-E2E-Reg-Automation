/// <reference types="cypress" />

/**
 * subsidiesTabs.cy.js — refactored with SubsidiesPage POM
 */
const SubsidiesPage = require('../../pages/SubsidiesPage');

describe('Subsidies Upcoming Invoices Page', { tags: ['@regression', '@billing'] }, () => {

  beforeEach(() => {
    cy.login();
    SubsidiesPage.open();
  });

  it('should validate upcoming invoices page for an agency', { tags: '@smoke' }, () => {
    SubsidiesPage.clickAgencyByName(/Automation/i);
    cy.url().should('include', '/billing/subsidies/').and('include', '/transactions');

    SubsidiesPage.goToUpcomingInvoices();
    SubsidiesPage.assertUpcomingInvoicesLoaded();

    // Table headers
    cy.contains('th', 'Student').should('exist');
    cy.contains('th', 'Invoice').should('exist');
    cy.contains('th', 'Bill plan name').should('exist');
    cy.contains('th', 'Post date').should('exist');
    cy.contains('th', 'Due date').should('exist');
    cy.contains('th', 'Amount').should('exist');
    cy.contains('th', 'Balance').should('exist');

    cy.contains('button', 'Select an action').should('be.visible');
    cy.contains(/No invoices found based on your search/i).should('exist');
  });

  it('should validate agency info tab and edit agency modal', { tags: '@smoke' }, () => {
    SubsidiesPage.clickAgencyByName(/Automation/i);

    SubsidiesPage.goToAgencyInfo();
    SubsidiesPage.assertAgencyInfoLoaded();

    // Open edit modal and close
    cy.contains('button', 'Edit agency')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.contains(/Agency Information/i).should('exist');
    SubsidiesPage.street1Input.should('exist');

    SubsidiesPage.closeModal();
    cy.contains(/Agency Information/i).should('not.exist');
  });

  it('should validate students tab and add students modal', { tags: '@smoke' }, () => {
    // Capture agency name before clicking
    cy.contains('a', /Automation/i)
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const selectedAgencyName = text.trim();
        cy.contains('a', selectedAgencyName).should('be.visible').click();

        cy.url().should('include', '/billing/subsidies/');
        cy.contains('h1', /Automation/i).should('exist');

        SubsidiesPage.goToStudentsTab();

        // Open and close add students modal
        SubsidiesPage.addStudentsTabBtn
          .should('be.visible')
          .and('be.enabled')
          .click();

        cy.contains(/^Add students to/i).should('exist');
        cy.contains(/^Select students who will receive funds from/i).should('exist');

        SubsidiesPage.closeModalBtn.first().click({ force: true });

        SubsidiesPage.assertStudentsTabLoaded();
        cy.contains(/^Add students to/i).should('not.exist');
        cy.url().should('include', '/students');
      });
  });
});