import fs from 'fs';
import { join } from 'node:path';
import processEnv from './process.env';

// process.envの格納
const __ENV__ = processEnv();

const fileName = 'window.save.json';
const fileDir = './app/';
const devToolsWidth = 570;

const defaultSetting = {
	x: 0,
	y: 0,
	width: 1280,
	height: 800,
};

const devURL = __ENV__.VITE_DEV_SERVER_URL;
const isDev = !!devURL;

// ウィンドウのサイズを保存するファイル名
const srcFileDir = isDev ? join(__ENV__.VITE_PUBLIC, fileDir) : join(process.resourcesPath, fileDir);
const srcFileName = srcFileDir + fileName;

const windowSaveConfig = {
	title: 'Main window',
	icon: join(__ENV__.VITE_PUBLIC, 'favicon.ico'),
	x: defaultSetting.x,
	y: defaultSetting.y,
	width: isDev ? defaultSetting.width + devToolsWidth : defaultSetting.width,
	height: defaultSetting.height,
	webPreferences: {},
};

// jsonファイルを読み込み結果を返す
const LoadWindowSize = () => {
	if (!fs.existsSync(srcFileName)) {
		return {};
	}
	const fileContent = fs.readFileSync(srcFileName, 'utf-8');

	try {
		return JSON.parse(fileContent);
	} catch (error) {
		return {};
	}
};

const windowSaveHandler = (window: Electron.BrowserWindow) => {
	// サイズ情報を読み込む
	const setSize = LoadWindowSize();

	// サイズ情報があれば、設定する
	if (Object.entries(setSize).length != 0) {
		window.setPosition(setSize.x, setSize.y);
		window.setSize(setSize.width, setSize.height);
	}

	// アプリ終了時に画面情報を保存するよう設定
	window.on('close', () => {
		const windowSizes = window ? window.getSize() : [1280, 800];
		const windowPositions = window ? window.getPosition() : [0, 0];
		const fileContents = {
			x: windowPositions[0],
			y: windowPositions[1],
			width: windowSizes[0],
			height: windowSizes[1],
		};

		// ディレクトリの存在を確認
		if (!fs.existsSync(srcFileName)) {
			try {
				// ディレクトリを作成
				fs.mkdirSync(srcFileDir, { recursive: true });
				console.log('ディレクトリが作成されました');
			} catch (error) {
				console.error('ディレクトリの作成中にエラーが発生しました:', error);
			}
		} else {
			console.log('ディレクトリは既に存在します');
		}

		fs.writeFile(srcFileName, JSON.stringify(fileContents), (error) => {
			if (error) {
				console.log('error', error);
			} else {
				console.log('データを保存しました');
			}
		});
	});
};

export { windowSaveConfig, windowSaveHandler };
