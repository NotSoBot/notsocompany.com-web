// served from our own domain rather than Google Fonts, so visiting the page sends nothing to anyone else
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/figtree';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Home } from './Home';
import { Privacy } from './Privacy';


// each page's html says which one it is on #root (index.html, privacy.html)
const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    {(root.dataset.page === 'privacy') ? <Privacy/> : <Home/>}
  </StrictMode>,
);
