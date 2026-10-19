# HaloWeb localization — completed language content and static routes

**Languages:** English, Latvian and Russian. English is the canonical source. The translated sites are static pages under `lv/` and `ru/`.

## Editing content and deploying

Edit English source templates in `src/pages/` and shared components in `src/partials/`. Add each English phrase and both reviewed translations to `copy/lv.json` and `copy/ru.json`. Keep `js/locale-data.js` synchronized with those two catalog files.

Regenerate committed static pages using local authoring commands `python tools/build_pages.py` followed by `python tools/localize_pages.py` whenever sources change. Vercel serves the checked-in HTML; it does not run a build or require GitHub Actions.

## Routes

English: `/`, `/alpha`, `/workspace`; Latvian: `/lv/`, `/lv/alpha`, `/lv/workspace`; Russian: `/ru/`, `/ru/alpha`, `/ru/workspace`. The language selector navigates to a real translated page, saves browser preference, and preserves the current page. A directly visited locale URL takes precedence over browser preference. Legacy `?lang=lv` and `?lang=ru` query parameters still work.

Localized pages contain translated copy and metadata, proper document language, canonical links and language alternates. Technical terms, URLs, model names, code identifiers, color tokens and sample-file names remain unchanged intentionally. The five downloadable alpha test files and authentic English-build app screenshots are not translated or visually modified; their explanatory website copy is localized.

The motion JSON and SVG graphics are language-neutral; semantic labels and interactive feedback follow the selected language. Feedback opens an email draft; it does not send anything from the site.

## Editorial and device acceptance

- Review professional Latvian/Russian terminology, inflection and tone with native speakers.
- Check real browsers at 320, 390, 768, 1024 and 1440 px, dark/light theme, 200% zoom and keyboard/screen-reader navigation.
- Verify actual Vercel deployment, localized URLs, all CSS/JS/font/screenshot URLs and downloadable alpha files.
- Revalidate any copy changed by new Android or HaloLinux feature releases and replace authentic dated screenshots only after device testing.

These are source changes committed directly to Git; no GitHub Actions, CI or site build/redeploy was run by the assistant.
