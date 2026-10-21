# Explicit settings transfer / 明确确认的设置迁移

With Keyline is a separate plugin, not an automatic upgrade of the original
Keyline companion. Never enable both companions in the same Vault.

## Supported input

Choose **copies** of `manifest.json` and `data.json` from integrated Keyline
**0.7.4**, ID `notion-craft-interaction-lab`, in Settings → With Keyline →
Advanced → Import / restore settings. The plugin reads only these selected files.
It does not discover other Vaults, read the old plugin directory on startup,
disable another plugin or import source code. Other versions, unknown fields,
invalid types, unsafe paths and unrepresentable values are refused, not guessed.

| Old setting | New interpretation |
| --- | --- |
| `enabled` | Editing master; saved subordinate choices remain unchanged when off |
| Selection/marker/input/block options | Corresponding editor options; explicit command-palette actions remain available |
| `themeLayout` | All sixteen mapped typography values; unsupported steps/ranges reject |
| `fileIcons.types/files` | Type/path icon rules; original glyph IDs and colours retained |
| `insertOrder/insertHidden/insertCustom` | Effective old order, hidden items and separate labeled/icon bindings, including multiple bindings to one host command |
| `wikilinkInputAliases` | Both mention input and fullwidth-bracket input |
| `dragGranularity` | Paragraph maps to whole-block dragging; line stays line |
| Date/time/handle/interface/workspace options | Validated mapped preferences |
| `marginalia` | Excluded with a preview notice; no separate-plugin mutation |

New-only choices and interface language remain current. Old omitted known fields
use the mapped defaults. New insertion entries follow the old effective pool.
The importer records bindings but never executes their commands or guarantees a
third-party command/icon is installed. Note contents, legacy colour spans,
theme files, native menu preferences, workspace layouts and Bucket are untouched.

Input data is limited to 2 MiB (file picker bytes, parser UTF-16 length), manifest
to 16,000, icon rules to 10,000 and custom bindings to 32. Preview JSON may be
visually truncated; the verified backup retains the complete accepted content.

## Apply and restore

1. Select the copies and review the changed fields/result. Preview and cancel
   write neither settings nor backups.
2. **Back up and apply** first writes a unique snapshot under this plugin's
   `settings-backups/`, verifies its exact read-back, then writes and verifies
   this plugin's `data.json`. Source strings and prior raw bytes are retained.
3. Close/reopen the modal to choose a backup and **Review restore**. Applying a
   restore first creates another backup of current preferences, then restores
   the original bytes. If no original `data.json` existed, only the new settings
   file is removed; all backups remain. Restart reads the restored preferences.

Snapshots have a versioned envelope and SHA-256 checksum. This detects accidental
corruption; it is not authentication against someone who can rewrite the backup
and recompute its checksum. Backups are not deleted automatically. They include
file paths/custom command labels from preferences: keep them private rather than
attaching them unredacted to an issue.

## Failure boundaries

Dirty/read-only settings, unknown schemas, a stale preview or a changed baseline
refuse the operation. Backup errors never permit an unprotected settings write.
If settings writing fails, the engine retains/restores the original only when
the bytes prove this is safe. An unexpected or unreadable value is not silently
overwritten: settings lock, the backup remains and the UI asks for reload/recovery.
Preserve the backup before attempting recovery; malformed current settings require
manual inspection, not bypassing validation. No file-system-wide atomic lock or
protection against arbitrary external sync races is claimed. Do not concurrently
edit/sync the configuration during transfer.

## 中文要点

仅支持整合版 **0.7.4** 的版本文件和设置文件副本。高级设置中先选择、预览，
再明确点击“备份并应用”。取消不落盘；应用前备份并读回验证；回退前再次备份
后来的改动，然后恢复原始设置字节。原来没有设置文件时，只移除本次新建的
`data.json`，不会删除备份。未知版本、字段、无效值或过期预览直接拒绝。

保留 16 项排版值、文件图标覆盖、插入排序／隐藏／自定义命令及编辑总开关。
关闭总开关不抹掉子开关选择；不会导入笔记、转换颜色标记、执行自定义命令，
也不会更改主题、Bucket、系统菜单或启停旧插件。请勿在同一库同时启用新旧版。
备份包含偏好中的路径和命令标签，应保留在本地；校验和不是防篡改签名。
