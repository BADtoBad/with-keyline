# With Keyline

**少一点折腾，多一点真正的书写。**

搭配 [Keyline 主题](https://community.obsidian.md/themes/keyline)，让 Obsidian 开箱即用。主题准备好统一的视觉基础，With Keyline 则把常用操作带到正在编辑的文字、文件和工作区旁边。

[English](README.md) · [下载](https://github.com/BADtoBad/with-keyline/releases) · [反馈问题](https://github.com/BADtoBad/with-keyline/issues)

## 工具就在需要的地方

- **选中文字，就地编辑。** 选区旁浮出格式工具栏，调整粗体、链接、颜色与块类型，连续操作时保留选区。
- **像整理内容一样整理块。** 悬停显示加号与拖拽把手，移动段落、列表及其嵌套内容；支持的编辑操作可以原生撤销。把手避开原生折叠箭头，两者可以分别点击。
- **一个 `@`，找到页面和日期。** 搜索笔记，插入今天、明天、昨天或当前时间；中文正文后无需空格即可触发。继续输入即可筛选，选择前保留原文。
- **不打断写作的插入菜单。** 默认设置下输入 `/` 或 `、`，或点击加号，即可插入标题、列表、待办、Callout、链接、图片及附件。可调整菜单顺序、隐藏项目、加入已有命令；仍遵循自定义触发符和行内菜单设置。
- **侧栏先告诉你这是什么文件。** 保留 Keyline 原有的实心／锐角图标，在原生侧栏和文件标签页中区分文件类型，也可给单个文件设置图标与颜色。文件夹展开操作复用原来的图标位置。
- **排版与操作保持一致。** 栏宽、段间距、列表缩进和标题节奏集中管理，恢复熟悉的“左侧分类、右侧选项”布局，内置中英双语。
- **切换任务，也切换工作布局。** 启用 Obsidian 核心工作区后，使用紧凑切换器切换已保存布局；切换前验证保存恢复快照。

![With Keyline 就地编辑栏，纯英文展示库实拍](assets/inline-editing-en.png)

![输入 @ 插入日期或搜索页面](assets/at-mentions-en.png)

## 和旧版是什么关系？

With Keyline 是原 [Keyline 交互插件](https://github.com/BADtoBad/keyline-interactions)的独立重构版。**两者主要日常功能基本一致**，但安全边界、具体实现及设置格式并非完全相同。

**如果 With Keyline 出现 bug，建议先尝试 [GitHub 上保留的旧版插件](https://github.com/BADtoBad/keyline-interactions/releases)。** 旧版不会被本次发布覆盖。切换前请停用 With Keyline，**不要同时启用两者**。各自设置独立，不会自动迁移；欢迎附上版本和复现步骤反馈问题。

## 安装

在 [With Keyline Community 页面](https://community.obsidian.md/plugins/with-keyline)查看当前版本与安装入口，或在 Obsidian 的第三方插件中搜索 **With Keyline**。也可从 [GitHub Releases](https://github.com/BADtoBad/with-keyline/releases) 手动安装：

1. 备份 Vault 的 `.obsidian` 配置；如装有旧版 Keyline 交互插件，先停用。
2. 新建 `.obsidian/plugins/with-keyline/`，放入同一版本的 `main.js`、`manifest.json` 和 `styles.css`。
3. 重载 Obsidian，在第三方插件中启用 **With Keyline**。
4. 另行安装 **Keyline** 主题，获得设计预期的配套外观。安装主题不会自动安装插件。

不会自动安装示例笔记、覆盖工作区或迁移旧设置。设置导入为可选操作，见 [迁移说明](MIGRATION.md)。再次分发时保留许可证与第三方声明。

## 兼容性与数据

- **仅支持桌面端，要求 Obsidian 1.13.7 或更新版本。** 主要验证环境为 macOS、Obsidian 1.13.7 和 Community Keyline 0.8.24；本版不支持移动端编辑，其他系统和插件组合仍需各自验证。
- 图标只识别格式，不提供 EPUB 等阅读器。工作区功能依赖核心工作区插件；Iconic 启用时保留它的图标控制权。
- 不包含遥测或插件自身的联网请求。设置与恢复数据保存在 Vault 配置目录；用户主动调用的原生命令及其他插件仍遵循各自行为。
- 格式与块操作会修改选中的笔记内容。导入的附件和新建笔记不会因为撤销插入链接而被悄悄删除。
- 覆盖范围见 [发行验证](RELEASE-VERIFICATION.md)。自动测试不等于没有 bug。
- 版本变化见 [更新记录](CHANGELOG.md)。

MIT 许可。见 [LICENSE](LICENSE)、[第三方声明](THIRD-PARTY-NOTICES.txt)及[实现来源说明](PROVENANCE.md)。原版 Keyline Icons 图形保留署名；运行时为参考既有行为的独立实现，不宣称经过正式净室认证。
