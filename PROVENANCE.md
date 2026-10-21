# Implementation provenance

## Boundary

This is a newly created project, not a history rewrite of the existing companion.
The previous Keyline companion and upstream projects remain intact. No runtime
module or configuration migration was copied from them into this project.
At the user's explicit request, the four original MIT-licensed Keyline Icons
assets and accepted identity palette are retained; these are not newly authored
artwork. The source commit, attribution and licence remain in the bundle notice.
The build uses new project-local modules, the official `obsidian` and
CodeMirror host APIs, and the independently maintained Lezer Markdown parser.
It has no dependency on either upstream plugin.

The work uses the user's feature descriptions, earlier screenshots, known failure
cases, and official Obsidian type declarations as requirements. The old README,
settings/data contracts, insertion catalogue and existing theme token names were
also inspected to define feature parity. These are references, not transplanted
runtime modules. Prior familiarity with the old implementation is not denied.
This is **not a formal clean-room
certification**, nor proof that a Community reviewer will accept an independent
submission. Do not describe cosmetic renaming or mechanical source translation
as independent authorship.

## Inventory

The 2026-10-22 media follow-up reproduced ignored hover events on Obsidian's
rendered image widget using a fictional 96-by-48 SVG. The rewrite now observes
pointer movement on its own editor content in capture phase, retaining native
widget controls and its existing document/unload cleanup. No legacy source was
transplanted. The bounded native gate additionally exercises image/embed/link
and blank-line movement with exact source, native rendering and undo/redo checks.
This is not evidence of support for every third-party media renderer or physical
trackpad input. Original icon assets, styles, dependencies and settings stay fixed.

The 2026-10-21 native-identity follow-up inspected the integrated
`fileIconModel.ts`, `fileIconManager.ts`, `nativeFileExplorer.ts`,
`nativeFileExplorerModel.ts`, retained SVG asset table and narrow identity/tag
stylesheet rules. These defined the existing selection-colour contract, type
badge palette and the distinction between document and tool tabs. The rewrite's
owned inline-token bookkeeping and sibling tab presentation were implemented
here. Paired native observations, not copied host/runtime code, exposed SVG
accumulation caused by inserting decorations into core's rendering container.
The new sibling arrangement leaves that container's children to core. The
original image path retains this project's explicit even-odd fill; the old
renderer omitted it, obscuring the cutouts. No replacement icon library is used.

The workspace follow-up read the integrated `workspaceSwitcher.ts`,
`workspaceMenu.ts`, `workspaceMenuPosition.ts`, `workspaceLayouts.ts`, locale
messages and scoped switcher/menu CSS as requirements. The new controller uses
the rewrite's SDK Scope integration and a separately authored transaction port,
sequence-numbered two-slot recovery journal, JSON-normalized stale-state guards
and core save/read-back verification. Button/menu dimensions and appearance
tokens intentionally reproduce the observed integrated UI. Runtime modules
were not transplanted. This is reference-informed work, not a clean-room claim.
Paired hosts exposed an actual false-stale regression: native getLayout returns
optional undefined fields that JSON snapshots omit. Both sides of the independent
state comparison now use the same serialized layout representation. Recovery
files are development-local; no automatic old-plugin data migration is added.

The explicit 0.7.4 settings-transfer pass inspected the integrated settings
interface/defaults, file-icon model, theme-layout field declarations and insert
registry IDs/default order. The displayed source ranges also included adjacent
settings UI, icon normalizers and insertion resolver/reorder code; those sources
were seen, not transplanted. Narrow `settings.enabled` usages established that
it is an editing master, not only a handle toggle. The new typed field mapper,
issued-preview transaction model, immutable checksummed raw snapshots, rollback
guards and native file-selection modal are independently authored here. This
continues the reference-informed boundary above, not a clean-room claim. Source
copies are selected explicitly; the old runtime and personal Vaults stay intact.

