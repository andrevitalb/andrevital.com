# CV format

`content/cv.yaml` is the only place CV facts live in this repo. Three things
render from it and nothing else holds a copy:

| Output           | Written by                | Consumer                          |
| ---------------- | ------------------------- | --------------------------------- |
| The About page   | `components/cv/CvTimeline.tsx` | andrevital.com/about         |
| `public/cv.pdf`  | `scripts/build-cv.tsx`    | the "Download CV" link            |
| `content/cv.md`  | `scripts/build-cv.tsx`    | career-ops                        |

The PDF's typography follows the CV of record; see `assets/fonts/README.md` for
which faces stand in for its Georgia and Tahoma, and why.

`public/cv.pdf` is generated and gitignored. `content/cv.md` is generated **and
committed**, because career-ops reads it from a checkout rather than from a
build.

## Editing

Edit `content/cv.yaml`, then run `pnpm cv` and commit the regenerated
`content/cv.md`. `pnpm build` and `pnpm dev` both run it for you. The script
validates first and exits non-zero on any problem, so a bad edit fails the
build rather than shipping a stale PDF or a CV link that 404s.

## Fields

```yaml
profile:
  name: String
  headline: String          # PDF metadata subject
  location: String
  email: String             # must be a valid address
  links:                    # rendered in the PDF header and the cv.md contact block
    - label: String         # becomes the "**Website:**" style label in cv.md
      url: String           # must be absolute; the protocol is stripped for display

summary: String             # "Professional Summary" in cv.md; not in the PDF or on About

experience:                 # newest first; the order here is the order everywhere
  - company: String
    url: String             # optional. Omit it and the company renders as plain text
    position: String
    location: String
    start: { month: 1-12, year: Number }
    end: { month: 1-12, year: Number }   # omit only when `present: true`
    present: Boolean        # exactly one of `end` or `present: true`, never both
    bullets: [String]       # at least one

education:
  - degree: String
    institution: String
    location: String        # optional; the PDF sets it opposite the degree, as
                            # the CV of record does. cv.md omits it, since it
                            # repeats the city the institution is named after
    abbreviation: String    # optional; About's fact column uses it in place of
                            # the full institution name, the CV outputs never do
    graduated: { month: 1-12, year: Number }

languages:
  - name: String
    level: String

skills:                     # cv.md only; the PDF and About omit it
  - label: String
    items: String           # a comma-separated list, kept as one string on purpose

references: String
```

An entry with neither `end` nor `present: true`, or with both, fails validation
by company name rather than by array index.

### Emphasis

Bullets may use `**bold**`. It is the only marker the parser understands, and it
carries through to all three outputs: literal `**` in `cv.md`, `Helvetica-Bold`
runs in the PDF, `<strong>` on About. Anything else, including an unclosed
`**`, passes through as plain text.

## The career-ops contract

career-ops reads `cv.md` as prose, so the guarantee it needs is structural, not
schematic: headings per company, the position in bold on its own line, the
period on the line under it, bullets verbatim underneath. `lib/cv.test.ts`
pins the whole document against `lib/__fixtures__/cv/expected.md` byte for
byte, so any change to that shape is a deliberate, reviewed one.

Bullets in `cv.yaml` are the hand-written CV's own words. career-ops tailors an
application by reordering and selecting them, never by rewording them, so a
rewrite belongs here in the source and nowhere downstream.

Point career-ops at this file rather than copying it:

```sh
ln -sf ~/Documents/work_stuff/av/andrevital.com/content/cv.md \
       ~/Documents/work_stuff/av/career-ops/cv.md
```
