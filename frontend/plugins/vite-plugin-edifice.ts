import { Plugin } from 'vite';

export function hashEdificeBootstrap({ hash }: { hash: string }): Plugin {
  return {
    name: 'vite-plugin-edifice',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '/assets/themes/edifice-bootstrap/index.css',
        `/assets/themes/edifice-bootstrap/index.css?${hash}`
      );
    },
  };
}
