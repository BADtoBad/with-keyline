import { build } from "esbuild";
import { readFileSync } from "node:fs";
const test = process.argv[2] === "test";
await build({
  entryPoints: test ? ["src/platform/selection-menu.ts", "src/domain/attachments.ts", "src/platform/attachment-imports.ts", "src/platform/insertion-menus.ts", "src/platform/mention-menu.ts", "src/platform/transfer-modal.ts", "src/domain/legacy-import.ts", "src/platform/settings-transfer.ts", "src/domain/handle-menu.ts", "src/platform/handle-menu.ts", "src/domain/handle-layout.ts", "src/domain/row-selection.ts", "src/platform/row-selection.ts", "src/domain/structure-presentation.ts", "src/domain/editor-rhythm.ts", "src/platform/editor-rhythm.ts", "src/domain/selection-blocks.ts",
    "src/platform/native-views.ts", "src/platform/native-selection.ts", "src/platform/identity-artwork.ts", "src/domain/explorer.ts", "src/platform/explorer.ts", "src/platform/interface.ts", "src/platform/file-identities.ts", "src/platform/icon-editor.ts", "src/domain/rich-format.ts", "src/platform/rich-format.ts", "src/platform/selection-toolbar.ts", "src/domain/block-keys.ts", "src/platform/block-keys.ts", "src/domain/relocation.ts", "src/domain/writing.ts", "src/platform/writing.ts", "src/domain/insertion.ts", "src/platform/insertion.ts", "src/platform/dates.ts", "src/domain/blocks.ts", "src/domain/mentions.ts", "src/domain/preferences.ts", "src/domain/icons.ts", "src/domain/format.ts", "src/domain/typography.ts", "src/platform/typography.ts", "src/platform/workspaces.ts", "src/platform/workspace-state.ts", "src/platform/block-commands.ts", "src/platform/block-handles.ts", "src/platform/persistence.ts", "src/platform/mention-suggest.ts", "src/platform/format-command.ts", "src/main.ts"
    , "src/domain/mobile.ts", "src/platform/mobile-menu.ts", "src/platform/note-properties.ts", "src/domain/calendar.ts", "src/platform/property-calendar.ts"
  ] : ["src/main.ts"],
  bundle: true,
  platform: "browser",
  format: "cjs",
  target: "es2018",
  tsconfig: "tsconfig.json",
  external: ["obsidian", "@codemirror/state", "@codemirror/view", "@codemirror/language"],
  sourcemap: false,
  banner: { js: `/*!\n${readFileSync(new URL("../THIRD-PARTY-NOTICES.txt", import.meta.url), "utf8")}\n*/` },
  ...(test ? { outdir: ".test-build", outbase: "src", outExtension: { ".js": ".cjs" } } : { outfile: "main.js" }),
  logLevel: "info"
});
