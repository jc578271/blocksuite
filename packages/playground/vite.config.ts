import path, { resolve } from 'node:path';

import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import istanbul from 'vite-plugin-istanbul';
import wasm from 'vite-plugin-wasm';
import { viteSingleFile } from "vite-plugin-singlefile"

import { hmrPlugin } from './scripts/hmr-plugin';

const enableIstanbul = !!process.env.CI || !!process.env.COVERAGE;

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, __dirname, '') };

  return defineConfig({
    envDir: __dirname,
    define: {
      'import.meta.env.PLAYGROUND_SERVER': JSON.stringify(
        process.env.PLAYGROUND_SERVER ?? 'http://localhost:8787'
      ),
      'import.meta.env.PLAYGROUND_WS': JSON.stringify(
        process.env.PLAYGROUND_WS ?? 'ws://localhost:8787'
      ),
    },
    plugins: [
      hmrPlugin,
      enableIstanbul &&
        istanbul({
          cwd: fileURLToPath(new URL('../..', import.meta.url)),
          include: ['packages/**/src/*'],
          exclude: [
            'node_modules',
            'tests',
            fileURLToPath(new URL('.', import.meta.url)),
          ],
          forceBuildInstrument: true,
        }),
      wasm(),
      viteSingleFile(),
    ],
    build: {
      target: 'ES2022',
      sourcemap: true,
      rollupOptions: {
        input: {
          // main: resolve(__dirname, 'index.html'),
          // 'starter/': resolve(__dirname, 'starter/index.html'),
          'examples/basic/doc': resolve(
            __dirname,
            'examples/basic/doc/index.html'
          ),
          // 'examples/basic/edgeless': resolve(
          //   __dirname,
          //   'examples/basic/edgeless/index.html'
          // ),
          // 'examples/multiple-editors/doc-doc': resolve(
          //   __dirname,
          //   'examples/multiple-editors/doc-doc/index.html'
          // ),
          // 'examples/multiple-editors/doc-edgeless': resolve(
          //   __dirname,
          //   'examples/multiple-editors/doc-edgeless/index.html'
          // ),
          // 'examples/multiple-editors/edgeless-edgeless': resolve(
          //   __dirname,
          //   'examples/multiple-editors/edgeless-edgeless/index.html'
          // ),
          // 'examples/inline': resolve(__dirname, 'examples/inline/index.html'),
          // 'examples/store': resolve(__dirname, 'examples/store/index.html'),
        },
        output: {
          inlineDynamicImports: false,
        }
      },
    },
    resolve: {
      alias: {
        '@blocksuite/blocks': path.resolve(
          fileURLToPath(new URL('../blocks/src', import.meta.url))
        ),
        '@blocksuite/blocks/*': path.resolve(
          fileURLToPath(new URL('../blocks/src/*', import.meta.url))
        ),
        '@blocksuite/global/*': path.resolve(
          fileURLToPath(new URL('../global/src/*', import.meta.url))
        ),
        '@blocksuite/store': path.resolve(
          fileURLToPath(new URL('../store/src', import.meta.url))
        ),
        '@blocksuite/inline': path.resolve(
          fileURLToPath(new URL('../inline/src', import.meta.url))
        ),
        '@blocksuite/inline/*': path.resolve(
          fileURLToPath(new URL('../inline/src/*', import.meta.url))
        ),
      },
    },
  });
};
