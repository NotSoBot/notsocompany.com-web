// served from our own domain rather than Google Fonts, so visiting the page sends nothing to anyone else
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/figtree';
import './index.css';

import { StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

import { Home } from './Home';
import { Privacy } from './Privacy';


// every page, by the data-page its html puts on #root. a new page is its html here, in vite.config.ts's inputs and
// in this list
const PAGES = {
  home: Home,
  privacy: Privacy,
} satisfies Record<string, ComponentType>;

const root = document.getElementById('root')!;
const pageName = root.dataset.page;
if (!pageName || !Object.hasOwn(PAGES, pageName)) {
  // loud rather than quietly showing Home under another page's title
  throw new Error(`#root has data-page="${pageName}", expected one of: ${Object.keys(PAGES).join(', ')}`);
}
const Page = PAGES[pageName as keyof typeof PAGES];

createRoot(root).render(
  <StrictMode>
    <Page/>
  </StrictMode>,
);
