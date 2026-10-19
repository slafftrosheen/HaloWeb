# HaloWeb localization status — 20 October 2026

This implementation has a working EN / LV / RU selector and browser-local language persistence. It is a **progressive localization**, not a claim that all 12 public pages are fully translated and proofread.

## Sources and runtime

- English is the canonical source in `src/pages/` and `copy/en.json`.
- Curated Russian/Latvian phrase translations live in `copy/ru.json` and `copy/lv.json`; `js/locale-data.js` is their deployable bundled copy.
- `js/i18n.js` translates safe text nodes and accessible labels, preserves element structure and icons, updates the document title, keeps the chosen language across internal navigation via `?lang=lv` or `?lang=ru`, and leaves untranslated source copy in English.
- Interactive progress, Canvas confirmations and feedback drafts use the same translation API. The feedback form remains a local mailto draft, never a confirmed message.
- Existing Lottie JSON is language-independent. Its surrounding labels and live-region messages are translated, not artwork baked into images.
- No translation cloud service, analytics SDK or network request is used. Visitor preference remains in browser localStorage.

## Coverage

Core navigation, footer, Hero, product introductions, major page headings, common status labels, model roles/comparison, Kids, Privacy, Voice, the test-kit workflow and interactive feedback are covered by curated pairs. **Not all long descriptions, all test-instruction prose, metadata descriptions and technical paragraphs have been translated.** English fallback is deliberate rather than misleading visitors with unsupervised automatic translation.

## To finish

1. Review and translate each remaining text node in all 12 public pages and the optional `kit.html` guide; review current-build terminology, spelling, tone and Latvian inflection with native readers.
2. Add full language-specific accessibility copy, non-visual captions and form validation messages, including browser-native validation behavior and long feedback template instructions.
3. Create standalone localized static pages (`/lv/`, `/ru/`) and localized metadata/hreflang after copy is fully reviewed. The query-string runtime approach is an interim user-accessible translation layer.
4. Review layouts with real LV/RU text at 320, 390, 768, 1024 and 1440 px, 200% zoom, keyboard navigation, reduced motion and dark/light themes.
5. Keep all real application screenshots verbatim (do not translate pixels); replace with separately captured localized real screens only when the Android build and evidence are available.

Never market partial strings as complete localization. Commit localized phrase additions in both JSON catalogs and the JS bundle in one atomic commit.
