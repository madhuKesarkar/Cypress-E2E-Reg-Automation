// /// <reference types="cypress" />

// beforeEach(() => {
//   cy.login();
// });

// describe('Unpaid Balances Tab', () => {
//   it('verifies student details under the unpaid balances tab', () => {
//     // Intercept the actual ledgers_reports call (UUID path segment + query string)
//     cy.intercept('GET', '/api/v2/billing/ledgers_reports/**').as('billing');

//     // Navigate to unpaid balances tab
//     cy.visit('/billing/overview/unpaid');

//     // Wait for data load
//     cy.wait('@billing', { timeout: 30000 }).then((interception) => {
//       expect([200, 304]).to.include(interception.response.statusCode);
//     });

//     // Ensure unpaid tab is selected
//     cy.get('[data-testid="billing-nav-unpaid"]').should(
//       'have.attr',
//       'aria-current',
//       'page'
//     );

//     // Table visibility check — wait for at least one data row before asserting headers
//     cy.get('table[role="table"] tbody tr', { timeout: 30000 }).should('have.length.greaterThan', 0);
//     cy.get('table[role="table"]').should('be.visible');

//     // Validate column headers
//     const expectedHeaders = [
//       'Student name',
//       'Past due',
//       'Not yet due',
//       'Available credits',
//       'Account balance',
//       'Actions',
//     ];

//     cy.get('table[role="table"] thead tr th span').each((header, index) => {
//       cy.wrap(header)
//         .invoke('text')
//         .then((text) => {
//           expect(text.trim()).to.equal(expectedHeaders[index]);
//         });
//     });
//   });

//   // Navigate to a student profile and back to AAG
//   it('navigates to a student profile from unpaid balances and back to At a Glance', () => {
//     cy.intercept('GET', '/api/v2/billing/ledgers_reports/**').as('billing');
//     cy.visit('/billing/overview/unpaid');
//     cy.wait('@billing', { timeout: 30000 });
//     cy.get('table[role="table"] tbody tr', { timeout: 30000 }).should('have.length.greaterThan', 0);

//     // Click on the first student name link (e.g. SF 1)
//     cy.get('table[role="table"] tbody tr')
//       .first()
//       .within(() => {
//         cy.get('a[href*="/billing/students/"]').click();
//       });

//     // Verify student profile page loaded
//     cy.url().should('include', '/billing/students/');
//     cy.contains('Current activity', { timeout: 20000 }).should('be.visible');
//     cy.contains('Balance summary').should('be.visible');

//     // Now click browser back
//     cy.go('back');

//     // Verify we returned to the At a Glance page
//     cy.contains('At a Glance', { timeout: 20000 }).should('be.visible');
//   });

//   it("opens 'View account balance' from Actions and shows Balance summary", () => {
//   cy.intercept('GET', '/api/v2/billing/ledgers_reports/**').as('billing');
//   cy.visit('/billing/overview/unpaid');
//   cy.wait('@billing', { timeout: 30000 });
//   cy.get('table[role="table"] tbody tr', { timeout: 30000 }).should('have.length.greaterThan', 0);

//   // Open Actions menu for the first row
//   cy.get('table[role="table"] tbody tr')
//     .first()
//     .within(() => {
//       cy.contains('button, a', 'Actions', { matchCase: false }).click({ force: true });
//     });

//   // Click "View account balance" from the menu (menu renders outside the row)
//   cy.contains('[role="menu"] [role="menuitem"] span', 'View account balance', {
//     timeout: 10000,
//   }).click({ force: true });

//   // Assert we navigated to the student profile page
//   cy.url().should('include', '/billing/students/');
//   cy.contains('Balance summary', { timeout: 20000 }).should('be.visible');

// });

// it("opens 'Log a payment' and shows the Payment Details modal, then returns", () => {
//   cy.intercept('GET', '/api/v2/billing/ledgers_reports/**').as('billing');
//   cy.visit('/billing/overview/unpaid');
//   cy.wait('@billing', { timeout: 30000 });
//   cy.get('table[role="table"] tbody tr', { timeout: 30000 }).should('have.length.greaterThan', 0);

//   // Step 1: Open Actions for the first row
//   cy.get('table[role="table"] tbody tr')
//     .first()
//     .within(() => {
//       cy.contains('button, a', 'Actions', { matchCase: false })
//         .should('be.visible')
//         .click({ force: true });
//     });

