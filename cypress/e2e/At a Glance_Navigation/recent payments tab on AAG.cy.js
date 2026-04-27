/// <reference types="cypress" />

beforeEach(() => {
  cy.login();
});

/** commit M/D/YY to the 3 spinbuttons under a labeled date field */
const setSpinDate = (label, mm, dd, yy2) => {
  cy.contains('label', label).parent().within(() => {
    cy.get('[role="spinbutton"]').eq(0).clear().type(mm).type('{enter}').blur(); // month
    cy.get('[role="spinbutton"]').eq(1).clear().type(dd).type('{enter}').blur(); // day
    cy.get('[role="spinbutton"]').eq(2).clear().type(yy2).type('{enter}').blur(); // 2-digit year
  });
  // close any popover so Apply is clickable
  cy.get('body').click(0, 0);
};

/** click Apply, wait for the report call and for UI to finish rendering */
const applyAndWaitForRows = () => {
  cy.intercept('**/api/v2/billing/payments_reports**').as('payments');
  cy.contains('button', /^Apply$/).should('be.enabled').click();

  // if backend returns 204 first, click Apply once more
  cy.wait('@payments', { timeout: 30000 }).then((res) => {
    if (res.response && res.response.statusCode === 204) {
      cy.contains('button', /^Apply$/).click();
      return cy.wait('@payments', { timeout: 30000 });
    }
    return res;
  }).its('response.statusCode').should('be.oneOf', [200, 204]);

  // wait until the table says it’s not busy and rows are present
  cy.get('[aria-live="assertive"]', { timeout: 20000 })
    .should('have.attr', 'aria-busy', 'false');

  cy.get('table[role="table"] tbody tr', { timeout: 30000 })
    .should('have.length.at.least', 1);
};

describe('Recent payments – search & date filters', () => {
  it('shows rows for the student within the date range', () => {
    const student = 'ServiceFee Four'; // ✅ exists in your env

    cy.visit('/billing/overview/payments');
    cy.contains('Recent payments', { timeout: 20000 })
      .should('have.attr', 'aria-current', 'page');

    // 1) Set the date range first and commit values
    cy.setDateField('Earliest post date', { mm: 11, dd: 11, yyyy: 2024 });
    cy.setDateField('Latest post date',   { mm: 11, dd: 11, yyyy: 2025 });

    // setSpinDate('Earliest post date', '11', '01', '24'); // 01/11/2024
    // setSpinDate('Latest post date',   '11', '14', '25'); // 11/14/2025

    // 2) Now type the student (table re-render won’t wipe it)
    cy.get('input[placeholder="Search students"]', { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type(student, { delay: 0 });

    // 3) Apply and wait for data to render
    applyAndWaitForRows();

    // 4) Assertions
    cy.get('table[role="table"]').within(() => {
      cy.contains('td, a, span', student, { matchCase: false }).should('be.visible');
    });
  });
});
