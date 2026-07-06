/**
 * SubsidiesPage.js
 * Page Object for the Subsidies tab and all sub-pages.
 * Built from: add agency.cy.js, subsidiesDetailPage.cy.js, subsidiesTabs.cy.js
 */

class SubsidiesPage {

  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Visit the all-agencies list page directly
   */
  open() {
    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*').as('subsidyAgencies');
    cy.visit('/billing/subsidies/all-agencies');
    cy.wait('@subsidyAgencies');
    this.assertPageHeading();
    return this;
  }

  /**
   * Navigate from billing overview → click Subsidies link
   */
  openViaNav() {
    cy.intercept('GET', '**/api/v2/billing/subsidy_agencies*').as('subsidyAgencies');
    cy.visit('/billing/overview/unpaid');
    cy.contains('a', 'Subsidies', { timeout: 30000 }).click();
    cy.wait('@subsidyAgencies');
    this.assertPageHeading();
    return this;
  }

  // ── Agencies List Selectors ───────────────────────────────────────────────

  get pageHeading()         { return cy.contains('h1', 'Subsidies', { timeout: 30000 }); }
  get agencyTableRows()     { return cy.get('table tbody tr'); }
  get selectAnActionBtn()   { return cy.contains('button', 'Select an action'); }

  // Column headers
  get colAgency()           { return cy.contains('Agency'); }
  get colStudents()         { return cy.contains('Students'); }
  get colOpenInvoices()     { return cy.contains('Open invoices'); }
  get colUnpaid()           { return cy.contains('Unpaid'); }
  get colAvailablePayments(){ return cy.contains('Available payments'); }
  get colBalance()          { return cy.contains('Balance'); }
  get colActions()          { return cy.contains('Actions'); }

  // ── Add Agency Modal Selectors ────────────────────────────────────────────

  get addAgencyOption()     { return cy.contains('Add an agency'); }
  get modalHeading()        { return cy.contains('Agency Information'); }
  get closeModalBtn()       { return cy.get('button[aria-label="close modal"]'); }

  // Form fields — using exact name attributes from your spec
  get nameInput()           { return cy.get('input[name="name"]'); }
  get contactNameInput()    { return cy.get('input[name="contact_name"]'); }
  get phoneInput()          { return cy.get('input[name="phone_number"]'); }
  get emailInput()          { return cy.get('input[name="email"]'); }
  get street1Input()        { return cy.get('input[name="street_1"]'); }
  get street2Input()        { return cy.get('input[name="street_2"]'); }
  get cityInput()           { return cy.get('input[name="city"]'); }
  get stateInput()          { return cy.get('input[name="state"]'); }
  get zipInput()            { return cy.get('input[name="zip"]'); }
  get countryInput()        { return cy.get('input[name="country"]'); }
  get createAgencyBtn()     { return cy.contains('button', 'Create agency'); }
  get updateAgencyBtn()     { return cy.contains('button', /^Update agency$/); }

  // Confirmation modal
  get confirmModal()        { return cy.get('[data-testid="confirmAddAgencyModal"]', { timeout: 30000 }); }
  get addStudentsBtn()      { return cy.contains('button', 'Add students'); }
  get notRightNowBtn()      { return cy.contains('button', 'Not right now'); }

  // ── Agency Row Actions ────────────────────────────────────────────────────

  get deleteAgencyOption()  { return cy.contains('Delete agency'); }
  get viewAccountOption()   { return cy.contains(/View account/i); }

  // Delete confirmation modal
  get deleteConfirmBtn()    { return cy.contains('button', 'Yes, delete this agency'); }
  get deleteCancelBtn()     { return cy.contains('button', 'No, cancel'); }

  // ── Agency Detail Page Selectors ──────────────────────────────────────────

  get transactionsNav()     { return cy.get('[data-testid="billing-nav-transactions"]'); }
  get invoicesNav()         { return cy.get('[data-testid="billing-nav-invoices"]'); }
  get paymentsNav()         { return cy.get('[data-testid="billing-nav-payments"]'); }
  get studentsNav()         { return cy.get('[data-testid="billing-nav-students"]'); }

