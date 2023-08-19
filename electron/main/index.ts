import { app, BrowserWindow, shell, ipcMain } from 'electron';
import fs from 'fs';
import { release } from 'node:os';
import { join } from 'node:path';
import processEnv from './process.env';
import { windowSaveConfig, windowSaveHandler } from './window.save';
import { update } from './update';

// ビルド後のディレクトリ構造
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

// process.envの格納
processEnv();

// Windows 7 の GPU アクセラレーションを無効
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Windows 10以降の通知のアプリケーション名を設定
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

// Electronのセキュリティの警告を削除
// この警告は開発モードでのみ表示する
// 詳細：https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let window: BrowserWindow | null = null;

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

// プリロード画面
const preload = join(__dirname, '../preload/index.js');
windowSaveConfig.webPreferences = {
	preload,
	// 警告: production環境では、nodeIntegration を有効にし、contextIsolation を無効に設定
	// contextBridge.exposeInMainWorld の使用を検討してください
	// 詳細：https://www.electronjs.org/docs/latest/tutorial/context-isolation
	nodeIntegration: true,
	contextIsolation: false,
};

const createWindow = async () => {
	window = new BrowserWindow(windowSaveConfig);

	windowSaveHandler(window);

	if (url) {
		window.loadURL(url);
		window.webContents.openDevTools();
	} else {
		window.loadFile(indexHtml);
	}

	// Electron-Renderer へのアクティブなmessageのプッシュをテスト
	window.webContents.on('did-finish-load', () => {
		window?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	// すべてのリンクをアプリケーションではなくブラウザで開くようにする
	window.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});

	// electron-updaterを適用
	update(window);
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	window = null;
	if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
	if (window) {
		// ユーザーが別のウィンドウを開こうとした場合、メインウィンドウにフォーカス
		if (window.isMinimized()) window.restore();
		window.focus();
	}
});

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

// 新しいウィンドウの例 引数: 新しいウィンドウのURL
ipcMain.handle('open-win', (_, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		childWindow.loadURL(`${url}#${arg}`);
	} else {
		childWindow.loadFile(indexHtml, { hash: arg });
	}
});

// App.texによるクリックカウントの監視
ipcMain.on('app-click-count', (event, count) => {
	console.log('count', count);
});
