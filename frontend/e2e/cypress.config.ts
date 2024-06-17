import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run boilerplate:serve',
        production: 'nx run boilerplate:preview',
      },
      ciWebServerCommand: 'nx run boilerplate:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
