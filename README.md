# 考试时钟 / ExamClock

考试时钟用于在考试、考练和日常作息场景中展示当前科目、起止时间、当前时间、倒计时和进度条。项目使用浏览器原生 ES Modules，不需要 npm、打包工具或构建步骤。

## 使用

直接部署或打开 `index.html` 即可。页面入口只有一个：

```html
<script type="module" src="./scripts/main.js"></script>
```

旧浏览器不再尝试兼容，页面内的 `nomodule` 脚本会直接 `alert` 提示更换现代浏览器。

常用地址参数：

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `type` | `?type=26` | 指定考试类型，对应 `config/exam.js` 中的排期 key。 |
| `debug` | `?debug=1000` | 调试模式，按倍率推进时间。 |
| `tos` | `?tos=60` | 时间修正，单位为秒。 |

## 结构

- `scripts/main.js`：页面入口，渲染菜单并绑定 `data-action`。
- `engine/clock.js`：时钟主逻辑，保留旧版 `subject / exams / slogan / timer` 的语义。
- `engine/startup.js`：启动、路由选择、真实/调试时钟循环。
- `config/exam.js`：考试类型配置和 `$()` 排期注入。
- `config/gallery.js`：图库纯数据。
- `scripts/gallery.js`：背景选择、图片地址拼接、图库菜单。
- `scripts/cover.js`：封面动画和旧版 cover tip。
- `scripts/page.js`：提示气泡、菜单渲染、全屏、最近更新时间。
- `utils/`：DOM、时间、路由等跨模块小工具。
- `assets/`：样式和静态资源。

## 更新考试

高频考试排期集中在 `config/exam.js`。新增或修改考试类型时，直接编辑 `exams[id]`：

```js
exams[26] = {
  type: "高三日常",
  author: "来源",
  origin: "年级部",
  mainSlogan: `距离高考 ${daysUntil("2026-06-08")} 天`,
  schedule() {
    $("语文", today.date, "09:00", "11:30");
  }
};
```

日期写成 `yyyy-mm-dd`，例如 `daysUntil("2026-06-08")`。不要使用 `new Date(2026, 5, 8)` 这类零基月份写法。

主菜单是默认值，不写 `menu: "main"`；不显示在菜单中写 `hidden: true`；社会科目菜单写 `menu: "social"`；菜单显示名和 `type` 不同时写 `displayName`。

## 更新图库

背景图片列表集中在 `config/gallery.js`，这里只放批次、作者、名称和短链数据。背景选择、拼接图片地址、轮换定时和菜单渲染放在 `scripts/gallery.js`，不要把处理函数塞回配置文件。

## 开发

项目结构和维护约定见 `AGENTS.md`，后续 AI/协作者请先阅读它。当前重构的原则是务实：参考旧版考试时钟的 `clock.js / gallery.js / cover.js / interact.js` 语义，只做 ES Modules 和可读性整理，不引入更高层框架感的抽象。

修改 JS 后建议运行：

```powershell
Get-ChildItem -Recurse -Filter *.js | Where-Object { $_.FullName -notmatch '\\.git' } | ForEach-Object { node --check $_.FullName }
```

检查中文是否仍为 UTF-8：

```powershell
node -e "const fs=require('fs'); const bad=/[\u00e6\u00e7\u00e9\u20ac\u6d93\u9286\u9470]/; for (const f of ['index.html','README.md','AGENTS.md','config/exam.js','engine/clock.js','scripts/main.js','scripts/cover.js','scripts/gallery.js']) { const s=fs.readFileSync(f,'utf8'); console.log(f, s.includes('考试时钟') || s.includes('项目协作说明') || s.includes('沉着冷静'), bad.test(s)); }"
```

## 后续优化方向

- 继续清理 `config/exam.js` 的长行和重复排期，但先处理最常改、最容易出错的月考/模考。
- 保留旧版文案的熟悉感，只修明显不合时宜或不准确的提示。
- 给 `engine/clock.js` 留一份无需 npm 的 smoke test，覆盖 `patchSchedule()`、倒计时阶段和 `type` 路由。
- 图库数据很长时，再按年份或批次拆配置文件；不要提前拆出孤立目录。
- CSS 可以继续按 region 整理重复样式，优先处理菜单、提示气泡和移动端可读性。
