import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:9200/#/',
    testIsolation: false,
    viewportWidth: 1200,
    viewportHeight: 720,
  },
})
