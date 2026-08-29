# Fonts for the generated CV

`scripts/build-cv.tsx` reads these off disk. They are vendored rather than
fetched so the build needs no network, and they are not served to the web: the
site's own faces come from `next/font` and are unrelated to these.

| File                | Family    | Stands in for | Licence |
| ------------------- | --------- | ------------- | ------- |
| `Gelasio-*.ttf`     | Gelasio   | Georgia       | OFL 1.1 |
| `OpenSans-*.ttf`    | Open Sans | Tahoma        | OFL 1.1 |

The CV of record (`~/Documents/work_stuff/av/docs/cv-2026-08`) is set in Georgia
and Tahoma. Neither can ship here: they are Microsoft's, they are not among the
fourteen fonts a PDF viewer must provide, and `@react-pdf/renderer` can only
reference a face it can embed. Gelasio is metric-compatible with Georgia, so the
headings match closely. Tahoma has no open equivalent; Open Sans is the nearest
humanist sans and runs slightly wider, which is why the generated PDF needs a
smaller body size than the original to hold one page.

Both were downloaded from Google Fonts. To refresh a weight, take the TTF the
`css2` API points at for that family and replace the file in place.
