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
- [x] ~~S3 holds exactly one object~~ **Corrected 2026-08-30 against the bucket
      itself:** `andrevital-assets` (us-west-1) holds **12 objects**, 3.6 MB. The
      earlier count came from the CMS media API, which reports one media entry;
      S3 also keeps Strapi's derived sizes and two orphans. What is actually
      there:
  - `blog_thumbnail_1_abc094c68e.jpg` and `blog_thumbnail_1_6dfd24e6ef.jpg`, both
    1.7 MB, uploaded a day apart in July 2024 and **byte-identical to each other
    and to the archived copy** (MD5 `462df1637c47617e1ccfc6db4733a20a`). The
    second is an orphaned re-upload.
  - eight `large_`, `medium_`, `small_` and `thumbnail_` variants Strapi derived
    from those two, nothing unique in them
  - `android_chrome_192x192_771368aa65.png` and `..._c58bc1ff10.png`, identical
    to each other, the old site's 192px PWA icon and the only content that was
    not already archived
- [x] Both unique files now archived outside the repo:
      `~/Documents/work_stuff/av/docs/strapi-blog-thumbnail.jpg` and
      `strapi-android-chrome-192.png`, each verified against its S3 ETag. The
      migrated post has no image, so neither has a home in `content/`.
      The bucket is unversioned and carries no bucket policy, so emptying it is a
      plain recursive delete.
- [x] Leaf Group stays off the CV. André's call at the 2026-08-30 checkpoint: the hand-written CV dropped it deliberately, and the archived export is the record if it is ever wanted back. The decommission is not blocked on it.

## 3. Vercel

- [x] Root Directory cleared (the project used to build `packages/frontend`)
- [x] Install command `pnpm install --frozen-lockfile`, build command `pnpm build`
- [x] `NEXT_PUBLIC_SECTIONS=writing` on **every** environment, production,
      preview and development alike. Work and Craft are built and off pending a
      rework, and a preview URL is public unless the project protects it, so a
      preview showing them is the same exposure as production showing them.
      `.env.development` still lists all three; local `pnpm dev` is where both
      sections get worked on.
- [x] Production branch set to `main`, under Settings, Environments, Production,
      Branch Tracking. It is no longer on the Git settings page.
- [x] Old backend environment variables removed (`NEXT_PUBLIC_GRAPHQL_URL`,
      `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BACKEND_URL`, any AWS or Strapi keys).
      `NEXT_PUBLIC_SECTIONS` is now the project's only environment variable.
- [x] **`NODE_ENV=production` deleted**, a 2022 leftover, and the reason the
      first production build failed. pnpm reads it during install and skips
      devDependencies, so `tsx` was absent and `prebuild`'s `pnpm cv` died with
      `tsx: command not found` eleven seconds in. Preview builds never hit it
      because they restore a warm `node_modules` cache; the Production
      environment keeps its own cache and installed cold, which is why the very
      first build in it was the one to break. Next sets `NODE_ENV=production`
      for `next build` itself, so the draft filter in `lib/content.ts` is
      unaffected, and nothing else in the repo reads it.

## 4. Preview verification

Run against the preview for the launch pull request, PR #71, at
`andrevital-git-feat-launch-andr-vitals-projects.vercel.app`, from a cold
browser in both Chromium and WebKit.

- [x] First-visit intro plays and settles; a second visit in the same tab is
      inline (R7, R8, R9). Both engines.
- [x] Reduced-motion preference: no drawing at all. Both engines.
- [x] Theme toggle persists across a reload. Both engines.
- [x] `/cv.pdf` serves, and `/about` links it
- [x] `/writing`, the post, `/feed.xml` and `/sitemap.xml` all serve
- [x] Legacy URLs land on their targets (R38, R39):
  - [x] `/photo` and `/photo/anything` to `/` (308)
  - [x] `/develop` and `/develop/anything` to `/` (307, Work hidden)
  - [x] `/blog` to `/writing` (308)
  - [x] `/blog/setting-up-a-multi-package-project` to `/writing/setting-up-a-multi-package-project` (308)
  - [x] `/docs/en/cv.pdf` and `/docs/en/CV.pdf` to `/cv.pdf` (308)
  - [x] `/about` and `/contact` serve directly, no redirect
- [x] `/work`, `/craft` and `/craft/logo-draw` all 404, the same as an unknown
      route, and the sitemap lists exactly five URLs, canonical to
      `andrevital.com`, with no work or craft among them
- [x] No console or page errors on any route, in either engine. `/icon.svg`
      serves as `image/svg+xml`.
- [x] Eyes on it. Done against the live site rather than the preview, 2026-08-30,
      after the cutover.

The Vercel environment variables were already right on this preview:
`NEXT_PUBLIC_SECTIONS=writing` was set on all three environments during U8, and
this run is the second confirmation of it. Section 3 is a re-check, not a
change, except for the Root Directory and the old backend variables.

## 5. Cutover

Merging to `main` is not itself the cutover. As of 2026-08-30 andrevital.com
still serves the old site, titled "André Vital | Software Developer /
Photographer", because the Vercel project's production branch is still
`production`. **Section 3 is what flips the domain**, and it can only be done
from the Vercel dashboard or an authenticated CLI; `vercel whoami` on this
machine hangs on a login prompt.

