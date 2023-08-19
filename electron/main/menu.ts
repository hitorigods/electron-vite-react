import { app, Menu } from 'electron';

const menuHandler = () => {
	const isMac = process.platform === 'darwin';

	const template: Electron.MenuItemConstructorOptions[] = [];

	const macMenu: Electron.MenuItemConstructorOptions[] = [
		{
			label: app.name,
			submenu: [
				{ role: 'about', label: 'このアプリについて' },
				{ type: 'separator' },
				{ role: 'services', label: 'サービス' },
				{ type: 'separator' },
				{ role: 'hide', label: '隠す' },
				{ role: 'hideOthers', label: '他を隠す' },
				{ role: 'quit', label: '終了' },
			],
		},
	];

	if (isMac) {
		template.push(...macMenu);
	}

	template.push({
		label: 'ファイル',
		submenu: [isMac ? { role: 'close', label: '閉じる' } : { role: 'quit', label: '終了' }],
	});

	const editSubMenu: Electron.MenuItemConstructorOptions[] = [
		{ role: 'undo', label: '元に戻す' },
		{ role: 'redo', label: 'やり直す' },
		{ type: 'separator' },
		{ role: 'cut', label: '切り取り' },
		{ role: 'copy', label: 'コピー' },
		{ role: 'paste', label: '貼り付け' },
	];

	if (isMac) {
		editSubMenu.push(
			...([
				{ role: 'pasteAndMatchStyle', label: 'ペーストしてスタイルを合わせる' },
				{ role: 'delete', label: '削除' },
				{ role: 'selectAll', label: 'すべてを選択' },
				{ type: 'separator' },
				{
					label: '音声',
					submenu: [
						{ role: 'startSpeaking', label: '読み上げ開始' },
						{ role: 'stopSpeaking', label: '読み上げ停止' },
					],
				},
			] as Electron.MenuItemConstructorOptions[])
		);
	} else {
		editSubMenu.push(
			...([
				{ role: 'delete', label: '削除' },
				{ type: 'separator' },
				{ role: 'selectAll', label: 'すべてを選択' },
			] as Electron.MenuItemConstructorOptions[])
		);
	}

	template.push({
		label: '編集',
		submenu: editSubMenu,
	});

	template.push({
		label: '表示',
		submenu: [
			{ role: 'reload', label: '再読み込み' },
			{ role: 'forceReload', label: '強制再読み込み' },
			{ role: 'toggleDevTools', label: 'デベロッパーツール' },
			{ type: 'separator' },
			{ role: 'resetZoom', label: 'ズームリセット' },
			{ role: 'zoomIn', label: '拡大' },
			{ role: 'zoomOut', label: '縮小' },
			{ type: 'separator' },
			{ role: 'togglefullscreen', label: '全画面表示' },
		],
	});

	const windowSubMenu: Electron.MenuItemConstructorOptions[] = [
		{ role: 'minimize', label: '最小化' },
		{ role: 'zoom', label: 'ズーム' },
	];

	if (isMac) {
		windowSubMenu.push(
			...([
				{ type: 'separator' },
				{ role: 'front', label: '全ウィンドウを前面に表示' },
				{ type: 'separator' },
				{ role: 'window', label: 'ウィンドウ' },
			] as Electron.MenuItemConstructorOptions[])
		);
	} else {
		windowSubMenu.push({ role: 'close', label: '閉じる' });
	}

	template.push({
		label: 'ウィンドウ',
		submenu: windowSubMenu,
	});

	template.push({
		role: 'help',
		label: 'ヘルプ',
		submenu: [
			{
				label: 'Electronについて',
				click: async () => {
					const { shell } = require('electron');
					await shell.openExternal('https://electronjs.org');
				},
			},
		],
	});

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
};

export default menuHandler;
