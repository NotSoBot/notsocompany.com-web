import type { ReactNode } from 'react';

import companyLogo from './assets/logos/NotSoCompanyLogo.svg';
import { ANALYTICS_DOMAIN, COMPANY_NAME, CONTACT_EMAIL } from './constants';
import { LINK_CLASS_NAME, Page } from './Layout';


// privacy.html's title and description say the same, keep them in sync
export const PRIVACY_TITLE = 'Privacy Policy';
export const PRIVACY_UPDATED = 'October 29, 2026';

// the address NotSoBot's terms and privacy policy give for the company
const COMPANY_ADDRESS = '254 Chapman Rd, Ste 208 #8692 Newark, Delaware 19702';

const LINK = `text-brand-text ${LINK_CLASS_NAME}`;


// notsocompany.com/privacy: this site, and the analytics it, notsobot.com and nsb.gg load from oasis.notsocompany.com.
// NotSoBot itself (the bot, the dashboard, logging in) is covered by notsobot.com/legal/privacy
export function Privacy() {
  return (
    <Page wide>
      <header className='flex flex-col items-center gap-3 rounded-t-lg bg-deep px-8 py-8 text-center'>
        <a href='/' aria-label={COMPANY_NAME}>
          <img src={companyLogo} alt='' className='w-24'/>
        </a>
        <h1 className='text-2xl font-bold text-white'>{PRIVACY_TITLE}</h1>
        <p className='text-xs text-subtle'>Last updated {PRIVACY_UPDATED}</p>
      </header>
      <article className='flex flex-col gap-6 px-5 pt-5 pb-6 text-sm leading-relaxed text-muted sm:px-8'>
        <p>
          This policy covers notsocompany.com and the website analytics on notsocompany.com, notsobot.com and nsb.gg, which run on {ANALYTICS_DOMAIN}.
          NotSoBot itself, meaning the bot, its dashboard and logging in with Discord, is covered by <a className={LINK} href='https://notsobot.com/legal/privacy'>NotSoBot's Privacy Policy</a>.
        </p>

        <Section title='Who we are'>
          <p>{COMPANY_NAME}, {COMPANY_ADDRESS}. We run NotSoBot, notsobot.com and nsb.gg.</p>
        </Section>

        <Section title='notsocompany.com'>
          <p>
            This site counts visits with the analytics described below and sets no cookies. Its fonts and images come from notsocompany.com itself.
            Like every site on Cloudflare, Cloudflare handles your IP address to deliver the page and protect it from attacks.
          </p>
        </Section>

        <Section title='Analytics on notsocompany.com, notsobot.com and nsb.gg'>
          <p>
            We count visits with <a className={LINK} href='https://umami.is'>Umami</a>, an open-source analytics tool that we host ourselves at {ANALYTICS_DOMAIN}.
            For each page view it records:
          </p>
          <ul className='flex list-disc flex-col gap-1 pl-5'>
            <li>the page's address and the site that linked to it</li>
            <li>your browser, operating system, device type, screen size and language</li>
            <li>your approximate location (country, region and city), worked out from your IP address</li>
          </ul>
          <p>
            On notsobot.com it also records when you add NotSoBot to a server through the website, along with which part of the site the invite came from.
          </p>
          <p>
            It doesn't use cookies or store anything in your browser, and it doesn't keep your IP address.
            To count visitors it uses an identifier made from your IP address and browser that changes every month, so visits can't be followed from one month to the next.
            None of it is linked to your Discord account, even when you're logged in to the dashboard.
          </p>
        </Section>

        <Section title='Who sees it'>
          <p>
            Only us. The analytics stay on our own servers, aren't shared or sold, and aren't used for advertising.
            We use them to see which pages people visit and where they come from.
          </p>
        </Section>

        <Section title='How long we keep it'>
          <p>
            We keep analytics so we can see how traffic changes over time, and they're part of our encrypted database backups.
            Since they aren't tied to your name, account or IP address, we can't look up or remove one person's visits.
          </p>
        </Section>

        <Section title='Your choices'>
          <p>
            You can block {ANALYTICS_DOMAIN} with any content blocker, and notsocompany.com, notsobot.com and nsb.gg work the same without it.
          </p>
        </Section>

        <Section title='Changes and contact'>
          <p>
            If this policy changes, we'll update it here and change the date at the top.
            Questions can be sent to <a className={LINK} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </Section>
      </article>
    </Page>
  );
}


function Section({ title, children }: {title: string, children: ReactNode}) {
  return (
    <section className='flex flex-col gap-2'>
      <h2 className='text-lg font-bold text-white'>{title}</h2>
      {children}
    </section>
  );
}
