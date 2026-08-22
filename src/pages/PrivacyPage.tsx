import { SITE } from '../lib/site'

/**
 * Privacy policy template for a login-free, local-storage web tool with
 * optional cookieless analytics and AdSense. Review with a legal professional
 * before scaling (see ops/publishing-checklist.md).
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-2 space-y-3 leading-relaxed text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </section>
  )
}

export function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>

      <Section title="Overview">
        <p>
          {SITE.name} provides free browser-based tools. You do not need an account, and we never
          ask for your name, email address, or payment details to use a tool.
        </p>
      </Section>

      <Section title="Data stored on your device">
        <p>
          Your tool inputs and preferences are processed and, where needed, saved locally in your
          browser (localStorage). This data stays on your device and is never transmitted to us.
          Clearing your browser data removes it completely.
        </p>
      </Section>

      <Section title="Analytics">
        <p>
          With your consent, we load a privacy-friendly, cookieless analytics service to understand
          which tools are useful (for example, page views and button clicks). Analytics is loaded
          only after you choose “Accept all”, and declining keeps the site fully functional.
        </p>
      </Section>

      <Section title="Advertising">
        <p>
          Some pages may display advertising. With your consent, ads may be served by Google
          AdSense or similar third-party vendors. These vendors may use cookies (including the
          advertising cookie) to serve ads based on your prior visits to this or other websites.
        </p>
        <p>
          You can opt out of personalized advertising in{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          , and learn more about how Google uses data at{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            rel="noopener noreferrer"
            target="_blank"
          >
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
        <p>If you decline consent, no ad scripts are loaded at all.</p>
      </Section>

      <Section title="What we never do">
        <ul className="list-disc space-y-1 pl-5">
          <li>We do not sell personal data.</li>
          <li>We do not require logins or collect identity data.</li>
          <li>We do not send anything you type into a tool to our servers.</li>
        </ul>
      </Section>

      <Section title="Your choices">
        <p>
          You can withdraw consent at any time by clearing this site's cookies and site data in
          your browser settings, which resets your choice and shows the consent banner again.
        </p>
      </Section>

      <Section title="Children's privacy">
        <p>
          The tools are intended for a general audience and are not directed to children under 13.
          We do not knowingly collect personal information from anyone, including children.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this policy as the site grows. Material changes will be reflected on this
          page with an updated “last updated” note.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Email{' '}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
