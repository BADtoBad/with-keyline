# Changelog

## 1.2.0 — Properties and themed calendar — 2026-10-25

- Show a single native, unsaved property name/value row on Markdown notes with no properties. No suggested fields or automatic frontmatter writes; preserve the native hidden-properties and source-mode settings.
- Desktop date fields open a theme-aware calendar using the same surface, colour, typography and shadow tokens as the suite's menus. Support month navigation, Today, Clear, keyboard navigation and Escape; opening or browsing never writes a date. Date-time fields retain time with an explicit Apply action.
- Retain native date storage, validation, manual entry, type/tag choices and undo/redo. Mobile keeps the native picker; detached/stale fields and plugin unload close the calendar without saving.
- Mobile support remains Beta. Desktop/macOS and emulated viewport checks do not certify Android, Xiaomi, iOS or software keyboards. See [verification](RELEASE-VERIFICATION.md).
- 中文：无属性的笔记在标题下显示一行空的属性名／属性值输入框，不推荐字段、不自动写入空属性。桌面日期弹层跟随 Keyline 亮暗配色、字体、边框及阴影，支持翻月、今天、清空与键盘操作；打开、浏览及取消不写入日期。日期时间字段保留时间并明确确认。保留原生保存、手动输入、类型与标签选项、撤销，以及隐藏属性和源码设置；移动端回退原生日期控件。

## 1.1.0 — Mobile Beta — 2026-10-24

- Opened phone/tablet installation with limited Mobile Beta, a startup reminder and persistent settings notice. Desktop functionality remains available.
- Enabled touch-friendly page/date and insertion menus, with native undo, IME guards, keyboard-aware viewport positioning and compatibility-click deduplication.
- Mobile-only runtime limits disable desktop floating selection tools, block handles/drag, selection snapping, hover shortcuts, workspaces and custom typing/marker rewriting. Saved desktop preferences are preserved; mobile page inset is automatic.
- Basic format commands, file icons and typography remain available on mobile. Physical Android/Xiaomi/iOS and software-keyboard acceptance is still outstanding; this release is explicitly labelled Mobile Beta, not device-certified support. Test in a separate Vault with backups. See [verification](RELEASE-VERIFICATION.md).

### 中文

- 开放手机和平板安装受限移动端 Beta，启用提醒及设置页常驻说明；桌面功能保留。
- `@`、`/`、`、` 菜单支持触控、原生撤销、输入法保护、软键盘可视区域定位和触摸补发点击去重。
- 移动端暂禁用浮动编辑栏、块拖拽／把手、自动整块选区、悬停快捷操作、工作区与输入／标记改写，不覆盖桌面设置；移动端留白采用自动值。
- 保留基础格式命令、文件图标和排版；Android／小米、iOS 与真实软键盘验收仍未完成，按明确标注的移动端 Beta 发布，不代表真机认证；请先在独立库试用并保留备份。

## 1.0.2 — 2026-10-23

- Added `、` (ideographic comma) as an equivalent to the default `/` insertion-menu trigger, including at the start of a new line. No language-switching or settings migration is required.
- Both triggers use the same choices, query filtering, mouse/keyboard selection and native undo. Escape leaves the original input untouched.
- Existing inline-menu and disabled-menu settings, explicit custom triggers, and protected code/frontmatter contexts are preserved. Ordinary text such as `甲、乙` does not open the menu.
- Updated the English/Chinese settings hint and documentation.
- Verified with 1,336 automated tests and a focused light/dark desktop host regression with the published Keyline 0.8.25 theme. See [verification scope](RELEASE-VERIFICATION.md).

### 中文

- 新增中文顿号 `、`：默认设置下，与 `/` 一样可以在新行打开插入菜单，无需切换输入法或迁移设置。
- 支持相同的菜单选项、筛选、鼠标／键盘选择和原生撤销；按 Esc 保留原输入。
- 保留行内菜单开关、禁用状态、自定义触发符及代码／属性区保护；`甲、乙` 这类正常正文不会弹出菜单。
- 同步更新中英文说明，并通过自动测试和搭配 Keyline 主题的亮／暗色桌面回归检查。

## 1.0.1

- Replaced four settings-heading creation sites with Obsidian's native `Setting.setHeading()`, retaining the existing settings layout.

## 1.0.0

- Initial With Keyline release: selection tools, block handles, page/date mentions, insertion menus, file icons, typography and workspace switching.
