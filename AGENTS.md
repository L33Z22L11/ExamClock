# 项目协作说明

这份文件给后续 AI/协作者读取。修改本项目时请优先遵守这里的约定。

## 基本约束

- 不引入 npm、打包器或额外构建步骤；项目使用浏览器原生 ES Modules。
- 不新增外层 `app/` 目录，也不恢复 `js/` 包裹目录。
- 页面只加载 `scripts/main.js`；旧浏览器提示用页面内 `nomodule` 脚本直接 `alert`。
- 不往 `window` 挂全局方法；页面交互使用 `data-action` 和模块事件绑定。
- 移动文件时同步更新所有相对 `import` 路径，提交前必须跑 `node --check`。

## 目录职责

- `config/` 放纯配置。`config/exam.js` 是考试类型配置，`config/gallery.js` 是图库数据。
- `engine/clock.js` 放时钟主逻辑，沿用旧版 `subject / exams / slogan / timer` 的直白语义，导出 `engine`、`exams`、`slogan`、`timer`、`today`、`patchSchedule()` 等稳定入口。
- `engine/startup.js` 放启动流程，包括选择初始 `type`、启动真实/调试时钟、运行时提示和纪念日滤镜。
- `scripts/main.js` 是页面入口，只负责渲染菜单、绑定 `data-action`、把用户操作连接到现有模块。
- `scripts/gallery.js` 放图库运行逻辑：读取配置、拼图片地址、切换背景、渲染批次菜单。
- `scripts/cover.js` 放封面过渡动画和 cover tips。
- `scripts/page.js` 放页面杂项：提示气泡、菜单渲染、全屏、最近更新时间。
- `utils/` 只放跨模块高频工具，如 DOM、时间、路由。不要把一行随机选择之类的小函数抽到 `utils`。
- `assets/` 放样式和静态资源。CSS 使用 `/* #region ... */` / `/* #endregion */` 组织区块，方便 minimap 导航。

## 务实重构边界

- 参考旧版语义，而不是重做一套高层架构。可对照 `../ExamClockArchive/260609/js/clock.js`、`gallery.js`、`cover.js`，或 git 历史 `45d68cb:js/*.js`。
- 目标是“比旧版更现代、更可读”，不是“更抽象”。保留考试时钟原来那种普通网页脚本的直接感。
- 不要新增回调注册器、插件式 options、`setXxxPlayer()` 之类绕一圈的 API。模块之间能直接 import 就直接 import。
- 不要为了分层创建只有一两个函数的小文件或小目录。职责稳定、体量明显增长、确实复用时再拆。
- 变量名保持贴近业务：`engine`、`exams`、`slogan`、`timer`、`currentBackground` 这类名字优先于过度泛化的抽象名。
- 可以提常量，但不要把明显语义的文本和数字全部堆成一屏常量。能让代码更好读才提。

## 配置约定

- `config/exam.js` 尽量只写配置字段和 `schedule()` 中的 `$()` 调用，不在配置文件里写菜单构造 helper。
- `exams[id]` 是考试类型配置。
- 主菜单是默认值，不写 `menu: "main"`。
- 不显示在菜单中写 `hidden: true`。
- 社会科目菜单写 `menu: "social"`。
- 菜单名不同于 `type` 时写 `displayName`。
- 日期写 `yyyy-mm-dd`，例如 `daysUntil("2026-06-08")`；不要写 `new Date(2026, 5, 8)`。
- 注入科目用 `import { patchSchedule as $ } ...` 后调用 `$()`。
- `config/gallery.js` 只放批次、作者、名称和短链；不要写地址拼接、随机选择、DOM 渲染或定时轮换函数。

## 代码风格

- DOM 操作统一用 `select(selector)`，需要限定作用域时用 `select(selector, root)`。重要 DOM 工具保留中文 JSDoc。
- 空值 fallback 优先用 `??`。
- 文本拼接优先用模板字符串，不用 `+` 拼字符串。
- 避免 `parseInt`、`~~`、`864E5`、`6E4` 这类隐晦写法。
- 注释和 JSDoc 使用中文；代码里的注释只解释不明显的业务或历史语义，不写空泛说明。
- HTML id/class 使用语义化 kebab-case；JS 变量用清晰 camelCase。
- UI 文案、倒计时提醒、cover tip 尽量沿用旧版考试时钟的语气；必要改动要保证用户熟悉感。

## 编码安全

- 项目中文文本必须保持 UTF-8。编辑 `index.html`、`README.md`、`AGENTS.md`、配置和含中文提示的 JS 时，避免使用 PowerShell `Set-Content`、`Out-File`、重定向等可能按系统默认编码重写文件的方式。
- 批量替换优先用 `apply_patch`。如果必须脚本处理文件，使用 Node.js `fs.readFileSync(file, "utf8")` / `fs.writeFileSync(file, text, "utf8")`，写回后立刻检查中文是否变成 mojibake。
- 不要因为 PowerShell 终端显示异常就直接判定文件损坏；用 Node 按 UTF-8 读取确认。
- 常用 UTF-8 检查命令：

```powershell
node -e "const fs=require('fs'); const bad=/[\u00e6\u00e7\u00e9\u20ac\u6d93\u9286\u9470]/; for (const f of ['index.html','README.md','AGENTS.md','config/exam.js','engine/clock.js','scripts/main.js','scripts/cover.js','scripts/gallery.js']) { const s=fs.readFileSync(f,'utf8'); console.log(f, s.includes('考试时钟') || s.includes('项目协作说明') || s.includes('沉着冷静'), bad.test(s)); }"
```

- 如果发现中文被写坏，先停止其他重构，优先恢复用户可见 HTML、README、AGENTS 和含中文提示的 JS，再继续功能改动。

## 路由约定

- `type` 参数绑定到地址栏。
- 用户从菜单切换考试类型时用 `pushState` 更新 `?type=`。
- 启动时自动选择默认/日期排期时用 `replaceState` 补齐 `?type=`，避免新增历史记录。

## 验证

修改 JS 后运行：

```powershell
Get-ChildItem -Recurse -Filter *.js | Where-Object { $_.FullName -notmatch '\\.git' } | ForEach-Object { node --check $_.FullName }
```

常用残留检查：

```powershell
rg -n "new Date\([0-9]{4},|onclick=|Object\.assign\(window|parseInt|864E5|6E4|menu: \"main\"|setClockCoverPlayer|setGalleryCoverPlayer|selectGalleryItem|schedule-clock" . -g "*.js" -g "*.html" -g "*.md"
```
