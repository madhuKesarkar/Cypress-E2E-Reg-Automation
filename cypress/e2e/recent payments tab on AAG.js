/// <reference types="cypress" />

describe('Login Test', () => {

  beforeEach(() => {
    // Code here will run before each test case
    cy.visit('/'); // Navigates to the base URL before each test
  });

  it('Visits the Base URL', () => {
    cy.url().should('include', 'sandbox'); // Update 'sandbox' based on your application's expected URL
  });


  it('Logs in with valid credentials', () => {
    // Replace '#username' and '#password' with the actual selectors for your login fields
    cy.get('#username').type('madhu.kesarkar+ServicefeeAdmin@mybrightwheel.com'); // Enter the username
    cy.get('#password').type('Testing@BW123'); // Enter the password
  
    // Replace '#loginButton' with the actual selector for the login button
    cy.get('[data-testid="sign-in-button"]').click();
    //cy.getByTestId('submit-button').click(); // Click the login button
  
    // Verify successful login by checking the URL or some element on the page
    cy.contains('Your brightwheel starter guide', { timeout: 10000 }).should('be.visible'); // Optional: Check for a welcome message or other element
  });

});
  
