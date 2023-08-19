import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import Head from './Head';
import App from './App';
import './samples/node-api';
import '@fontsource-variable/noto-sans-jp';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<HelmetProvider>
			<Head />
			<App />
		</HelmetProvider>
	</React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
