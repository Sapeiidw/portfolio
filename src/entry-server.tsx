import { renderToString } from 'react-dom/server';
import App from './App';
import { site } from './data/site';

export function render() {
  return { html: renderToString(<App />), site };
}
