import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createDevProxyConfig } from './vite/plugins/devProxy';
import { serveLocalI18n } from './vite/plugins/serveLocalI18n';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const { headers, proxy } = createDevProxyConfig({
    mode,
    routes: [
      '/applications-list',
      '/conf/public',
      '^/(?=help-1d|help-2d)',
      '^/(?=assets)',
      '^/(?=theme|locale|i18n|skin)',
      '^/(?=auth|appregistry|cas|userbook|directory|communication|conversation|portal|session|timeline|workspace|infra)',
      '/explorer',
      '/boilerplate',
    ],
  });

  return defineConfig({
    base: mode === 'production' ? '/boilerplate' : '',
    root: __dirname,
    cacheDir: './node_modules/.vite/boilerplate',

    resolve: {
      alias: {
        '@images': resolve(
          __dirname,
          'node_modules/@edifice.io/bootstrap/dist/images',
        ),
      },
    },

    server: {
      fs: {
        /**
         * Allow the server to access the node_modules folder (for the images)
         * This is a solution to allow the server to access the images and fonts of the bootstrap package for 1D theme
         */
        allow: ['../../'],
      },
      proxy,
      port: 4200,
      headers,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      headers,
      host: 'localhost',
    },

    plugins: [
      serveLocalI18n({
        route: '/boilerplate/i18n',
        filePath: resolve(
          __dirname,
          '../backend/src/main/resources/i18n/fr.json',
        ),
      }),
      react(),
      tsconfigPaths(),
    ],

    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      assetsDir: 'public',
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },

    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/mocks/setup.ts'],
      watch: false,
      clearMocks: true,
      restoreMocks: true,
      reporters: ['default'],
      coverage: {
        reportsDirectory: './coverage/boilerplate',
        provider: 'v8',
      },
      server: {
        deps: {
          inline: ['@edifice.io/react'],
        },
      },
    },
  });
};
