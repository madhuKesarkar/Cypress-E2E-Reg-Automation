const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

function loadEnvConfig() {
  const envName = process.env.CYPRESS_ENV || "sandbox"; 
  const filePath = path.resolve("cypress", "config", `${envName}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing config file: ${filePath}. Valid envs: sandbox, qa`
    );
  }

  const fileConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return {
  envName,
  ...fileConfig,
  username: process.env.CYPRESS_USERNAME || fileConfig.username,
  password: process.env.CYPRESS_PASSWORD || fileConfig.password,
};
}

const envConfig = loadEnvConfig();

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    charts: true,
    overwrite: false,
    html: false,
    json: true,
    reportFilename: "mochawesome",
    saveAllAttempts: false,
    outputDir: "cypress/reports/mochawesome/.jsons",
  },

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || envConfig.baseUrl,

  setupNodeEvents(on, config) {
    require("cypress-mochawesome-reporter/plugin")(on);

  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.family === "chromium") {
      launchOptions.args.push("--disable-blink-features=AutomationControlled");
      launchOptions.args.push("--disable-infobars");
      launchOptions.args.push(
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
    }

    return launchOptions;
  });

  config.env = {
    ...config.env,
    ...envConfig,
    username: process.env.CYPRESS_USERNAME || envConfig.username,
    password: process.env.CYPRESS_PASSWORD || envConfig.password,
  };

  return config;
},

    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",

    // Block PerimeterX domains so the bot-detection challenge never loads
    blockHosts: [
      "*.perimeterx.net",
      "*.perimeterx.com",
      "*.px-cloud.net",
      "*.px-client.net",
    ],

    pageLoadTimeout: 180000,
    defaultCommandTimeout: 20000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    retries: { runMode: 2, openMode: 1 },
  },

  video: true,
  videosFolder: "cypress/videos",
});
