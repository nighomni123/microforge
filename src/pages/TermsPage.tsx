import { SITE } from '../lib/site'

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

export function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Terms of Use</h1>

      <Section title="Acceptance">
        <p>
          By using {SITE.name} you agree to these terms. If you do not agree, please do not use
          the site.
        </p>
      </Section>

      <Section title="The service">
        <p>
          {SITE.name} provides free, browser-based tools on an “as is” and “as available” basis.
          We may change, suspend, or remove any tool at any time without notice.
        </p>
      </Section>

      <Section title="Not professional advice">
        <p>
          Results from our calculators and generators are estimates for general information only,
          based solely on the numbers you enter. They are not financial, tax, legal, medical, or
          other professional advice. Always consult a qualified professional before making
          decisions that could affect your money, health, or legal standing.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>You agree not to misuse the site, including by attempting to disrupt it or abuse it in a way that harms other visitors or its availability.</p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, {SITE.name} is not liable for any indirect or
          consequential damages arising from your use of the site or reliance on its results.
        </p>
      </Section>

      <Section title="Third-party content">
        <p>
          The site may display ads or link to third-party websites. We are not responsible for the
          content or practices of those parties. See our{' '}
          <a href="/privacy" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Privacy Policy
          </a>{' '}
          for details on advertising and consent.
        </p>
      </Section>

      <Section title="Changes">
        <p>We may update these terms over time. Continued use of the site means you accept the updated terms.</p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{' '}
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