- [x] Launch pull request merged to `main` with green CI (R29, R34), PR #71
- [x] Production branch pointed at `main` and the deployment promoted, 2026-08-30.
      Worth knowing that **Promote to Production rebuilds rather than
      re-aliasing**: the promoted artifact is a fresh build of the same commit in
      the production environment, not the preview build being pointed at the
      domain. That is why the `NODE_ENV` variable above could break a promote of
      a deployment that was already green. andrevital.com kept serving the old
      deployment throughout the failure, Vercel leaving the previous production
      alias in place when a build errors.
- [x] andrevital.com and www resolve to the new site, HTTPS valid. www 308s to
      the apex, the apex serves `main` at `1c586a1`, certificate is Let's
      Encrypt, valid to 2026-09-29 and auto-renewing.
- [x] Production smoke: the section 4 list again, on the real domain. All five
      routes 200, `/cv.pdf` as `application/pdf`, `/feed.xml`, `/sitemap.xml` and
      `/icon.svg` with their own content types, every legacy redirect landing on
      its target with the same status codes the preview gave, `/work`, `/craft`
      and `/craft/logo-draw` 404 the same as an unknown route, and the sitemap
      exactly five URLs canonical to andrevital.com. In both Chromium and WebKit
      against the live domain: the first visit draws and hands over, a second
      visit in the same tab is inline, reduced motion draws nothing, the theme
      survives a reload, and no route logs a console or page error.

## 6. Decommission (irreversible, do with André watching)

Nothing here runs until section 5 is green and section 2 is checked off.

- [x] Heroku: delete the `andrevital-be` app and its Postgres add-on. Done from
      the dashboard on 2026-08-30.
- [x] AWS: empty and delete `andrevital-assets` (us-west-1). Twelve objects, not
      one; see the corrected inventory in section 2. `ListObjectsV2` now returns
      `NoSuchBucket`.
- [x] AWS: revoke the access keys the CMS used. The key id is a Heroku config
      var (`AWS_ACCESS_KEY_ID`), never in the repo, so read it off the Heroku
      dashboard before deleting the app. Read off on 2026-08-30:
      `AKIAYKEGDXQXQG4FHJE7`, the only key on IAM user `dev`, created
      2022-05-06 and last used 2024-07-18 against S3 in us-west-1. `dev` has no
      user policies of its own and one group, `Developers`, of which it is the
      only member, and that group grants `AmazonEC2FullAccess`,
      `AmazonRDSFullAccess` and `AmazonS3FullAccess`. So the key that sat in a
      Heroku config var could do far more than upload images, which is reason to
      delete the user and the group rather than only the key.
      Done 2026-08-30: the key is deleted, `Developers` is deleted, and `dev` now
      holds no keys, no groups and no policies of any kind. **The `dev` user
      itself is still there**, `delete-user` having not taken; it has no MFA, no
      SSH keys and no service-specific credentials, which leaves a console login
      profile as the only likely blocker. To finish:
      `aws iam delete-login-profile --user-name dev` (skip on `NoSuchEntity`),
      then `aws iam delete-user --user-name dev`. The account's other user,
      `Administrator`, is unrelated and stays.
- [x] Confirm `https://andrevital-be.herokuapp.com` is gone. Worth correcting how
      this was written: the hostname still **resolves**, because `*.herokuapp.com`
      is a wildcard onto Heroku's shared ingress (`va02.ingress.herokuapp.com`).
      What changed is the response, 400 from a live Strapi before, Heroku's own
      404 for an unknown app after. The response is the check, not DNS.
- [x] Delete the `production` and `chore/google-cloud-migration` branches, local
      and on origin. Done 2026-08-30; tips were `6ca9f5d` and `8c8e20c` if either
      is ever wanted back, and GitHub still offers Restore branch for a while.
      A `git remote prune origin` afterwards showed every U4 to U8 feature branch
      was already deleted on origin too, so the remote is now `main` alone.
- [x] Delete the leftover untracked `packages/backend` and `packages/frontend`
      directories in the working tree. 143 MB, and inspection before deleting
      found nothing but `node_modules` and four `.DS_Store` files; the `public`
      survivor held no assets.
- [x] `git grep -i "herokuapp\|strapi\|NEXT_PUBLIC_GRAPHQL_URL"` on `main`
      returns only this file, the plan and `README.md:94`, which points here for
      the decommission record. No code reference survives.

## 7. After

- [x] Plan U9 ticked with an outcome; Definition of Done re-read against the
      live site, where every line holds. Production mobile Lighthouse for the
      record: `/` 98, `/about` 98, `/contact` 100, `/writing` 96, the post 98,
      each with 100 / 100 / 100 in the other three, so R33 holds on the real
      domain and not only on a local build. R23 holds too, `career-ops/cv.md`
      being a symlink to `content/cv.md`.
- [x] Open items that were waiting on the cutover move to their own units: the
      Work rework, the Craft rework, the copy pass, the post rewrite, the
      content sprint. All nine survivors are carried in the 2026-08-30 cutover
      session note in the vault, one live checkbox each.
- [x] Eyes on the live site. André's pass, 2026-08-30, on andrevital.com itself.
- [x] `aws iam delete-user --user-name dev`. Done 2026-08-30; IAM is back to
      `Administrator` and the `Administrators` group, both unrelated to the CMS.
