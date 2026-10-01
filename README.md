# Luis Guillén — Portfolio

Personal portfolio of Luis Guillén Servera, AI Engineer & Tech Lead based in
Las Palmas de Gran Canaria.

Editorial, typography-led single page: numbered sections, hairline grid, one
accent colour, EN/ES and light/dark themes. All copy lives in `src/i18n.ts`.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (design tokens in `src/index.css`)
- react-i18next for EN/ES
- Fonts: Instrument Sans, Instrument Serif, Newsreader, IBM Plex Mono

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:8080
pnpm build      # production build in dist/
pnpm test       # vitest
```

## Content

- Text and translations: `src/i18n.ts`
- Skill groups (marquee + Stack section): `src/components/portfolio/stack.ts`
- Project tags and links: `src/components/portfolio/ProjectsSection.tsx`
- Photo: `public/mi_foto.jpeg` · CV: `public/cv.pdf` (served at `/cv.pdf`)

## Deploy

Live at https://luis-guillen.github.io. Every push to `master` runs
`.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to
GitHub Pages. In the repository settings, Pages must use the
**GitHub Actions** source.
