import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import App from './App';
import './styles.css';

const root = document.getElementById('root')!;
const app = <React.StrictMode><App /></React.StrictMode>;
if (root.childElementCount > 0) hydrateRoot(root, app);
else createRoot(root).render(app);
