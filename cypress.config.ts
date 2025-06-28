import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const env = dotenv.config().parsed
      return { ...config, env }
    },
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
  },
});
