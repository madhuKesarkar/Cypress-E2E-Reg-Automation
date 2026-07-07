/// <reference types="cypress" />

/**
 * add agency.cy.js — refactored with SubsidiesPage POM
 */
const SubsidiesPage = require('../../pages/SubsidiesPage');

describe("Verify if the user is able to add an agency from the 'Subsidies' tab", () => {
  let agencyName;

  beforeEach(() => {
    cy.login();
    SubsidiesPage.openViaNav();
  });

  it('should display the Subsidies tab with the agencies table', () => {
    SubsidiesPage.assertColumnHeaders();
  });

  it('should allow the user to add a new agency from the Subsidies tab', () => {
    agencyName = `Automation User ${Date.now()}`;

    SubsidiesPage.clickAddAnAgency();

    SubsidiesPage.fillAgencyForm({
      name:        agencyName,
      contactName: 'Automation Contact',
      phone:       '9876543210',
      email:       'automation@test.com',
      street1:     '123 Automation Street',
      street2:     'Suite 100',
      city:        'San Francisco',
      state:       'California',
      zip:         '94105',
      country:     'USA',
    });

    SubsidiesPage.submitCreateAgency(agencyName);
    SubsidiesPage.assertAgencyCreated(agencyName);
  });

  it('should validate existing agency view and delete flow', () => {
    cy.wrap(null).then(() => {
      expect(agencyName, 'agency name from previous test').to.exist;
    });

    SubsidiesPage.viewAgencyAccount(agencyName);
    SubsidiesPage.assertDetailPageLoaded(agencyName);

    // Navigate back to subsidies list
    cy.contains('a', 'Subsidies').should('be.visible').click();
    SubsidiesPage.assertPageHeading();

    // Delete the agency
    SubsidiesPage.deleteAgency(agencyName);
    SubsidiesPage.assertAgencyDeleted(agencyName);
  });
});