  get balanceSummary()      { return cy.contains('Balance summary'); }
  get agencyBalanceSection(){ return cy.contains('Agency balance'); }
  get upcomingInvoicesLink(){ return cy.contains('a', 'Upcoming invoices'); }
  get agencyInfoLink()      { return cy.contains('a', 'Agency info'); }

  // Add students modal (from detail page)
  get addStudentsMenuOption(){ return cy.contains('[role="menuitem"]', 'Add students'); }
  get editAgencyMenuOption() { return cy.contains('[role="menuitem"]', 'Edit agency'); }
  get deleteAgencyMenuOption(){ return cy.contains('[role="menuitem"]', 'Delete agency'); }

  // Students tab
  get addStudentsTabBtn()   { return cy.contains('button', 'Add students'); }
  get studentTableHeaders() { return { student: cy.contains('th', 'Student'), rooms: cy.contains('th', 'Rooms') }; }

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Click the "Select an action" dropdown on the agencies list
   */
  openSelectAnAction() {
    this.selectAnActionBtn.should('be.visible').click();
    return this;
  }

  /**
   * Click "Add an agency" from the Select an action dropdown
   */
  clickAddAnAgency() {
    this.openSelectAnAction();
    this.addAgencyOption.should('be.visible').click();
    this.modalHeading.should('be.visible');
    return this;
  }

  /**
   * Fill the full add agency form
   * @param {object} agencyData
   */
  fillAgencyForm({ name, contactName, phone, email, street1, street2, city, state, zip, country }) {
    if (name)        this.nameInput.clear().type(name);
    if (contactName) this.contactNameInput.type(contactName);
    if (phone)       this.phoneInput.type(phone);
    if (email)       this.emailInput.type(email);
    if (street1)     this.street1Input.type(street1);
    if (street2)     this.street2Input.type(street2);
    if (city)        this.cityInput.type(city);
    if (state)       this.stateInput.type(state);
    if (zip)         this.zipInput.type(zip);
    if (country)     this.countryInput.type(country);
    return this;
  }

  /**
   * Submit the create agency form and dismiss the confirmation modal
   * @param {string} agencyName - used to assert confirmation text
   */
  submitCreateAgency(agencyName) {
    this.createAgencyBtn.should('be.visible').click();
    this.confirmModal.should('be.visible');
    cy.contains(`${agencyName} has been created!`).should('be.visible');
    this.notRightNowBtn.click();
    return this;
  }

  /**
   * Click the Actions button for a specific agency row by name
   * @param {string} agencyName
   */
  openActionsForAgency(agencyName) {
    cy.contains('tr', agencyName).within(() => {
      cy.contains('button', 'Actions').should('be.visible').click();
    });
    return this;
  }

  /**
   * Click "View account" from the agency row actions menu
   * @param {string} agencyName
   */
  viewAgencyAccount(agencyName) {
    this.openActionsForAgency(agencyName);
    this.viewAccountOption.should('be.visible').click();
    return this;
  }

  /**
   * Delete an agency by name — clicks Actions → Delete → confirms
   * @param {string} agencyName
   */
  deleteAgency(agencyName) {
    this.openActionsForAgency(agencyName);
    this.deleteAgencyOption.should('be.visible').click();
    cy.contains(`Delete ${agencyName}?`).should('be.visible');
    cy.contains(`Are you sure you want to delete ${agencyName}? This is a permanent action.`).should('be.visible');
    this.deleteConfirmBtn.should('be.visible').click();
    return this;
  }

  /**
   * Click an agency link by partial name match
   * @param {RegExp|string} namePattern
   */
  clickAgencyByName(namePattern) {
    cy.contains('a', namePattern).should('be.visible').click();
    return this;
  }

  /**
   * Navigate to the Payments sub-tab on the detail page
   */
  goToPaymentsTab() {
    this.paymentsNav.should('be.visible').click();
    cy.url().should('include', '/transactions/payments');
    return this;
  }

