# billing_QATestAutomation

End-to-end Cypress test automation for the Brightwheel **Billing** module, integrated with CircleCI.

---

## Local Test Development

### 1. Install dependencies

```sh
npm install

2. Run the full E2E suite (headless)
   
npm run cy:run

3. Open Cypress in UI mode (for local debugging):

npx cypress open

4. Generate the Mochawesome HTML report after a run:

npm run report


# Getting Started

# Node

It’s recommended to use a version manager for Node like nvm.

The current Node version for this project is defined in .nvmrc (or in package.json engines if present).

To enable it with nvm, run:

```nvm use```
---
```md
## Project Structure

cypress/
e2e/ # Test specs grouped by feature area
fixtures/ # Test data
support/
commands.js # Custom Cypress commands
e2e.js # Global hooks and setup
reports/
mochawesome/ # HTML + JSON reports (gitignored)
screenshots/ # Failure screenshots (gitignored)
videos/ # Video recordings (gitignored)

cypress.config.js # Cypress configuration
package.json # Scripts & dependencies
README.md

# Reporting

This framework generates:

 1. Mochawesome HTML report

    a. Location: cypress/reports/mochawesome/mochawesome.html
    b. Command: ```npm run report```

2. JUnit XML report (for CI)

    a. Location: cypress/results/junit.xml (if configured in mocha-junit-reporter)

All report artifacts (HTML, JSON, screenshots, videos) are ignored via .gitignore and are recreated on each run.

# CI

The suite is intended to run in CircleCI:

Headless Cypress execution

JUnit XML for test results

Mochawesome HTML as a build artifact (optional)

TBC



