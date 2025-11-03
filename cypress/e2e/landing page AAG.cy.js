/// <reference types="cypress" />

// // Login once and reuse session
// Cypress.Commands.add('login', () => {
//   cy.visit('/');
//   cy.get('[data-testid="username-input"]').type(Cypress.env('username'));
//   cy.get('[data-testid="password-input"]').type(Cypress.env('password'));
//   cy.get('[data-testid="sign-in-button"]').click();
//   cy.contains('[id="react-aria5847715173-20"]').click();
//   cy.contains('At a Glance', { timeout: 10000 }).should('be.visible');
// });

// beforeEach(() => {
//   cy.session('login', cy.login);
//   cy.visit('/');
// });

// // Test cases
// describe('At a Glance Page Tests', () => {
//   it('verifies Open invoices section', () => {
//     cy.contains('Open invoices as of today', { timeout: 10000 }).should('be.visible');
//   });

//   it('verifies last 35 days payments section', () => {
//     cy.contains('Payments in last 35 days', { timeout: 10000 }).should('be.visible');
//   });

//   it('verifies activity last 35 days section', () => {
//     cy.contains('Activity last 35 days', { timeout: 10000 }).should('be.visible');
//   });

//   it('navigates to Subsidies tab', () => {
//     cy.get('a[href="/billing/subsidies/all-agencies"]')
//       .should('be.visible')
//       .click();
//     cy.contains('h1', 'Subsidies', { timeout: 10000 }).should('be.visible');
//   });

//   it('searches for a student', () => {
//     cy.get('#student').type('ServiceFee One', { force: true });
//     cy.contains('button', 'Apply').click();
//     cy.get('a[title="ServiceFee One"]').should('be.visible').and('have.text', 'ServiceFee One');
//   });


//   it('accesses Help Center link', () => {
//      // Check that the link has the correct href and target attributes
//     cy.get('a[href="https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard"]')
//     .should('have.attr', 'href', 'https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard')
//     .and('have.attr', 'target', '_blank');

//      // Extract the href and visit the URL using cy.request
//     cy.get('a[href="https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard"]')
//     .should('have.attr', 'href')
//     .then((href) => {
//       // Send a GET request to validate the link works
//     cy.request(href).then((response) => {
//         expect(response.status).to.eq(200); // Ensure the external link is reachable
//       });
//     });
// });
// })
// /// <reference types="cypress" />

// beforeEach(() => {
//   cy.session(
//     'auth-session',
//     () => {
//       cy.performLogin();
//     },
//     {
//       validate: () => {
//         cy.getCookie('_bw_session').should('exist'); // update cookie name when known
//       },
//       cacheAcrossSpecs: true,
//     }
//   );

//   cy.visit('/');
//   cy.closeGettingStartedModalIfPresent();
// });

// describe('At a Glance Page Tests', () => {
//   it('lands on At a Glance', () => {
//     cy.contains('At a Glance', { timeout: 15000 }).should('be.visible');
//   });

//   it('verifies Open invoices section', () => {
//     cy.contains('Open invoices as of today', { timeout: 10000 }).should('be.visible');
//   });

//   it('verifies last 35 days payments section', () => {
//     cy.contains('Payments in last 35 days', { timeout: 10000 }).should('be.visible');
//   });

//   it('verifies activity last 35 days section', () => {
//     cy.contains('Activity last 35 days', { timeout: 10000 }).should('be.visible');
//   });

//   it('navigates to Subsidies tab', () => {
//     cy.get('a[href="/billing/subsidies/all-agencies"]').should('be.visible').click();
//     cy.contains('h1', 'Subsidies', { timeout: 10000 }).should('be.visible');
//   });

//   it('searches for a student', () => {
//     cy.get('#student').type('ServiceFee One', { force: true });
//     cy.contains('button', 'Apply').click();
//     cy.get('a[title="ServiceFee One"]').should('be.visible').and('have.text', 'ServiceFee One');
//   });

//   it('accesses Help Center link', () => {
//     const href = 'https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard';
//     cy.get(`a[href="${href}"]`)
//       .should('have.attr', 'href', href)
//       .and('have.attr', 'target', '_blank')
//       .then(() => cy.request(href))
//       .then((res) => expect(res.status).to.eq(200));
//   });
// });
// *********

/// <reference types="cypress" />

beforeEach(() => {
  cy.login();
});

describe('At a Glance Page Tests', () => {
  it('verifies Open invoices section', () => {
    cy.contains('Open invoices as of today', { timeout: 20000 }).should('be.visible');
  });

  it('verifies last 35 days payments section', () => {
    cy.contains('Payments in last 35 days', { timeout: 20000 }).should('be.visible');
  });

  it('verifies activity last 35 days section', () => {
    cy.contains('Activity last 35 days', { timeout: 20000 }).should('be.visible');
  });

  it('navigates to Subsidies tab', () => {
    cy.get('a[href="/billing/subsidies/all-agencies"]').should('be.visible').click();
    cy.contains('h1', 'Subsidies', { timeout: 20000 }).should('be.visible');
  });

  it('searches for a student', () => {
    cy.get('#student').type('ServiceFee One', { force: true });
    cy.contains('button', 'Apply').click();
    cy.get('a[title="ServiceFee One"]').should('be.visible').and('have.text', 'ServiceFee One');
  });

  it('accesses Help Center link', () => {
    const href =
      'https://help.mybrightwheel.com/en/articles/5363662-billing-v3-billing-dashboard';
    cy.get(`a[href="${href}"]`)
      .should('have.attr', 'href', href)
      .and('have.attr', 'target', '_blank')
      .then(() => cy.request(href))
      .then((res) => expect(res.status).to.eq(200));
  });
});
