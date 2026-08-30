# Launch checklist

The operational sequence for U9: v1 live on andrevital.com from `main`, old URLs
redirecting, old backend gone. Every step is a checkbox so the sequence stays
auditable after the fact.

Order matters in one place only: **the content export has to run while Heroku is
still up**, and the decommission block deletes it. Everything above the
decommission line is reversible; nothing below it is.

## 1. Pre-cutover verification

Run against `main`, locally, before touching Vercel.

- [x] `pnpm typecheck` clean
- [x] `pnpm lint` clean
- [x] `pnpm test` (135 unit)
- [x] `pnpm build` all-static, `public/cv.pdf` emitted
- [x] `pnpm e2e` (39 across chromium and webkit, both builds)
- [x] Lighthouse mobile, every visible route, 95+ in all four categories (R33),
      measured against a local `NEXT_PUBLIC_SECTIONS=writing` production build:

      | Route | Perf | A11y | Best practices | SEO |
      | --- | --- | --- | --- | --- |
      | `/` | 98 | 100 | 100 | 100 |
      | `/about` | 98 | 100 | 100 | 100 |
      | `/contact` | 98 | 100 | 100 | 100 |
      | `/writing` | 98 | 100 | 100 | 100 |
      | `/writing/setting-up-a-multi-package-project` | 97 | 100 | 100 | 100 |

      LCP 2.5s to 2.6s, TBT 0ms to 10ms, CLS 0 throughout. Best practices is 100
      for the first time: 96 on every route through U4 to U8 was the missing
      favicon, now `app/icon.svg`. Desktop is 100 across the board on all five.
      The 404 page cannot be scored, Lighthouse refusing to run against any
      non-200 response (`ERRORED_DOCUMENT_REQUEST`); it is covered by the e2e
      suite and by axe below instead.
- [x] axe on all five routes **and** the 404 page, both themes, emulated through
      `colorScheme` rather than the toggle so the no-JS path is what gets
      measured: zero violations of any impact, twelve page-theme pairs (R35)
- [x] Home JavaScript measured at 184 KB compressed over 8 requests against the
      150 KB target, `motion` still the largest single piece and still loading on
      every route because the intro lives in the root layout. The R33 exception
      André accepted on 2026-08-29 at 177 KB stands on the same grounds, and the
      grounds got stronger: mobile Lighthouse is 98 with LCP 2.5s and TBT 10ms.
      Worth an entry in the post-launch list, not a launch blocker.

### Dependency items carried to U9

- [x] TypeScript 7 re-evaluated and taken: 7.0.2 is `latest` now, not a preview.
      Typecheck, unit tests, lint and an all-static build are all clean on it,
      and `tsc --noEmit` drops from seconds to 0.4s. Dev-only, nothing of it
      reaches the bundle.
- [x] `experimental.turbopackRustReactCompiler` re-evaluated and skipped. Still
      marked experimental in Next 16.3.3 and it buys build time, which is not a
      problem this project has. Revisit when it is stable.
- [x] `app/icon.svg` added, the last of the accumulated U9 items. One SVG with a
      `prefers-color-scheme` rule rather than a set of raster sizes, geometry
      lifted from `components/logo/LogoMark.tsx` minus the weave clips, which
      are invisible at 16px. It is what moves best practices from 96 to 100.
- [x] **No `/favicon.ico` fallback, on purpose.** Every browser honours the
      `<link rel="icon">` Next emits, and unfurlers read the OG image, so the
      only consumers left are the ones that hard-code `/favicon.ico` and ignore
      the document. They get a 404, which is the same 404 the site served on
      every route until today. Revisit if a real unfurl comes back iconless;
      the fix is one committed `app/favicon.ico`, and it needs raster tooling
      this repo does not have.
- [x] The icon is checked twice, because it fails silently either way: an
      unserved one by an e2e assertion on the link the layout emits, and a
      malformed one by `app/icon.test.ts`. That second check earned its place
      immediately, catching a double hyphen inside an XML comment that rendered
      correctly inline in a page and not at all as an icon.
- [x] `tests/e2e/fixtures.ts` narrowed from swallowing every resource 404 to
      swallowing only the document's own, now that the favicon exists.

## 2. Content export (Heroku still running)

- [x] 7 jobs pulled from `https://andrevital-be.herokuapp.com/graphql`
- [x] 1 article pulled from the same endpoint
- [x] Raw export archived outside the repo at
      `~/Documents/work_stuff/av/docs/strapi-export-2026-08-30.json`
- [x] Article cross-checked against
      `content/writing/setting-up-a-multi-package-project.mdx`: identical except
      the two deviations U6 recorded, the `ideaa` typo and the `.gitignore` fence
      tag (not a shiki language). Slug, title, tags and date all match.
