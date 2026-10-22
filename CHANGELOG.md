# Changelog

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
