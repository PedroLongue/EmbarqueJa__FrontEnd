import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const result = dotenv.config();
      const parsedEnv = result.parsed || {};

      config.env = {
        ...config.env,
        ...parsedEnv,
      };

      return config;
    },
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
  },
});
