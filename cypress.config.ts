import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import mochawesome from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // carrega variáveis .env
      const result = dotenv.config();
      const parsedEnv = result.parsed || {};

      config.env = {
        ...config.env,
        ...parsedEnv,
      };

      // registra o reporter mochawesome
      mochawesome(on);

      return config;
    },
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
  },

  // reporter de saída
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports', // onde salvar JSON/HTML
    reportFilename: 'report',
    overwrite: false,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveJson: true, // necessário para merge depois
  },
});