  /**
   * Navigate to the Students sub-tab on the detail page
   */
  goToStudentsTab() {
    this.studentsNav
      .should('be.visible')
      .and('not.have.attr', 'aria-disabled', 'true')
      .click();
    cy.url().should('include', '/students');
    return this;
  }

  /**
   * Navigate to the Upcoming Invoices sub-tab on the detail page
   */
  goToUpcomingInvoices() {
    this.upcomingInvoicesLink.should('be.visible').click();
    cy.url().should('include', '/upcoming');
    return this;
  }

  /**
   * Navigate to the Agency Info sub-tab on the detail page
   */
  goToAgencyInfo() {
    this.agencyInfoLink.should('be.visible').click();
    cy.url().should('include', '/info');
    return this;
  }

  /**
   * Open the "Select an action" menu from the agency detail page
   */
  openDetailSelectAnAction() {
    cy.contains('button', 'Select an action').should('be.visible').click();
    return this;
  }

  /**
   * Update street1 on the edit agency modal
   * @param {string} street
   */
  updateStreet1(street) {
    this.street1Input.should('exist').clear().type(street);
    this.updateAgencyBtn.should('not.be.disabled').click();
    return this;
  }

  /**
   * Close the modal using the close button
   */
  closeModal() {
    this.closeModalBtn.should('be.visible').click();
    return this;
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  assertPageHeading() {
    this.pageHeading.should('be.visible');
    cy.url().should('include', '/billing/subsidies/all-agencies');
    return this;
  }

  assertColumnHeaders() {
    this.colAgency.should('be.visible');
    this.colStudents.should('be.visible');
    this.colOpenInvoices.should('be.visible');
    this.colUnpaid.should('be.visible');
    this.colAvailablePayments.should('be.visible');
    this.colBalance.should('be.visible');
    this.colActions.should('be.visible');
    return this;
  }

  assertAgencyCreated(agencyName) {
    cy.url({ timeout: 30000 })
      .should('include', '/billing/subsidies/')
      .and('include', '/transactions/invoices');
    cy.contains('h1', agencyName, { timeout: 30000 }).should('be.visible');
    return this;
  }

  assertAgencyDeleted(agencyName) {
    cy.contains('a', agencyName, { timeout: 30000 }).should('not.exist');
    return this;
  }

  assertDetailPageLoaded(agencyName) {
    cy.url()
      .should('include', '/billing/subsidies/')
      .and('include', '/transactions/invoices');
    cy.contains('h1', agencyName).should('be.visible');
    return this;
  }

  assertTransactionsTabActive() {
    this.transactionsNav
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page');
    this.balanceSummary.should('be.visible');
    return this;
  }

  assertPaymentsTabActive() {
    this.paymentsNav.should('have.attr', 'aria-current', 'page');
    cy.contains(/^Payments$/).should('be.visible');
    return this;
  }

  assertAgencySuccessfullyUpdated() {
    cy.contains(/Agency successfully updated/i).should('be.visible');
    return this;
  }

  assertAgencySuccessfullyDeleted() {
    cy.contains(/Agency successfully deleted/i).should('exist');
    this.assertPageHeading();
    return this;
  }

  assertUpcomingInvoicesLoaded() {
    cy.contains('h3', 'Upcoming invoices that will post soon').should('exist');
    cy.contains('Showing a set of upcoming invoices for each bill plan').should('exist');
    return this;
  }

  assertAgencyInfoLoaded() {
    cy.contains('Agency contact info').should('exist');
    cy.contains('Agency name').should('exist');
    cy.contains('Agency contact').should('exist');
    cy.contains('Agency email').should('exist');
    cy.contains('Phone number').should('exist');
    return this;
  }

  assertStudentsTabLoaded() {
    cy.contains('th', 'Student').should('exist');
    cy.contains('th', 'Rooms').should('exist');
    cy.contains('th', 'Open invoices').should('exist');
    cy.contains('th', 'On bill plan?').should('exist');
    return this;
  }
}

module.exports = new SubsidiesPage();