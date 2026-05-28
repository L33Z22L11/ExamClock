# 项目协作说明

这份文件给后续 AI/协作者读取。修改本项目时请优先遵守这里的约定。

## 基本约束

- 不引入 npm、打包器或额外构建步骤；项目使用浏览器原生 ES Modules。
- 不新增外层 `app/` 目录，也不恢复 `js/` 包裹目录。
- 目录职责：`config` 放纯配置，`features` 放可见功能模块，`engine` 放时钟引擎，`utils` 放通用工具，`assets` 放样式和静态资源。
- 页面只加载 `main.js`；旧浏览器提示用页面内 `nomodule` 脚本直接 `alert`。
- 不往 `window` 挂全局方法；页面交互使用 `data-action` 和模块事件绑定。
- 移动文件时同步更新所有相对 `import` 路径，提交前必须跑 `node --check`。

## 配置约定

- `config/exam.js` 放考试类型配置；尽量只写配置字段和 `schedule()` 中的 `$()` 调用，不在配置文件里写菜单构造 helper。
- `exams[id]` 是考试类型配置。
- 主菜单是默认值，不写 `menu: "main"`。
- 不显示在菜单中写 `hidden: true`。
- 社会科目菜单写 `menu: "social"`。
- 菜单名不同于 `type` 时写 `displayName`。
- 日期写 `yyyy-mm-dd`，例如 `daysUntil("2026-06-08")`；不要写 `new Date(2026, 5, 8)`。
- 注入科目用 `import { patchSchedule as $ } ...` 后调用 `$()`。
- `config/gallery.js` 放图库纯数据，包括批次、作者、名称和短链；不要写地址拼接、随机选择、DOM 渲染或定时轮换函数。
- 图库处理逻辑放在 `features/gallery.js`，它负责读取配置、生成完整图片地址、切换背景和渲染图库批次菜单。

## 代码风格

- DOM 操作统一用 `select(selector)`，需要限定作用域时用 `select(selector, root)`。
- 空值 fallback 优先用 `??`。
- 文本拼接优先用模板字符串，不用 `+` 拼字符串。
- 避免 `parseInt`、`~~`、`864E5`、`6E4` 这类隐晦写法。
- 魔法数字提成有名字的常量。
- 注释和 JSDoc 使用中文。
- HTML id/class 使用语义化 kebab-case；JS 变量用清晰 camelCase。
- CSS 放在 `assets`，使用 `/* #region ... */` / `/* #endregion */` 组织区块，方便 minimap 导航。

## 编码安全

- 项目中文文本必须保持 UTF-8。编辑 `index.html`、`README.md`、`AGENTS.md`、配置和含中文提示的 JS 时，避免使用 PowerShell `Set-Content`、`Out-File`、重定向等可能按系统默认编码重写文件的方式。
- 批量替换优先用 `apply_patch`。如果必须脚本处理文件，使用 Node.js `fs.readFileSync(file, "utf8")` / `fs.writeFileSync(file, text, "utf8")`，并在写回后立刻检查中文是否变成 `鑰`、`銆`、`€`、`涓` 等 mojibake 片段。
- 不要因为终端显示乱码就直接判定文件损坏；PowerShell 控制台可能显示异常。用 Node 按 UTF-8 读取确认，例如：`node -e "const s=require('fs').readFileSync('AGENTS.md','utf8'); console.log(s.includes('项目协作说明'), /鑰|銆|€|涓/.test(s))"`。
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
rg -n "new Date\([0-9]{4},|onclick=|Object\.assign\(window|parseInt|864E5|6E4|menu: \"main\"" . -g "*.js" -g "*.html"
```
