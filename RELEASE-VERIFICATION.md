# With Keyline — verification scope

## 1.2.0 — Properties and themed calendar, 2026-10-25

All checks use disposable fictional Vaults. No personal Vault was changed.

- Strict TypeScript, production build and **1,424 automated tests** pass.
- **29 native property/calendar checks** pass on macOS Obsidian 1.13.7 with
  Keyline 0.8.28, including light/dark mode, Reading/Live Preview, blank native
  property entry, no unsolicited note writes or focus changes, native property
  editing and undo/redo, mouse and keyboard calendar selection, cancellation,
  datetime preservation, narrow bounds, stale-input dismissal and unload cleanup.
- The calendar changes colour with the active theme. Date selection uses local
  civil dates rather than UTC conversion. Merely opening or navigating the
  calendar does not save a value. Datetime changes require Apply.
- Existing insertion regression: **31 checks** pass with the same theme,
  including `/`, `、`, mention insertion, native undo and dismissal.
- Existing Mobile Beta regression: **36 checks** pass using Obsidian's actual
  mobile startup emulation in the macOS host, light/dark phone/tablet and
  reduced-height layouts. Mobile date fields retain their native picker.
- No renderer exceptions were recorded in the property, insertion or mobile
  runs. `git diff --check` passes. Earlier release checks below are historical,
  not a claim that every desktop feature was retested in this release.

Reproduce with Node.js 22+ and a desktop Obsidian executable:

```sh
node scripts/host-properties.mjs /absolute/path/to/Keyline
node scripts/host-insert-trigger.mjs /absolute/path/to/Keyline
node scripts/host-mobile-beta.mjs /absolute/path/to/Keyline
```

Set `OBSIDIAN_TEST_BINARY` if necessary. Reports/captures are saved under
`evidence/` and are not included in the plugin payload. The blank-row integration
feature-detects Obsidian's internal metadata editor; unsupported hosts keep native
behaviour. Arbitrary plugins/snippets, other desktop systems and physical
Android/Xiaomi/iOS devices remain unverified. Mobile remains Beta; desktop
emulation does not certify real keyboards, WebView/WebKit or mobile lifecycle.

## 1.1.0 — Mobile Beta, 2026-10-24

**Mobile Beta, not physical-device acceptance. No personal Vault was changed.**
Version 1.1.0 enables phone/tablet installation with explicit Beta notices while
retaining desktop functionality. The maintainer explicitly authorized this Beta
rollout before physical-device acceptance; the outstanding checks below are not
being represented as passed.

- Strict TypeScript, production build and **1,354 automated tests** pass.
- The public 1.1.0 package reuses the exact runtime and stylesheet tested as
  1.1.0-beta.1; only release metadata and documentation changed after host checks.
  SHA-256: `main.js` = `48097820afffdc0f60ab8cfdcd29192437a50a71fb5ae12ae8fa9fcb090ad5dd`;
  `styles.css` = `4008eefbbea8e9123b7b4384bd76dd029f56455b4e82a064fa264379a30c3851`.
  Typecheck, all automated tests and the production build were rerun for 1.1.0.
- The mobile host harness passes **36 checks** in a fresh fictional Vault using
  macOS Obsidian 1.13.7's `app.emulateMobile(true)`, with Keyline 0.8.27. It verifies
  the actual mobile startup path, not only a mobile CSS class.
- Light/dark checks cover phone 390×780, tablet 768×1000 and reduced-height
  390×420 viewports: date/page insertion, `/` and `、`, touch selection, callout
  submenu/back navigation, touch target dimensions, menu bounds and native undo.
- Additional checks cover native CDP touch scrolling without insertion,
  repositioning an open menu after a viewport reduction, CDP IME composition
  commits for `@`, `/` and `、`, a basic format command and undo, persistent Beta
  settings text and reachable controls, a note saved to disk, disable/re-enable,
  unchanged stored desktop preferences and zero renderer runtime exceptions.
- A touch retargeting bug found in the first pass was fixed: after opening a
  submenu, the browser's compatibility click must not choose another row under
  the same finger. Unit tests cover cancelled/scrolling gestures, duplicate clicks,
  subsequent independent mouse input, viewport offsets and listener cleanup.
- Desktop regression uses the existing **31-check** insertion harness with the
  same Keyline 0.8.27 theme, light/dark, mouse/keyboard, Chinese filtering,
  undo/dismissal, protected text and preferences. It is not a complete rerun of
  all desktop workspace/drag/third-party combinations.
- Harnesses: `scripts/host-mobile-beta.mjs` and `scripts/host-insert-trigger.mjs`.
  Both accept an absolute Keyline theme directory and create/close their own
  isolated host. Reports, hashes and inspected screenshots are under
  `evidence/mobile-beta/` and `evidence/insert-trigger/` (not plugin payload).

**Outstanding validation:** physical Android/Xiaomi and iOS testing, including
real keyboards/IME candidates, touch selection, file persistence after app restart,
and mobile lifecycle/accessibility. CDP IME and reduced viewport checks do not
simulate an actual OS keyboard or certify Android WebView/iOS WebKit. Test the
release in a separate Vault with backups before using it for important notes.

移动端已完成桌面宿主模拟检查；不是小米、Android 或 iOS 真机验收。
维护者明确授权以移动端 Beta 发布；启用提示与设置页持续说明限制，
桌面设置不被移动端限制覆盖。未完成的真机检查仍如实保留。

## 1.0.2 insertion-trigger update

Added `、` as an alias for the default `/` trigger across query recognition,
menu opening and explicit insertion. Custom triggers keep their existing scope.
No CSS, typography, sidebar, block-drag, mention or persistence implementation
was changed.

- Strict TypeScript checking, all 1,336 tests and the production build passed.
- The development tree's write-disabled source audit reproduced the exact
  release bundle from 64 local source modules and the three Lezer modules.
- A focused native regression passed 31 checks on macOS, Obsidian 1.13.7 and
  the published Keyline theme 0.8.25 in a fresh fictional Vault, in light/dark.
  It covered both triggers after a newline, identical menus, Chinese query
  filtering, actual mouse selection, Enter, native undo, Escape, backspace,
  ordinary punctuation, protected code/frontmatter, whole-query insertion,
  disabled/custom-trigger settings and line-only insertion. No runtime
  exceptions were recorded.
- Harness: `node scripts/host-insert-trigger.mjs /absolute/path/to/downloaded/Keyline`.
  It starts its own disposable Obsidian process; `OBSIDIAN_TEST_BINARY` can
  point at a desktop executable. Reports and captures go under
  `evidence/insert-trigger/` (not shipped with the plugin).
- Native text/key/pointer input was driven through the isolated test process's
  local debugging connection. Physical keyboards, every Chinese IME, mobile
  devices and other operating systems were not tested. The existing composition
  guard remains unchanged; automated checks verify that preedit transactions do
  not open the menu or perform an insertion.

The earlier settings, input-parity and drag checks below describe their stated
release artifacts, not a complete fresh rerun of every feature on 1.0.2.

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
