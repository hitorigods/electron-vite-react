import { join } from 'node:path';

const processEnv = () => {
	process.env.DIST_ELECTRON = join(__dirname, '../');
	process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');

	process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
		? join(process.env.DIST_ELECTRON, '../public')
		: process.env.DIST;

	const output = {
		DIST_ELECTRON: process.env.DIST_ELECTRON,
		DIST: process.env.DIST,
		VITE_PUBLIC: process.env.VITE_PUBLIC,
		VITE_DEV_SERVER_URL: process.env.VITE_DEV_SERVER_URL,
	};
	return output;
};

export default processEnv;
