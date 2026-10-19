# Halo web — interaction & motion storyboard

Contract: one play per event · no permanent loops · paused off-screen and in background tabs · reduced motion = static SVG, Lottie never loads · no-JS = final state of every sequence · no tilt/parallax · no layout shift.

## M01 · Hero · Open Ring entrance (Home)

- **Source:** assets/brand/lottie/halo_hero_ring_intro_{theme}.json → frames 0–60, then halo_orb_idle.svg
- **Decision:** Rework (was: 2 s intro + infinite loop)
- **Trigger:** First view of Home, once per browser session (sessionStorage)
- **Duration:** 2.0 s (60 f @ 30 fps), then 240 ms crossfade
- **Easing:** Lottie timing; crossfade ease-standard
- **Interaction:** None — decorative, aria-hidden
- **Final state:** Static canonical ring (gap 45°, rounded ends) — holds forever
- **Reduced motion / no JS:** Static SVG from first paint; Lottie never loads
- **Mobile:** ~2 KB JSON; SVG renderer; skipped entirely on repeat visits

## M02 · Ask → act → know · journey stepper (Home, How it works)

- **Source:** assets/brand/orb/lottie/halo_orb_{listening,thinking,approval_required,acting,waiting}.json
- **Decision:** Reuse
- **Trigger:** Visitor presses a step, or ‘Play the five steps’
- **Duration:** Each ring plays once (2–4 s); auto-play advances every 2.6 s and stops after step 5
- **Easing:** Lottie native; figure swap instant
- **Interaction:** Buttons with aria-pressed; Pause button while playing (WCAG 2.2.2); live region announces ‘Step n of 5’
- **Final state:** Step 5 = WAITING ring + the real ‘effect not verified’ capture — never SUCCESS
- **Reduced motion / no JS:** All steps and all figures visible as a list; no auto-play
- **Mobile:** Rings mount only when pressed; ≤5 small JSONs

## M03 · Outcome states legend

- **Source:** icons.svg (task, approval, act, check, failure, unverified)
- **Decision:** Reuse (static)
- **Trigger:** —
- **Duration:** —
- **Easing:** —
- **Interaction:** —
- **Final state:** Static
- **Reduced motion / no JS:** Same
- **Mobile:** Zero cost

## M04 · Canvas draft · Keep / Discard sample (Workspace)

- **Source:** DOM cards + SVG link; dashed draft styling (Lottie halo_fx_draft_drawon available for the outline)
- **Decision:** New (DOM) + Reuse
- **Trigger:** Keep or Discard pressed
- **Duration:** 420 ms
- **Easing:** ease-out (.2,.7,.2,1)
- **Interaction:** Keep → card turns solid, link turns solid, status ‘Kept…’. Discard → draft fades and scales to 96 %, status ‘Discarded…’. ‘Show the draft again’ resets.
- **Final state:** Saved state appears ONLY after Keep; never before
- **Reduced motion / no JS:** Draft shown as dashed with buttons disabled and a ‘Sample’ label
- **Mobile:** No images; pure CSS transitions

## M05 · Voice states (Home band, Voice page)

- **Source:** halo_orb_{listening,capturing_voice,speaking,stopped}.json
- **Decision:** Reuse
- **Trigger:** ‘Show the four states’ pressed (Voice); Listening ring plays once when visible (Home)
- **Duration:** 2.2 s per state, max 2 loops while active, then holds
- **Easing:** Lottie native
- **Interaction:** Live region names the state; button disabled while playing
- **Final state:** All four cards static, none highlighted
- **Reduced motion / no JS:** Four static stills with text
- **Mobile:** Waveform-style motion only inside ‘Writing it down’ and ‘Speaking’

## M06 · Learning ladder (Workspace Study, Kids homework)

- **Source:** DOM rungs; optional halo_fx_learn_advance_{theme}.json on the last rung
- **Decision:** New (DOM) + Reuse
- **Trigger:** ‘Next step’ pressed
- **Duration:** 240 ms border/fill change
- **Easing:** ease-standard
- **Interaction:** One rung at a time; ‘Start over’; live region names the step
- **Final state:** Current rung outlined (Deep Mint / Apricot in Kids); reached rungs solid; others dashed
- **Reduced motion / no JS:** Full ladder visible as an ordered list
- **Mobile:** No rewards, no confetti, no loops

## M07 · Kids ring (Home Kids teaser, Kids page)

- **Source:** assets/brand/kids/lottie/halo_kids_orb_idle_{theme}.json + kids SVG stills
- **Decision:** Reuse
- **Trigger:** Comes into view (40 %)
- **Duration:** one play (≈4 s)
- **Easing:** Lottie native
- **Interaction:** None
- **Final state:** Kids idle still (warm ring)
- **Reduced motion / no JS:** Still
- **Mobile:** Never a recoloured adult ring

## M08 · Host diagram (Devices)

- **Source:** Inline SVG, CSS stroke-dashoffset
- **Decision:** Rework (replaces halo_near_to_far / pairing_signal)
- **Trigger:** Diagram 35 % visible, once
- **Duration:** 1.6 s
- **Easing:** ease-out
- **Interaction:** None
- **Final state:** Dashed ‘planned’ paths at rest; ‘PRIVATE SYNC · PLANNED’ label always visible
- **Reduced motion / no JS:** Paths static from first paint
- **Mobile:** SVG < 2 KB; list layout replaces SVG under 640 px

## M09 · Presence studio (Design page)

- **Source:** 12 orb Lotties + stills
- **Decision:** Reuse
- **Trigger:** Each ring plays once when it scrolls into view
- **Duration:** 2–4 s
- **Easing:** Lottie native
- **Interaction:** None (design files, labelled)
- **Final state:** Still frames
- **Reduced motion / no JS:** Stills
- **Mobile:** Lazy — only rings in view load

## M10 · Section reveal

- **Source:** CSS (.reveal)
- **Decision:** Reuse (halo-fx reveal, simplified)
- **Trigger:** Section enters viewport (−8 % margin)
- **Duration:** 600 ms
- **Easing:** ease-out
- **Interaction:** None
- **Final state:** Fully visible
- **Reduced motion / no JS:** Always visible; applied only after JS is ready, so content never stays hidden
- **Mobile:** Opacity + 12 px translate only; no layout shift

## M11 · Header

- **Source:** CSS
- **Decision:** New
- **Trigger:** Page scrolls > 8 px
- **Duration:** 160 ms
- **Easing:** ease-standard
- **Interaction:** —
- **Final state:** Hairline under the header
- **Reduced motion / no JS:** Same
- **Mobile:** Backdrop blur; disable if it costs frames on low-end phones

## M12 · Background behaviour (all motion)

- **Source:** site.js
- **Decision:** New
- **Trigger:** Tab hidden / element off-screen
- **Duration:** —
- **Easing:** —
- **Interaction:** —
- **Final state:** lottie.freeze() in background tabs; off-screen rings pause
- **Reduced motion / no JS:** —
- **Mobile:** Saves battery; no permanent loops anywhere

## Retired assets

- `halo_scroll_cue` — Decorative permanent loop
- `halo_workspace_flow` — Replaced by the interactive Keep/Discard sample
- `halo_feedback_sent` — Implied ‘sent’; the site only opens a mail draft — status text says so instead
- `halo_near_to_far, halo_pairing_signal` — Replaced by the labelled SVG host diagram
- `halo_runtime_pipeline` — Developers page uses a static layered list
- `halo_honest_status` — Replaced by the static outcome legend; success only appears for Confirmed
- `4 video shorts + posters` — Built from design references — removed
- `assets/photos/* (7 scenes)` — Generated imagery — removed