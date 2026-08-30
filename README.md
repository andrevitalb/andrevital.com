# andrevital.com

André Vital's portfolio. Next.js 16 App Router, React 19, Tailwind 4, all content
in the repo as MDX and YAML. No CMS, no database: a build is a static export of
whatever is committed.

## Getting started

Node 22 (`.nvmrc`) and pnpm.

```
pnpm install
pnpm dev
```

`pnpm dev` reads `.env.development`, which turns on every section. Published
environments do not (see Section flags).

## Scripts

- `pnpm dev` : start the development server
- `pnpm build` : build for production
- `pnpm start` : run the production build
- `pnpm typecheck` : type-check with tsc
- `pnpm lint` : check formatting, lint rules and import sorting with Biome
- `pnpm format` : format the codebase with Biome
- `pnpm test` : run unit tests with Vitest
- `pnpm e2e` : run the Playwright smoke suite against a production build
- `pnpm cv` : regenerate `public/cv.pdf` and `content/cv.md` from `content/cv.yaml`

## Content

Everything the site renders lives in `content/`. Adding or changing content is a
pull request; merging to `main` deploys.

| Path | What it holds |
| --- | --- |
| `content/site.yaml` | Site name, positioning line, contact links |
| `content/cv.yaml` | The single source for the CV (see below) |
| `content/writing/*.mdx` | Posts |
| `content/work/*.mdx` | Work entries |
| `content/craft/*.mdx` | Craft pieces |

Every MDX file carries front matter validated by a zod schema in
`lib/schemas.ts`; an invalid file fails the build rather than rendering wrong.
Each schema has a `status` field, and a file that is not `published` is dropped
at the content layer, so drafts get no route, no sitemap entry and no feed item.
The fields themselves are documented in the YAML comments of the first file of
each kind, `content/craft/logo-draw.mdx` being the most thorough.

A Craft piece's demo is not content: `kind: component` names a key in the
registry at `components/craft/demos/index.ts`, and a key that names no demo
fails the build.

### The CV

`content/cv.yaml` is the only place CV facts live. Two artifacts are generated
from it, and they are tracked differently:

- `content/cv.md` is committed, because the separate career-ops project reads it
  out of a checkout rather than out of a build
- `public/cv.pdf`, what `/about` links to, is gitignored and built on demand

`pnpm cv` regenerates both, and `pnpm dev` and `pnpm build` run it first, which
is how the PDF exists on Vercel without being tracked. CI fails if
`content/cv.md` is out of date with `content/cv.yaml`, which is what catches a
`cv.yaml` edit that never got the generator run against it.

Bullets are verbatim from the hand-written CV of record, not reworded here. See
`docs/cv-format.md`.

## Section flags

`NEXT_PUBLIC_SECTIONS` is a comma-separated list of the sections that exist for
a given build. Anything not listed is not merely hidden: it has no routes, no
sitemap entries, no nav link, and its URLs answer exactly like an unknown route,
so a hidden section is indistinguishable from one that was never built.

```
NEXT_PUBLIC_SECTIONS=work,craft,writing   # .env.development, everything on
NEXT_PUBLIC_SECTIONS=writing              # every published environment today
```

Work and Craft are built and off everywhere published, pending a rework of each
page. Local development is where that rework happens.

## Deployment

Vercel. `main` is the production branch; every pull request gets a preview.
CI (`.github/workflows/ci.yml`) runs typecheck, lint, unit tests and a build on
one job and the Playwright suite on another.

The launch sequence, including the Vercel settings and the decommission of the
old Strapi backend, is recorded in `docs/launch-checklist.md`.

## Documentation

- `docs/design.md` : the design system and the decisions behind it
- `docs/cv-format.md` : the `cv.yaml` schema and how the PDF is laid out
- `docs/launch-checklist.md` : the v1 launch and decommission sequence
- `docs/plans/` : the rebuild plan, unit by unit, with outcomes