| Area | Origin / boundary |
| --- | --- |
| `src/domain/*` | Newly authored preference, mention, insertion, file-kind, formatting, writing-analysis and block-operation rules; standard syntax parsing delegates to Lezer, with local opaque Obsidian syntax guards |
| `src/platform/*` | Newly authored Obsidian adapters, lifecycle and verified persistence |
| `src/main.ts`, `src/settings.ts`, `src/strings.ts` | New composition, native controls and bilingual messages |
| `styles.css` | New namespaced styling; identity colours and 16px/paint contracts preserve the accepted previous appearance, not a copied theme stylesheet |
| `src/assets/identity-icons.ts` | Four Keyline Icons SVG geometries, MIT, pinned at `14cd695f3f2bbe320bbe7a01e65b251df7ba52cf`; not claimed as original artwork |
| Icon adapter | New owned-slot renderer/picker, using the four retained geometries plus Obsidian's SDK Lucide inventory, without registering or replacing native glyphs |
| Tests | New behavioural assertions and fictional fixtures |
| Host-test infrastructure | Independently scoped CDP test harness using the suite's established temporary-instance testing approach |
| Parser dependency | `@lezer/markdown` 1.8.0, `@lezer/common` 1.5.3 and `@lezer/highlight` 1.2.5; licences retained in THIRD-PARTY-NOTICES.txt and the bundle banner |
| Toolchain | Pinned public Obsidian SDK, CodeMirror peer types, TypeScript, esbuild and Node types |

The public SDK (including its Moment date formatter) and CodeMirror state/view/language modules are external at runtime. The
parser libraries are bundled (they do not render UI). Reference:
https://github.com/lezer-parser/markdown — now maintained at
https://code.haverbeke.berlin/lezer/markdown.
Dependency lockfile provenance is separate
from original source provenance; ordinary dependencies still keep their own
licences.

