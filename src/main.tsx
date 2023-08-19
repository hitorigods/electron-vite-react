import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Head from './components/Head';
import './samples/node-api';
import '@fontsource-variable/noto-sans-jp';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Head />
		<App />
	</React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
