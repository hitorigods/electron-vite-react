import fs from 'fs';
import { join } from 'node:path';
import processEnv from './process.env';

// process.envの格納
processEnv();

const fileName = './app/window.save.json';
const devToolsWidth = 570;

const defaultSetting = {
	x: 0,
	y: 0,
	width: 1280,
	height: 800,
};

const devURL = process.env.VITE_DEV_SERVER_URL;

// ウィンドウのサイズを保存するファイル名
const windowSizeFile = devURL ? join(process.env.VITE_PUBLIC, fileName) : join(process.resourcesPath, fileName);

const windowSaveConfig = {
	title: 'Main window',
	icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
	x: defaultSetting.x,
	y: defaultSetting.y,
	width: devURL ? defaultSetting.width + devToolsWidth : defaultSetting.width,
	height: defaultSetting.height,
	webPreferences: {},
};

// jsonファイルを読み込み結果を返す
const LoadWindowSize = () => {
	if (!fs.existsSync(windowSizeFile)) {
		return {};
	}
	const fileContent = fs.readFileSync(windowSizeFile, 'utf-8');

	try {
		return JSON.parse(fileContent);
	} catch (error) {
		return {};
	}
};

const windowSaveHandler = (window: Electron.BrowserWindow) => {
	// サイズ情報を読み込む
	const windowSize = LoadWindowSize();

	// サイズ情報があれば、設定する
	if (Object.entries(windowSize).length != 0) {
		window.setPosition(windowSize.x, windowSize.y);
		window.setSize(windowSize.width, windowSize.height);
	}

	// アプリ終了時に画面情報を保存するよう設定
	window.on('close', () => {
		const sizes = window ? window.getSize() : [1280, 800];
		const positions = window ? window.getPosition() : [0, 0];
		const fileContents = {
			x: positions[0],
			y: positions[1],
			width: sizes[0],
			height: sizes[1],
		};

		fs.writeFile(windowSizeFile, JSON.stringify(fileContents), (error) => {
			if (error) {
				console.log('error', error);
			} else {
				console.log('ウィンドウデータを保存しました');
			}
		});
	});
};

export { windowSaveConfig, windowSaveHandler };