- [x] Jobs cross-checked against `content/cv.yaml`. Six of the seven companies
      are present. The differences are all deliberate, `content/cv.yaml` being
      verbatim from the hand-written CV of record
      (`~/Documents/work_stuff/av/docs/cv-2026-08`) rather than from the CMS:
  - Metalab: position updated, CMS says "Sr. Web Engineer", the CV says
    "Sr. Software Engineer"
  - Originate (second stint): CMS still says November 2023 to present and
    "Software Engineer"; the CV corrects it to December 2023 to September 2024
    and "Sr. Software Engineer"
  - QuinTech: 7 CMS bullets condensed to 1 in the CV
  - Yellowpath: 5 CMS bullets condensed to 1 in the CV
  - **Leaf Group (SaatchiArt), October 2022 to January 2023, is in the CMS and
    not in the CV.** Dropped from the hand-written CV, so its absence here is
    inherited, not lost in migration. It is the only CMS fact with no home in
    `content/`. Both bullets, in case it ever goes back in:
    - Developed and tested towards a multi-module platform with the use of tools
      like **Next.js**, **PHP (Zend Framework)**, **MySQL** and multiple **AWS
      Services** (**EC2**, **S3** and **RDS** mainly).
    - Interfaced with UX/UI designers and other developers to build new
      interfaces and ensure the achievement of desired user interaction with
      applications via **Figma**.
- [x] S3 holds exactly one object, `blog_thumbnail_1_abc094c68e.jpg` in
      `andrevital-assets` (us-west-1), the old post's 5507x3098 thumbnail. The
      migrated post has no image, so it has no home in `content/`; archived
      alongside the export as
      `~/Documents/work_stuff/av/docs/strapi-blog-thumbnail.jpg`.
- [ ] André confirms Leaf Group stays off the CV before the Heroku app is deleted

## 3. Vercel

- [ ] Root Directory cleared (the project used to build `packages/frontend`)
- [ ] Install command `pnpm install --frozen-lockfile`, build command `pnpm build`
- [ ] `NEXT_PUBLIC_SECTIONS=writing` on **every** environment, production,
      preview and development alike. Work and Craft are built and off pending a
      rework, and a preview URL is public unless the project protects it, so a
      preview showing them is the same exposure as production showing them.
      `.env.development` still lists all three; local `pnpm dev` is where both
      sections get worked on.
- [ ] Production branch set to `main`
- [ ] Old backend environment variables removed (`NEXT_PUBLIC_GRAPHQL_URL`,
      `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BACKEND_URL`, any AWS or Strapi keys)

## 4. Preview verification

On the preview deployment for the launch pull request, from a cold browser.

- [ ] First-visit intro plays; a second visit in the same tab draws inline (R7, R8, R9)
- [ ] Reduced-motion preference: no intro, static mark
- [ ] Theme toggle persists across a reload, both directions, logo variant correct
- [ ] `/cv.pdf` downloads and opens
- [ ] `/writing` and the post render, `/feed.xml` validates
- [ ] Legacy URLs land on their targets (R38, R39):
  - [ ] `/photo` and `/photo/anything` to `/` (308)
  - [ ] `/develop` and `/develop/anything` to `/` (307, Work hidden)
  - [ ] `/blog` to `/writing` (308)
  - [ ] `/blog/setting-up-a-multi-package-project` to `/writing/setting-up-a-multi-package-project` (308)
  - [ ] `/docs/en/cv.pdf` and `/docs/en/CV.pdf` to `/cv.pdf` (308)
  - [ ] `/about` and `/contact` serve directly, no redirect
- [ ] `/work`, `/craft` and `/craft/logo-draw` 404 identically to an unknown
      route; nav shows Writing only; sitemap lists five URLs with no work or
      craft in them
- [ ] No console errors, favicon included

## 5. Cutover

- [ ] Launch pull request merged to `main` with green CI (R29, R34)
- [ ] andrevital.com and www resolve to the Vercel deployment, HTTPS valid
- [ ] Production smoke: the section 4 list again, on the real domain

## 6. Decommission (irreversible, do with André watching)

Nothing here runs until section 5 is green and section 2 is checked off.

- [ ] Heroku: delete the `andrevital-be` app and its Postgres add-on. No Heroku
      CLI on this machine, so the dashboard, or install it first.
- [ ] AWS: empty and delete `andrevital-assets` (us-west-1). One object, already
      archived. `aws sts get-caller-identity` reports the session expired, so
      this needs a fresh `aws login` first.
- [ ] AWS: revoke the access keys the CMS used. The key id is a Heroku config
      var (`AWS_ACCESS_KEY_ID`), never in the repo, so read it off the Heroku
      dashboard before deleting the app.
- [ ] Confirm `https://andrevital-be.herokuapp.com` no longer resolves
- [ ] Delete the `production` and `chore/google-cloud-migration` branches, local
      and on origin
- [ ] Delete the leftover untracked `packages/backend` and `packages/frontend`
      directories in the working tree (`node_modules` and `public` survivors of
      U1's reset; nothing tracks them)
- [ ] `git grep -i "herokuapp\|strapi\|NEXT_PUBLIC_GRAPHQL_URL"` on `main`
      returns nothing outside this file and the plan

## 7. After

- [ ] Plan U9 ticked with an outcome; Definition of Done re-read against the
      live site
- [ ] Open items that were waiting on the cutover move to their own units: the
      Work rework, the Craft rework, the copy pass, the post rewrite, the
      content sprint
