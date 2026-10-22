# With Keyline 1.0.0 — verification scope

## 1.0.1 Community submission patch

Replaced the four direct settings-heading creation sites with Obsidian's native
`Setting.setHeading()` component, retaining the left tabs and grouped right pane.
No editor, mention, block-drag, persistence or workspace behaviour was changed.
Strict typecheck, all 1,302 tests, production build and the 48-capture bilingual,
light/dark, wide/narrow native settings check were rerun and passed. The new
production bundle also passed the write-disabled source audit. The earlier
input/drag checks below describe the 1.0.0 artifact, not a fresh rerun on 1.0.1.

## 1.0.0 baseline

Validated on macOS with Obsidian 1.13.7 and the published Keyline theme 0.8.24.
All host testing used disposable fictional Vaults, not personal notes.

- Strict TypeScript checking, 1,302 automated tests and production build passed.
- A write-disabled source audit reproduced the production bundle from 64 local
  source modules and three Lezer modules. Host dependencies remain external.
- The final settings layout was exercised in English and Chinese, light and dark,
  at 1,200px and 760px window widths: six categories per combination (48 captures).
  The desktop left navigation, grouped right pane, narrow dropdown, search/Escape
  and all 16 typography sliders were checked in the actual Obsidian settings UI.
- The final artifact passed the native input-regression harness for mention
  continuation, list/checkbox geometry and paragraph spacing after lists, compared
  against the original integrated companion with the same Keyline theme.
- Folding controls and block handles passed native hit-area checks in light/dark,
  wide/narrow windows, including real drag-and-undo checks.

This is not a claim of zero defects or of pixel-identical behaviour in every
theme/Obsidian version. iOS, Android, Windows and Linux were not physically tested
for this release. The manifest intentionally limits this version to desktop.
Community review is a separate result from these local checks.

The original GitHub companion remains available as a fallback. Main everyday
features are broadly equivalent, but the implementations and settings are not
interchangeable. Disable one before enabling the other.
