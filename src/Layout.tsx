import type { ReactNode } from 'react';

import { cn } from './lib/utils';
import { COMPANY_NAME, CONTACT_EMAIL, FOUNDED_YEAR } from './constants';


export const LINK_CLASS_NAME = 'transition-colors hover:text-muted hover:underline';


// every page is one card in the middle with the footer under it, like nsb.gg. `wide` for reading (the privacy policy)
export function Page({ children, wide }: {children: ReactNode, wide?: boolean}) {
  return (
    <main className='flex min-h-dvh flex-col items-center justify-center gap-3 p-3 sm:p-4'>
      <div className={cn('flex w-full flex-col rounded-lg border border-line bg-surface shadow-[0_9px_30px_rgba(6,6,7,0.3)]', (wide) ? 'max-w-2xl' : 'max-w-lg')}>
        {children}
      </div>
      <Footer/>
    </main>
  );
}


function Footer() {
  return (
    <footer className='flex flex-col items-center gap-1 text-center text-xs text-subtle'>
      <nav className='flex flex-wrap items-center justify-center gap-2'>
        <a className={LINK_CLASS_NAME} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <span aria-hidden='true'>·</span>
        <a className={LINK_CLASS_NAME} href='/privacy'>Privacy</a>
      </nav>
      <p>© {FOUNDED_YEAR}–{new Date().getFullYear()} {COMPANY_NAME}</p>
    </footer>
  );
}
