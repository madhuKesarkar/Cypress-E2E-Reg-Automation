// /// <reference types="cypress" />

// // Login once and reuse session
// Cypress.Commands.add('login', () => {
//   cy.visit('/');
//   cy.get('[data-testid="username-input"]').type(Cypress.env('username'));
//   cy.get('[data-testid="password-input"]').type(Cypress.env('password'));
//   cy.get('[data-testid="sign-in-button"]').click();
//   cy.contains('At a Glance', { timeout: 10000 }).should('be.visible');
// });

// beforeEach(() => {
//   cy.session('login', cy.login);
//   cy.visit('/');
// });

// // Test cases
// describe('unpaid balances tab', () => {
//   it('verifies students details under unpaid balance tab', () => {
//     cy.visit('/billing/overview/unpaid');

//     // Assert that the "Unpaid balances" tab is selected
//     cy.get('[data-testid="billing-nav-unpaid"]')
//       .should('have.attr', 'aria-current', 'page');

//     // Define the expected headers
//     const expectedHeaders = [
//       'Student name',
//       'Past due',
//       'Not yet due',
//       'Available credits',
//       'Account balance',
//       'Actions'
//     ];

//     // Get all column headers and validate their text content
//     cy.get('table[role="table"] thead tr th span')
//       .each((header, index) => {
//         cy.wrap(header).should('have.text', expectedHeaders[index]);
//       });
//   });

//   });

// /// <reference types="cypress" />

// // Login once and reuse session
// Cypress.Commands.add('login', () => {
//   cy.visit('/');
//   cy.get('[data-testid="username-input"]').type(Cypress.env('username'));
//   cy.get('[data-testid="password-input"]').type(Cypress.env('password'), { log: false });
//   cy.get('[data-testid="sign-in-button"]').click();
//   cy.contains('At a Glance', { timeout: 10000 }).should('be.visible');
// });

// // Preserve session for each test
// beforeEach(() => {
//   cy.session('loginSession', () => {
//     cy.login();
//   });
// });

// // Test cases
// describe('Unpaid Balances Tab', () => {
//   it('verifies student details under the unpaid balances tab', () => {
//     // // Navigate to the unpaid balances tab
//     // cy.visit('/billing/overview/unpaid');

//     // // Assert that the "Unpaid balances" tab is selected
//     // cy.get('[data-testid="billing-nav-unpaid"]')
//     //   .should('have.attr', 'aria-current', 'page');

//     // // Wait for the table to be present in the DOM
//     // cy.get('table[role="table"]', { timeout: 10000 }).should('exist');

//     // // Define the expected headers
//     // const expectedHeaders = [
//     //   'Student name',
//     //   'Past due',
//     //   'Not yet due',
//     //   'Available credits',
//     //   'Account balance',
//     //   'Actions'
//     // ];

//     // // Get all column headers and validate their text content
//     // cy.get('table[role="table"] thead tr th span').should('have.length', expectedHeaders.length); // Validate the correct number of headers
//     // cy.get('table[role="table"] thead tr th span').each((header, index) => {
//     //   cy.wrap(header)
//     //     .scrollIntoView() // Ensure the element is in focus
//     //     .should('be.visible') // Verify it is visible
//     //     .invoke('text') // Extract the text
//     //     .then((text) => {
//     //       expect(text.trim()).to.equal(expectedHeaders[index]); // Validate the text matches the expected value
//     //     });

//     // Wait for API response
//     cy.intercept('/api/v2/billing/overview').as('getBillingData');
//     cy.visit('/billing/overview/unpaid');
//     cy.wait('@getBillingData');

//     // Ensure the unpaid balances tab is selected
//     cy.get('[data-testid="billing-nav-unpaid"]')
//       .should('have.attr', 'aria-current', 'page');

//     // Check for the table
//     cy.get('table[role="table"]', { timeout: 10000 })
//       .scrollIntoView()
//       .should('exist')
//       .should('be.visible');

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
// });



/// <reference types="cypress" />

// Login once and reuse session
Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.get('[data-testid="username-input"]').type(Cypress.env('username'));
  cy.get('[data-testid="password-input"]').type(Cypress.env('password'), { log: false });
  cy.get('[data-testid="sign-in-button"]').click();
  cy.contains('At a Glance', { timeout: 10000 }).should('be.visible');
});

// Preserve session for each test
beforeEach(() => {
  cy.session('loginSession', () => {
    cy.login();
  });
});

// Test cases
describe('Unpaid Balances Tab', () => {
  it('verifies student details under the unpaid balances tab', () => {
    // Set up API interception
    cy.intercept('GET', '/api/v2/billing/overview').as('getBillingData');

    // Navigate to the unpaid balances tab
    cy.visit('/billing/overview/unpaid');

    // Wait for the API response
    cy.wait('@getBillingData', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Ensure the response is successful
    });

    // Ensure the unpaid balances tab is selected
    cy.get('[data-testid="billing-nav-unpaid"]')
      .should('have.attr', 'aria-current', 'page');

    // Check for the table presence
    cy.get('table[role="table"]', { timeout: 10000 })
      .scrollIntoView()
      .should('exist')
      .should('be.visible');

    // Validate column headers
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
});
