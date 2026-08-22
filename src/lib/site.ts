const env = import.meta.env

/**
 * Site-wide identity. Rebrand the whole factory by editing this one file.
 * SITE.url should come from VITE_SITE_URL in production (.env / hosting env).
 */
export const SITE = {
  name: 'MicroForge',
  tagline: 'Small, fast, free tools.',
  description:
    'MicroForge is a growing collection of free calculators, generators and utilities that run entirely in your browser — no sign-up, no downloads, no clutter.',
  contactEmail: 'hello@microforge.example',
  url: ((env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '')) || 'http://localhost:4173',
} as const
