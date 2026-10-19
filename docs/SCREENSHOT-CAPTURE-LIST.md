# HaloWeb — required authentic screenshots

Source: Picsart Quiet Light handoff, `halo-web-quiet-light/docs/screenshot-map.csv` (19 October 2026). This list is for capturing **evidence**, not designing fake product screens. New images must originate from an actual running version of Halo and be associated with a recorded app version and date. The website is English-first during screenshot capture; Latvian/Russian localized screenshots are later optional additions.

## P0 · Core website launch captures

| ID | Source | Required state | Evidence notes |
|---|---|---|---|
| SR-01 | Home, dark | Real current-build idle Home screen | Full phone frame, no cropping, no private chat, UI controls fully visible |
| SR-02 | Home, light | Same idle state, light theme | Match SR-01 geometry, ideally same device/build |
| SR-03 | Home, voice | Speech transcription visibly updating; keyboard closed | Distinguish listening from AI already generating an answer |
| SR-04 | Phone action approval | Approval sheet naming the exact operation and target | No spoofed approval, use harmless test action |
| SR-06 | Activity receipt | Action actually confirmed by the receiving system | No 'success' label if completion has not been checked |
| SR-07 | Activity receipt | Dispatched but effect not verified | Show honest uncertainty, replace October 13 interim capture |
| SR-11 | Notebook | Current English Notebook library with notes/files/collections | No private notes; replace old tools screen |
| SR-13 | Canvas | AI suggestion visibly marked as draft; Keep/Discard shown | Suggestion not saved before Keep |
| SR-16 | Study | New lesson/topic/source selection | Use synthetic or harmless example material |
| SR-21 | Intelligence | Model roles and where Halo answers | Avoid exposing API keys and any private endpoint |

## P1 · Subsequent states, capture only when functional

| ID | Source | Required state | Evidence notes |
|---|---|---|---|
| SR-05 | Phone action | Action in progress with Stop visible | Do not stage a fake completion |
| SR-10 | Native Android assistant | Halo over another neutral app | Physical validation required before public depiction |
| SR-12 | Voice dictation | Draft transcription and Use / Edit / Discard controls | No background recording implication |
| SR-17 | Study | Actual explanation/practice/hint interaction | Show source, question and learner response |
| SR-19 | Read aloud | Audio control bar, spoken-answer state and Stop | Use a supported language/voice pack |
| SR-25 | Kids homework | Photo of exercise then first hint | Only once Kids workflow is in a public, validated build |
| SR-30 | HaloLinux | Real `halo-node status` or `halo-node doctor` terminal | 16:10 frame, at least 1600 px wide, remove user, host, IP, tokens |

## P2 / future public builds

| ID | Source | Required state |
|---|---|---|
| SR-18 | Study review | Explanation recap, review or knowledge check |
| SR-24 | Kids Home | The actual child-facing Home experience |
| SR-26 | Kids reader | Story/read-along with spoken text state |
| SR-27 | Kids permissions | A genuine grown-up approval gate |

The four Kids captures are **not** a prerequisite to launch the public website; show its approved brand illustration with **In development** until such an app build exists. The Linux capture is not evidence of Android ↔ Linux peer sync, which is still planned.

## File and acceptance rules

- Android: capture 1080 × 2400 (or native phone resolution), portrait PNG, whole screen, without masking/reconstructing UI pixels; remove sensitive content before capture.
- Hero uses distinct dark and light captures; ideally same scenario and same build. Keep text legible at 320/390/768/1440 px responsive widths without hard crops.
- Linux: 16:10 or wider screenshot at ≥1600 px, real terminal text, no personally identifying machine details.
- Suggested filenames: `halo-home-idle-dark-YYYYMMDD.png`, `halo-home-idle-light-YYYYMMDD.png`, `halo-approval-reminder-YYYYMMDD.png`, `halo-notebook-library-YYYYMMDD.png`, etc.
- After capture, generate optimized 480 / 720 / 1080 WebP and 720 JPG variants (see `tools/build_pages.py` capture recipe); retain full PNG source externally/in source assets for provenance.
- Replace `data-capture-key="SR-xx"` brand illustrations or interim dated images only after the exact corresponding capability and screenshot state are physically verified. Update source and compiled HTML, SHOTS inventory, captions and `CONTENT-SOURCES.md` together.
- Do not infer action completion from screen layout alone; never add passwords, tokens, API keys, user photos or private data to public screenshots.