Writing decorations follow the [official editor-decoration API](https://docs.obsidian.md/Plugins/Editor/Decorations)
and installed CodeMirror type declarations. `@codemirror/language` 6.11.3 is pinned
for development and external at runtime; its transitive development packages are
not added to the production bundle. Native parser-token observations came only
from fictional notes. A short host call site was inspected to diagnose its
deferred selection correction; no host implementation was copied.
The fullwidth comparison also tested the host with the development plugin
disabled. The new implementation leaves those native behaviours intact rather
than suppressing them through transaction-filter bypasses.

Block-handle behaviour references the old settings declarations/defaults only:
left side, optional pinned/fold/plus controls, 90 ms hover and 260 ms hide delay.
No old handle or drag runtime was read or transplanted in this implementation.
The new adapter uses the installed public CodeMirror view/language declarations
for geometry, native fold effects and lifecycle, with project-local structural
edit plans. Browser drag validation uses the official
[Chrome DevTools Input protocol](https://github.com/ChromeDevTools/devtools-protocol/blob/master/pdl/domains/Input.pdl)
against only the independently launched fictional Vault.

Cross-level relocation and block keyboard rules are new domain modules. They
use parsed containment, original/destination content signatures, explicit
indentation plans and fresh parsing before changing a document. The old
`blockKeys` default and its select-all/Backspace behaviour were treated as a
feature contract; no old keyboard or relocation implementation was copied.
Native checks cover actual Cmd+A/Backspace events as well as editor commands.

The optional line-drag requirement was checked against the old bilingual
`dragGranularity` labels/default, the range-resolution contract in `dragRange.ts`
and its line/selection tests. Those references were read; they were not
transplanted. The new implementation indexes logical lines and reparses candidate
orders, comparing stable line identities, semantic ownership and intact multiline
groups. Exact whole-block line selections reuse this project's independent
relocation planner for horizontal nesting. Settings, stale-context checks,
undo and menu controls use the new project's existing adapters.

The structured conversion planner is newly authored against this project's
feature inventory, existing simple-conversion contract and the installed Lezer
syntax model. No old conversion runtime was read or transplanted for this
extension. It projects explicit structural-prefix removals, proves the payload's
syntax, wraps the requested target, then checks the entire candidate's unaffected
nodes and item/quote ownership. Group conversion reuses the new adapter's
snapshot validation and one-edit commit. Native test fixtures are fictional;
they exercise the real picker and toolbar instead of substituting domain tests
for host acceptance.

Expanded formatting references the old public/settings labels and the colour
and selection-formatting tests as behavioural/data-format contracts. No old
toolbar runtime or stylesheet was copied. New pure edit plans implement
independent text/background channels, partial-run splitting, explicit URL/page
actions and stale-context validation. Newly generated spans use the
`data-keyline-color` namespace; the old `data-nmg-color` data is not relabelled or
silently migrated. Native menus and SDK Modal/Setting controls supply the UI.
Renderer checks confirm actual Obsidian Markdown output. That initial
annotation-focus check used a fictional independent textarea; the later actual
optional-provider pass is recorded below and does not bundle its engine.

Custom icon behaviour references the old bilingual settings labels and
`src/fileIconModel.ts`, including priority, normalisation and rename semantics.
Those references were read, so this is not a claim of isolated clean-room work.
The new implementation uses its own scoped rule array, indexed resolution,
combined original-asset/SDK icon inventory, guarded DOM decoration and lifecycle
tests. The first checkpoint used only SDK glyphs; the user rejected that visual
substitution. The original `fileIconAssets.ts`, `fileIconModel.ts`,
`fileIconModal.ts`, initial `fileIconManager.ts` renderer and narrowly selected
identity CSS were inspected to recover exact asset, mapping and paint contracts.
All four geometries and the MIT licence were independently checked against the
pinned Keyline Icons repository. The new adapter uses these declared third-party
assets; no old runtime module is transplanted. An opening section of
the old stylesheet was also inspected during this review; its editor-gap and
callout rules were not copied. Native host observations identified hidden
Markdown tab icons, temporary tab-animation clones and separate-window Modal
targets; new tests cover the visible result and cleanup, not just node presence.

The explorer/interface/footer implementation additionally inspected old
settings/locale contracts, feature tests, `shellControls.ts` and
`statusBarPresentation.ts` as references. This does not claim those sources were
unseen. LiveSync status presentation was not yet implemented at that checkpoint
(the later implementation is recorded below); the full
alternate-window matrix is not yet accepted. Native explorer keyboard
testing showed the host's scope starts rename before a button DOM listener.
The new owned-button adapter uses the installed SDK's public Scope/Keymap API;
it never replaces native handlers. Unit and native tests cover cleanup, higher
priority menu scopes and Enter/Space activation.

The user subsequently identified an incorrect persistent disclosure-column
assumption. Selected native folder-rendering lines in the integrated
`nativeFileExplorer.ts`, related identity/disclosure stylesheet rules, and
the theme's native disclosure selectors were read to recover the accepted
contract. Copies of the existing integrated artifacts were then run under
the identical Community theme in a separate fictional Vault. The new adapter
keeps the actual native SVG node and handlers, appending an owned presentation
span with CSS-only same-slot hover treatment; it does not transplant the old
node-replacement/controller implementation. Native geometry and mouse/key
tests verify the result. These inspected sources are explicitly acknowledged;
this is independent implementation, not an unseen-source clean-room claim.

The selected-text parity pass inspected the integrated `selectionToolbar.ts`,
the action catalogue and public behaviour of `notionActionMenu.ts`, and their
dimensions/theme-token stylesheet contracts. Independent copies of the pinned
runtime supplied keyboard/mouse, text/selection, undo and screenshot evidence.
The new toolbar delegates the six named core formatting commands with fresh
editor/selection checks; its owned menu uses the SDK's Scope API and new pure
block/link planners. No old controller, transform engine, history module or
surface coordinator was transplanted. Native Editor transaction/undo adapter
functions and the narrow `resetSyntaxHighlighting`/lazy syntax-mode callback
were inspected while investigating the formula undo case; they are not copied
into the plugin. The no-op event was reproduced in both pinned runtime copies.
These sources are acknowledged
references, not a claim that their code was never seen.

The subsequent rhythm pass inspected the integrated `themeLayout.ts` values,
`editorLayout.ts` extension interface, the opening type/comment contracts of
`editorLayoutModel.ts`, and selected spacing/swatch CSS declarations. Its model
algorithm was not transplanted. Paired native captures established the actual
physical source-line spacing, including blank separators. The new pure rhythm
planner uses this rewrite's existing Markdown block model; its StateField,
zero-length widget and per-leaf measurement lifecycle are newly authored.
Native app CSS padding selectors were read to diagnose inherited body-level
`--file-margins`; only leaf-local explicit inline padding is overridden, with
theme-controlled vertical margins and auto/reset preserved.

The structured-conversion investigation read the narrow native smart-list
transaction filter. It treats unrecognised origins as typed edits and may
renumber an unselected adjacent item. Planned structural replacements now use
the native Editor origin `set`; normal Enter/list continuation, filters and
history remain enabled. No host function or history filter was copied or
patched. The source-mode raw-marker difference and the integrated brown-swatch
versus stored-colour disagreement remain explicitly recorded, not disguised as
identical behaviour.

Selected `menuPreference.ts` call-site lines and the isolated host's
`getConfig`/`setConfig`/`saveConfig` function bodies were inspected to establish
the native preference contract, not copied as runtime implementation. The
host debounces `setConfig` and stores `nativeMenus` in `appearance.json`.
The new adapter awaits the host writer and reads back through the host API;
it does not hand-write app/appearance files or cancel shared save timers.

Footer geometry and reversible field leases are newly authored modules. They
move the existing native controls only when the downloaded theme opts in, retain
native handlers and restore only owned presentation fields. The theme's existing
`ncl-shell-*` names are compatibility contracts, not copied theme source.
Theme-based host tests obtain the current version directly from Community and
validate its public release assets by size and digest. This testing dependency
is confined to the disposable Vault; it adds no runtime network access or
automatic theme installation to the plugin.

## Release gate

The structural presentation pass inspected the integrated `styledBlocks.ts`
public mapping/widget/build interfaces, its quote/Callout stylesheet contracts,
the `styledBlockModel` and `listSeparatorModel` test cases, the first-list-indent
formula in `themeLayout.ts`, the narrow English/Chinese Callout-title entries and
locale fallback helper, and the existing native token observations. The
old pure planning algorithms were not transplanted. The new
`structure-presentation.ts` uses this project's Markdown parser and host-token
intersection, feeding its existing WritingController lifecycle. CSS values and
identity glyph contracts preserve observed behaviour. Native computed-style
inspection established that core wins the old quote font-style and Callout
background cascade; this rewrite follows those host variables rather than
claiming the old stylesheet's uncomputed declarations as visible appearance.
Native Callout widgets consume pointer events, so a narrowly scoped new capture
listener recognizes their explicit edit control. It does not arm programmatic
placeholder selections. Remaining whole-block selection paint is not claimed
as implemented or identical.
The old `test/blockSelection.test.mjs` was subsequently read to scope that
remaining cross-line paint/snap contract; its runtime was not read or copied.

The subsequent row-selection pass also inspected the integrated settings label,
description and default for `snapSelectionToBlocks`, and the drag granularity
default. Paired, owned Obsidian instances established the actual behaviour:
pointer crossings expand to physical line endpoints, Shift-arrow does not,
reverse direction is retained, and the paint remains when snapping is disabled.
The new `row-selection.ts` domain/adapter modules use public CodeMirror line,
transaction-filter and decoration APIs; no old block-selection runtime was read
or transplanted. Viewport-bounded decoration planning, composition/read-only/
focus guards, preference reads and teardown belong to the rewrite. Colour and
radius values preserve the observed integrated Keyline presentation contract;
other themes keep their own accent. No source text or global history is patched.

Before any independent public submission: review the whole final source and
dependency inventory; retain required third-party notices; verify remaining
feature behaviour; choose a final plugin ID and an explicit, reversible migration
plan; verify the then-current Community policy. This development checkpoint is
not an authorization to publish or overwrite the current companion.

The hovered-row handle pass inspected only the integrated handle stylesheet
contract, its settings defaults/labels, and the narrow `saveSettings` call-site
needed to refresh preferences in a disposable reference host. Runtime hover,
placement, menu and drag algorithms were not copied. Paired native observations
established fixed gutter placement, text-row centring, control dimensions,
original action glyphs, reversed right-side order, and the crucial difference
between physical-row menu conversion and whole-paragraph dragging. The new pure
`handle-layout.ts` uses native editor/content/text rectangles; the adapter keeps
`visualAt` independent from its existing operation range. At that checkpoint,
the primary grip menu and blank-row differences remained open; the subsequent
independent implementation below addresses their scoped contracts.

The primary-menu pass used black-box pointer/keyboard observations in the two
owned hosts, plus the integrated stylesheet's menu presentation rules (lines
279–297, 339–407 and 490–510 in the pinned reference). It did not read or copy the
old runtime menu/edit algorithms. The rewrite's new `handle-menu.ts` domain and
adapter separate the physical source row from captured native selection and
whole-block dragging, revalidate source/file/selection, and reuse its own parsed
edit/colour/block-link planners. Shared `SelectionMenu` rendering retains the
observed dimensions, action order, host action glyph names and keyboard labels.
The original task glyph is the host's `check-square`, not `square-check`.
No inherited runtime implementation or copied SVG payload was introduced.
Known destructive divider and nested-heading outcomes are explicitly not copied;
colour markup remains independently owned. Final source/dependency and migration
review still precedes any public release.

The passive-mention pass inspected the integrated mention stylesheet, its DOM
labels/classes, `mentionModel.ts`, and the first 80 lines of `slashMenu.ts` to
understand the existing input contract. This is reference-informed work, not a
claim of a clean-room process or of never viewing old implementation code.
Paired native typing established the default-unselected menu, current-time-only
insertion, recent-page ordering, grouped content, action glyphs and cancellation
contract. No old controller/lifecycle implementation was transplanted. The new
`mention-menu.ts` uses public CodeMirror transactions/keymaps and the rewrite's
validated source/commit adapter, with per-editor ownership, guarded pending work,
ARIA restoration and source/selection revalidation. The existing native
EditorSuggest registration was removed because its implicit initial choice made
plain Enter unexpectedly insert a date. Display metrics are the measured product
contract. Slash/plus menus are still pending, not silently relabeled as parity.

The subsequent insertion-surface pass uses native pointer/keyboard captures of
the pinned integrated build and its computed menu stylesheet contracts (group
headers, separator, rows, icon slots and panel geometry). No inherited insertion
controller or edit algorithm was transplanted. The new `insertion-menus.ts`
shares this rewrite's validated planners and owns its DOM, keymaps, delayed work
and ARIA cleanup. The 28-choice inventory is retained, with five additional
required choices grouped separately from the integrated order. Blank templates
and caret positions were measured in fictional notes. Secondary new-page/file
routes remain explicitly pending, not accepted by the primary-menu comparison.

Selected-text visual review also exposed triple-emphasis markers that earlier
source/selection assertions missed. A native Obsidian token capture showed the
host labels the full `***` run as strong while the independent structural parser
divides it into strong/emphasis. The new reconciliation uses the union of those
two host-confirmed ranges, still requiring structurally paired syntax and full
character coverage. It does not copy a host or legacy marker-hiding algorithm,
modify Markdown source, or weaken opaque/unpaired-marker guards.

The Page/wiki follow-up used paired native behaviour (including returning to the
source, native wiki completion and undo), and read the documented Page/attachment
contract in the integrated `blockTransform.ts` lines 85–185. This is explicitly
reference-informed work. The new Page flow reuses this rewrite's own bilingual
name allocator and validated insertion planner, with a separate asynchronous
ownership guard and public Vault/FileManager/Workspace calls. No old runtime
controller, helper or implementation was transplanted. The independent
selected-text target-picker route is retained separately from blank wiki input.
Image/attachment upload remains outstanding; reading its contract is not evidence
of having implemented or accepted it.

The subsequent file-import implementation inspected the integrated runtime's
native input behaviour, `notionInsertMenu.ts` 540–625, `blockTransform.ts`'s
attachment contracts and `attachmentLink.ts`. The owned implementation uses a
new per-editor input lifecycle with generation cancellation, captured-source
validation after each await, public host attachment-path allocation and binary
creation, and one independently planned source transaction. It keeps/reports
partial files instead of deleting or silently retrying them. Formatting is a
new pure module with explicit escaping tests; no inherited picker/import runtime
was transplanted. Native comparisons use fictional selected files and actual
file inputs with CDP chooser selection, not private user material or a simulated
arrayBuffer-only success claim. This remains reference-informed, not clean-room.

The import-position follow-up also inspected the integrated `insertPlan.ts` and
the manual-menu entry in `main.ts`. Native comparisons, not code transformation,
established the end-of-physical-line and directed-selection contract. The new
planner replaces the captured trigger-to-line-end slice with its original suffix
plus the links in one native edit; it does not reuse the old change-array planner.
The associated layout repair uses this rewrite's Markdown ancestor model to
identify unprefixed lazy paragraph lines, retaining the surrounding structure.
No inherited runtime controller or layout implementation was transplanted.

The complex-Callout follow-up uses newly captured integrated-runtime screenshots,
DOM geometry and actual editing observations under the same Community theme.
No additional old runtime source was read for this correction. The new quote
container traversal and presentation-only rhythm segmentation use this project's
Lezer tree, with native-token confirmation still required for marker hiding.
The independently authored reproducibility check copies only this source tree's
build inputs into a fresh temporary directory; it does not use the old runtime
or its source as a build dependency. Successful byte-for-byte reproduction is
build evidence, not an independent-authorship or Community-acceptance guarantee.

The workspace-edge pass used the installed SDK declarations for focused native
documents, ItemView registration and workspace layout operations. The narrow
integrated `workspaceSwitcher.ts` constructor/lifecycle and `workspaceMenu.ts`
document-ownership contract were also inspected as references; these sources
were not unseen. New native fixtures exposed the rewrite's wrong-window menu
and false stale result when core supplies an unavailable-plugin tab. A new
comparison walks only native layout children, omits derived leaf caption/icon
and the save timestamp, and preserves opaque plugin payloads. Recovery ownership
compares the full observed scene rather than only its main split. No old layout
normalizer, controller or menu implementation was transplanted. The test-only
SDK fixture and failure injections exist solely in disposable fictional Vaults.

The optional status follow-up read the integrated `statusBarPresentation.ts`,
the narrow `shellControls.ts` start/stop gate and status-only stylesheet rules.
These define the existing symbol inventory, 12px glyph / 14px line metrics and
theme classes. This project's code-point segmentation, exact-word routine test,
stored-node ownership leases and per-document observer lifecycle were authored
here; the old renderer was not transplanted. Two old classification defects are
explicit differences: warning symbols after a routine marker and unknown words
formed from the letters in LIVE are not subdued. Paired native observations
retain identical text and layout while recording the intentional colour change.
The official LiveSync 1.0.39 bundle was inspected narrowly for status construction,
native text updates, default empty remote settings and onboarding. It is only a
hash-verified optional test fixture, never a source, dependency or bundled sync
engine. No remote configuration or replication was used in the fictional tests.

The optional annotation pass read the integrated `marginaliaBridge.ts`, narrow
`selectionToolbar.ts` label/history/event ranges and the independent Marginalia
0.1.3 `src/main.ts`, README and narrowly selected presentation class names. Those
sources were seen as versioned API and behaviour references; this is not a
clean-room claim. The new guarded adapter, stale-context revalidation, explicit
failure results and toolbar intent rules were authored here. The pinned provider
main/styles/manifest are copied unchanged into temporary fictional Vaults only,
with explicit fictional display preferences to avoid legacy-setting import.
Fault injection changes only the disposable instance's methods and restores them;
original/copy hashes and settings bytes are checked after the run. Neither the
provider's engine nor source is bundled or changed. A short native `changeTheme`
and configuration-writer function was inspected to diagnose a mismatched test
mode; no host implementation is copied or patched.

The compact-block follow-up derives from a defect in this rewrite's own block
model: rounding nested markers to a shared physical line start duplicated IDs.
The range correction, first-row/continuation-column handling and shared parent
end validation were authored against the installed Lezer tree and actual native
Reading output. No additional old or upstream runtime was read or transplanted.
Existing integrated toolbar/handle gates remain a separate appearance and
interaction check, not evidence that unsafe legacy conversions should be copied.

A write-disabled production rebuild of artifact
`fd34e4112a8a1e5e1e885c0f8400720ba9c258e94a767fa48d00de2a2b21c22d`
also inspected the actual esbuild dependency graph: 64 modules from this `src/`
tree and three bundled Lezer modules (`common` 1.5.3, `highlight` 1.2.5,
`markdown` 1.8.0). Runtime externals are exactly `obsidian` and CodeMirror
`state`, `view`, `language`. No input resolves to the old companion, another
plugin, a sibling checkout or a remote module. The in-memory output is identical
to `main.js`, and includes the retained notices/identity artwork. This verifies
the build boundary only: a graph cannot prove that every source line was
independently authored or replace the final source review/Community decision.

The 2026-10-22 focus-lifecycle pass changes only the rewrite's owned toolbar/menu
listeners and regression tests. Native window blur hides the toolbar, closes
the owned submenu and releases its keyboard scope without refocusing the old
editor. Returning an unchanged intentional selection resumes the toolbar;
Escape cancels a pending resume. The integrated 0.7.4 runtime is a behaviour
reference, not a source dependency. Marginalia is excluded from this pass.
The native harness verifies activation of its exact launched process/window
before driving input; activation retries never retry an editor edit or relax a
feature assertion. Failure records remain separate from the accepted run.

The current write-disabled source audit reproduces artifact
`a96c3061364d406a51f05ef2b1f08990b443b3d80efe7c65efb0b8a77936e437`:
64 local source modules, three bundled Lezer modules, and the same four host
externals. The 158-input isolated offline reproduction passes 1266 tests,
strict typecheck and build with identical main/styles/manifest bytes. These are
bounded source/build checks, not a security, originality or Community certificate.

## With Keyline 1.0.0 publication follow-up

The settings layout follows the integrated companion's six-category navigation,
icon choices, spacing and grouped cards. Its settings renderer and stylesheet
were read as an appearance/behaviour reference; the new settings renderer retains
this project's preference model, search, native controls and lifecycle handling.
The integrated blockHandles.ts was also read during the folding hit-area review.
Earlier statements about not having read that file describe an earlier stage,
not the final scope of reference access. No old handle runtime was transplanted.
The new collision handling measures the host's actual folding hit rectangle.
This is a reference-informed independent implementation, not a clean-room claim.

Publication changes the public identity to With Keyline (with-keyline), without
replacing or relabelling the original Keyline companion repository/releases.
Retained third-party icon artwork is credited in THIRD-PARTY-NOTICES.txt; the
independent source tree and bundled dependency boundary remain as documented.