//   // Step 2: Click "Log a payment"
//   cy.contains('[role="menu"] [role="menuitem"] span', 'Log a payment', {
//     timeout: 10000,
//   })
//     .should('be.visible')
//     .click({ force: true });

//   // Step 3: Assert Payment Details page appears
//   cy.contains('h2, h3, span, div', 'Payment Details', { timeout: 20000 })
//     .should('be.visible');
//   cy.contains(/paid by/i).should('be.visible');
//   cy.contains(/payment method/i).should('be.visible');
//   cy.contains(/apply payment to open invoices/i).should('be.visible');
//   cy.contains(/save & apply/i).should('be.visible');

//   // Step 4: Close Payment Details (X) or fallback to ESC
//   cy.get('button[aria-label="Close modal"]', { timeout: 4000 })
//     .click({ force: true })
//     .then(null, () => cy.get('body').type('{esc}', { force: true }));

//   // Step 5: Confirm we’re back on the unpaid balances tab
//   cy.url().should('include', '/billing/overview/unpaid');
//   cy.contains('Unpaid balances', { timeout: 15000 }).should('be.visible');
//   cy.get('table[role="table"]').should('be.visible');
// });

// it("verifies 'Send a reminder' flow from Actions menu in Unpaid Balances table", () => {
//   cy.intercept('GET', '/api/v2/billing/ledgers_reports/**').as('billing');
//   cy.visit('/billing/overview/unpaid');
//   cy.wait('@billing', { timeout: 30000 });
//   cy.get('table[role="table"] tbody tr', { timeout: 30000 }).should('have.length.greaterThan', 0);

//   // Step 1: Open Actions for the first row
//   cy.get('table[role="table"] tbody tr')
//     .first()
//     .within(() => {
//       cy.contains('button, a', 'Actions', { matchCase: false })
//         .should('be.visible')
//         .click({ force: true });
//     });

// // // Click "Send a reminder" (you already do this)
// // cy.get('body').contains('span, div, button, a', 'Send a reminder', { timeout: 10000 }).click({ force: true });
// // //cy.contains(/reminder sent/i, { timeout: 20000 }).should('be.visible');
// // // Wait for the "Send" button in the reminder modal and click it
// // cy.get('button.css-1wf08ag', { timeout: 10000 })
// //   .should('be.visible')
// //   .and('contain.text', 'Send')
// //   .click({ force: true });


// // Click "Send a reminder" (you already do this)
// cy.get('body')
//   .contains('span, div, button, a', 'Send a reminder', { timeout: 10000 })
//   .click({ force: true });

// // // Wait for the reminder modal to appear
// // cy.contains('h2, h3', 'Send a reminder', { timeout: 10000 })
// //   .should('be.visible')
// //   .closest('div[role="dialog"], section[role="dialog"]')
// //   .as('reminderModal');

// // // Within the modal, click the "Send" button
// // cy.get('@reminderModal')
// //   .find('button')
// //   .contains(/^Send$/i)
// //   .should('be.visible')
// //   .click({ force: true });

// // // Verify green toast message "Reminder sent"
// // cy.contains(/reminder sent/i, { timeout: 15000 }).should('be.visible');


// // // Wait for the modal header text (retry-aware), then get the dialog element
// // cy.contains('h2, h3, [role="heading"]', /send a reminder/i, { timeout: 20000 })
// //   .should('be.visible')
// //   .closest('div[role="dialog"], section[role="dialog"]')
// //   .as('reminderDialog');

// // // Now assert inner content/buttons inside the dialog
// // cy.get('@reminderDialog').within(() => {
// //   cy.contains(/sending a reminder will send a text or email/i).should('be.visible');
// //   cy.contains('button', /^Cancel$/).should('be.visible');
// //   cy.contains('button', /^Send$/).should('be.visible').click({ force: true });
// // });

// // // Toast: "Reminder sent"
// // cy.get('body').contains(/reminder sent/i, { timeout: 20000 }).should('be.visible');

// // // Optional: close the modal (some UIs keep it until you close)
// // cy.get('@reminderDialog').find('button[aria-label="close modal"]').click({ force: true })
// //   .then(null, () => cy.get('body').type('{esc}', { force: true }));

// // // Back to unpaid table
// // cy.get('@reminderDialog').should('not.exist');
// // cy.get('table[role="table"]', { timeout: 10000 }).should('be.visible');
// })

// });

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