/**
 * AtAGlancePage.js
 * Page Object for the At a Glance section and all sub-tabs.
 * Built from: landingPageAAG.cy.js, recentPaymentsTabOnAAG.cy.js,
 *             unpaidBalancesTabOnAAG.cy.js, upcomingInvoicesTab.cy.js
 *
 * NOTE: setDateField → use cy.setDateField() from commands.js
 *       openActionsForRow → use cy.openActionsMenuForRow() from commands.js
 *       clickActionsMenuItem → use cy.clickActionsMenuItem() from commands.js
 */

class AtAGlancePage {

  // ── Navigation ────────────────────────────────────────────────────────────

  open() {
    cy.visit('/billing/overview');
    return this;
  }

  openUnpaidBalances() {
    cy.visit('/billing/overview/unpaid');
    return this;
  }

  openRecentPayments() {
    cy.visit('/billing/overview/payments');
    return this;
  }

  // ── Landing Page Selectors ────────────────────────────────────────────────

  get openInvoicesSection()   { return cy.contains('Open invoices as of today', { timeout: Cypress.config('responseTimeout') }); }
  get paymentsSection()       { return cy.contains('Payments in last 35 days', { timeout: Cypress.config('responseTimeout') }); }
  get activitySection()      { return cy.contains('h2', 'Activity last 35 days', { timeout: Cypress.config('responseTimeout') }); }
  get studentSearchInput()    { return cy.get('#student'); }
  get applySearchBtn()        { return cy.contains('button', 'Apply'); }

  // ── Unpaid Balances Tab Selectors ─────────────────────────────────────────

  get unpaidBalancesNav()     { return cy.get('[data-testid="billing-nav-unpaid"]'); }
  get unpaidTable()           { return cy.get('table[role="table"]', { timeout: Cypress.config('responseTimeout') }); }
  get unpaidTableRows()       { return cy.get('table[role="table"] tbody tr'); }
  get unpaidTableHeaders()    { return cy.get('table[role="table"] thead tr th span'); }

  // Payment Details modal
  get paymentDetailsModal()   { return cy.contains('h2, h3, span, div', 'Payment Details', { timeout: Cypress.config('responseTimeout') }); }

  // ── Recent Payments Tab Selectors ─────────────────────────────────────────

  get recentPaymentsNav()     { return cy.contains('Recent payments', { timeout: Cypress.config('responseTimeout') }); }
  get studentSearchPayments() { return cy.get('input[placeholder="Search students"]', { timeout: Cypress.config('responseTimeout') }); }
  get recentPaymentsTable()   { return cy.get('table[role="table"]'); }
  get recentPaymentsRows()    { return cy.get('table[role="table"] tbody tr'); }
  get tableAriaLive()         { return cy.get('[aria-live="assertive"]', { timeout: Cypress.config('responseTimeout') }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  searchStudent(studentName) {
    this.studentSearchInput.type(studentName, { force: true });
    this.applySearchBtn.click();
    return this;
  }

  /**
   * Close the Payment Details modal safely.
   * Checks DOM first — avoids the unsupported .then(null, onRejected) pattern.
   */
  closePaymentModal() {
    cy.get('body').then(($body) => {
      if ($body.find('button[aria-label="Close modal"]').length) {
        cy.get('button[aria-label="Close modal"]').click({ force: true });
      } else {
        cy.get('body').type('{esc}', { force: true });
      }
    });
    return this;
  }

  searchRecentPaymentsStudent(studentName) {
    this.studentSearchPayments
      .should('be.visible')
      .clear()
      .type(studentName, { delay: 0 });
    return this;
  }

  /**
   * Click Apply and wait for the payments report API and table rows.
   * Handles 204 (no content) by retrying Apply once.
   */
  applyAndWaitForRows() {
    cy.intercept('**/api/v2/billing/payments_reports**').as('payments');
    cy.contains('button', /^Apply$/).should('be.enabled').click();

    cy.wait('@payments', { timeout: Cypress.config('responseTimeout') })
      .then((res) => {
        if (res.response && res.response.statusCode === 204) {
          cy.contains('button', /^Apply$/).click();
          return cy.wait('@payments', { timeout: Cypress.config('responseTimeout') });
        }
        return res;
      })
      .its('response.statusCode')
      .should('be.oneOf', [200, 204]);

    this.tableAriaLive.should('have.attr', 'aria-busy', 'false');
    this.recentPaymentsRows.should('have.length.at.least', 1);
    return this;
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  assertLandingPageLoaded() {
    this.openInvoicesSection.should('be.visible');
    return this;
  }

  assertUnpaidBalancesTabActive() {
    this.unpaidBalancesNav.should('have.attr', 'aria-current', 'page');
    return this;
  }

  assertUnpaidTableVisible() {
    this.unpaidTable.should('be.visible');
    this.unpaidTableRows.should('have.length.greaterThan', 0);
    return this;
  }

  assertUnpaidTableHeaders() {
    const expectedHeaders = [
      'Student name',
      'Past due',
      'Not yet due',
      'Available credits',
      'Account balance',
      'Actions',
    ];
    this.unpaidTableHeaders.each((header, index) => {
      cy.wrap(header).invoke('text').then((text) => {
        expect(text.trim()).to.equal(expectedHeaders[index]);
      });
    });
    return this;
  }

  assertStudentProfileLoaded() {
    cy.url({ timeout: Cypress.config('responseTimeout') }).should('include', '/billing/students/');
    cy.contains('Current activity', { timeout: Cypress.config('responseTimeout') }).should('be.visible');
    cy.contains('Balance summary').should('be.visible');
    return this;
  }

  assertBackOnUnpaidBalances() {
    cy.contains('At a Glance', { timeout: Cypress.config('responseTimeout') }).should('be.visible');
    return this;
  }

  assertBalanceSummaryVisible() {
    cy.url({ timeout: Cypress.config('responseTimeout') }).should('include', '/billing/students/');
    cy.contains('Balance summary', { timeout: Cypress.config('responseTimeout') }).should('be.visible');
    return this;
  }

  assertPaymentDetailsModalVisible() {
    this.paymentDetailsModal.should('be.visible');
    cy.contains(/paid by/i).should('be.visible');
    cy.contains(/payment method/i).should('be.visible');
    cy.contains(/apply payment to open invoices/i).should('be.visible');
    cy.contains(/save & apply/i).should('be.visible');
    return this;
  }

  assertBackOnUnpaidPage() {
    cy.url({ timeout: Cypress.config('responseTimeout') }).should('include', '/billing/overview/unpaid');
    cy.contains('Unpaid balances', { timeout: Cypress.config('responseTimeout') }).should('be.visible');
    this.unpaidTable.should('be.visible');
    return this;
  }

  assertRecentPaymentsTabActive() {
    this.recentPaymentsNav.should('have.attr', 'aria-current', 'page');
    return this;
  }

  assertStudentInRecentPaymentsTable(studentName) {
    this.recentPaymentsTable.within(() => {
      cy.contains('td, a, span', studentName, { matchCase: false }).should('be.visible');
    });
    return this;
  }

  assertOpenInvoicesVisible() {
    this.openInvoicesSection.should('be.visible');
    return this;
  }
}

module.exports = new AtAGlancePage();