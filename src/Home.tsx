import { ArrowUpRight, Plus } from 'lucide-react';

import companyLogo from './assets/logos/NotSoCompanyLogo.svg';
import notSoBotLogo from './assets/logos/NotSoLogo.svg';
import { COMPANY_NAME } from './constants';
import { LINK_CLASS_NAME, Page } from './Layout';
import { useLogoEffect } from './lib/logoEffects';


// notsocompany.com/ itself, laid out like nsb.gg's home page
export function Home() {
  return (
    <Page>
      <header className='flex flex-col items-center gap-3 rounded-t-lg bg-deep px-8 py-10 text-center'>
        <img src={companyLogo} alt='' className='w-36'/>
        <h1 className='text-2xl font-bold text-white'>{COMPANY_NAME}</h1>
      </header>
      <section className='flex flex-col items-center gap-3 px-4 pt-4 pb-4'>
        <h2 className='font-sans text-xs font-semibold tracking-wide text-subtle uppercase'>What we own</h2>
        <NotSoBot/>
      </section>
    </Page>
  );
}


// the logo swaps through the effects on hover, like nsb.gg's and notsobot.com's
function NotSoBot() {
  const { effect, handlers } = useLogoEffect();
  return (
    <article className='flex w-full flex-col items-center gap-3 rounded-lg bg-surface-2 px-4 py-5 text-center'>
      <a className='flex items-center gap-2.5' href='https://notsobot.com' {...handlers}>
        <img src={effect ?? notSoBotLogo} alt='' className='size-11 shrink-0 object-contain'/>
        <h3 className='font-display text-2xl font-bold text-white'>NotSoBot</h3>
      </a>
      <p className='max-w-sm text-sm text-muted'>The Discord bot for editing images, gifs, audio and video, with tags, music and moderation.</p>
      <div className='flex flex-wrap justify-center gap-2'>
        <a className='btn btn-primary btn-sm' href='https://notsobot.com/invite'>
          <Plus className='size-4'/>
          Add NotSoBot
        </a>
        <a className='btn btn-secondary btn-sm' href='https://notsobot.com'>
          notsobot.com
          <ArrowUpRight className='size-4'/>
        </a>
        <a className='btn btn-secondary btn-sm' href='https://nsb.gg'>
          nsb.gg
          <ArrowUpRight className='size-4'/>
        </a>
      </div>
      {/* NotSoBot's own terms and privacy policy, they name NotSoCompany as its operator */}
      <nav className='flex items-center gap-2 text-xs text-subtle'>
        <a className={LINK_CLASS_NAME} href='https://notsobot.com/legal/tos'>Terms</a>
        <span aria-hidden='true'>·</span>
        <a className={LINK_CLASS_NAME} href='https://notsobot.com/legal/privacy'>Privacy</a>
      </nav>
    </article>
  );
}
