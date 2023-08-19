import { rmSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	rmSync('dist-electron', { recursive: true, force: true });

	const isServe = command === 'serve';
	const isBuild = command === 'build';
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

	return {
		resolve: {
			alias: {
				'@': path.join(__dirname, 'src'),
			},
		},
		plugins: [
			react(),
			electron([
				{
					// ElectronアプリのMain-Processエントリーファイル
					entry: 'electron/main/index.ts',
					onstart(options) {
						if (process.env.VSCODE_DEBUG) {
							console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
						} else {
							options.startup();
						}
					},
					vite: {
						build: {
							sourcemap,
							minify: isBuild,
							outDir: 'dist-electron/main',
							rollupOptions: {
								external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
							},
						},
					},
				},
				{
					entry: 'electron/preload/index.ts',
					onstart(options) {
						// Preload-Scripts のビルドが完了したら、Electronアプリ全体を再起動するのではなく、ページをリロードするようにレンダラープロセスに通知
						options.reload();
					},
					vite: {
						build: {
							sourcemap: sourcemap ? 'inline' : undefined,
							minify: isBuild,
							outDir: 'dist-electron/preload',
							rollupOptions: {
								external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
							},
						},
					},
				},
			]),
			// レンダラープロセスでNode.js APIを使用
			renderer(),
		],
		server:
			process.env.VSCODE_DEBUG &&
			(() => {
				const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
				return {
					host: url.hostname,
					port: +url.port,
				};
			})(),
		clearScreen: false,
	};
});
