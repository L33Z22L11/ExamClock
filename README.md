# 考试时钟 / ExamClock

当前版本：8.1.0。页面版本号在 `index.html` 的 `#app-version` 中维护，封面提示和控制台横幅从这里读取。

考试时钟用于在考试、考练和日常作息场景中展示当前科目、起止时间、当前时间、倒计时和进度条。项目使用浏览器原生 ES Modules，不需要 npm、打包工具或构建步骤。

## 使用

部署为静态网站，或通过本地 HTTP 服务器访问 `index.html`。原生模块不能依赖双击 HTML 的 `file://` 方式运行。页面入口只有一个：

```html
<script type="module" src="./scripts/main.js"></script>
```

旧浏览器不再尝试兼容，页面内的 `nomodule` 脚本会直接 `alert` 提示更换现代浏览器。

常用地址参数：

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `type` | `?type=27` | 指定考试类型，对应 `config/exam.js` 中的排期 key。 |
| `debug` | `?debug=1000` | 调试模式，按倍率推进时间。 |
| `tos` | `?tos=60` | 时间修正，单位为秒。 |

## 结构

- `scripts/main.js`：页面入口，渲染菜单并绑定 `data-action`。
- `engine/clock.js`：时钟主逻辑，保留旧版 `subject / exams / slogan / timer` 的语义。
- `engine/startup.js`：启动、路由选择、真实/调试时钟循环。
- `config/exam.js`：考试类型配置和 `$()` 排期注入。
- `config/gallery.js`：图库纯数据。
- `monoroll.js`：无 DOM 副作用的公共图库模块，导出 `collections`、`images`、`pickImage()`。
- `scripts/gallery.js`：考试时钟背景、轮换定时和图库菜单。
- `scripts/cover.js`：封面动画和旧版 cover tip。
- `scripts/page.js`：提示气泡、菜单渲染、全屏、最近更新时间。
- `utils/time.js`：本地日期、排期周数、倒计天数与显示时间等共用语义。
- `utils/query-params.js`：读取和校验 URL 参数，写入浏览器历史。
- `assets/`：样式和静态资源。

## 更新考试

高频考试排期集中在 `config/exam.js`。新增或修改考试类型时，直接编辑 `exams[id]`：

```js
exams[27] = {
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

背景图片列表集中在 `config/gallery.js`，这里只放批次、作者、名称和短链数据。`monoroll.js` 负责图片地址和随机选图；`scripts/gallery.js` 只负责考试时钟界面。

其他网站使用同一入口：

```js
import { collections, images, pickImage } from "https://exam.thisis.host/monoroll.js";
const image = pickImage("Nov21");
// { collection, author, name, url }
```

导入不会操作页面或启动定时器。数组与图片对象供读取使用，调用方不要修改。未知批次抛出 `RangeError`。接入说明见 [一卷图库文档](https://thisis.host/monoroll/)。

Netlify 的 `netlify.toml` 为 `/monoroll.js` 和 `/config/gallery.js` 设置公开 CORS 响应头。迁移托管平台时，必须保留这两个文件的 JavaScript MIME 类型与 `Access-Control-Allow-Origin: *`，只给入口配置跨域不够。

先发布 ExamClock 的公共模块及响应头，再发布 TechYesSite 文档和 Archive 首页。部署后从不同域名的浏览器页面验证两层模块均能加载；本地测试不替代线上响应头检查。

## 开发

项目结构和维护约定见 `AGENTS.md`，后续 AI/协作者请先阅读它。当前重构的原则是务实：参考旧版考试时钟的 `clock.js / gallery.js / cover.js / interact.js` 语义，只做 ES Modules 和可读性整理，不引入更高层框架感的抽象。

这些目录按职责组织，不强行拆成通用框架：`main.js` 连接菜单与操作，`startup.js` 管理时钟循环和初始路由，`clock.js` 保留排期与计时显示，`page.js` 集中页面提示与控制台横幅。原生 DOM 查询和 `padStart()` 直接使用，不再为它们建立工具文件。只有对外共用的 `monoroll.js` 必须与页面完全解耦。

切换类型时必须先把 `engine.start/end` 清零，再运行新排期，否则原科目会阻挡更早场次的注入。临时考试仅在输入通过验证后清空旧截止时间；取消时保留原状态。普通日志保留成功注入信息，跳过原因使用 `console.debug()`，可在开发者工具的 Verbose 级别查看。控制台 Logo 由站点图标转换为 Data URL，避免 Chromium 对控制台外部图片的限制。

修改 JS 后运行语法检查及无依赖回归测试：

```powershell
Get-ChildItem -Recurse -Filter *.js | Where-Object { $_.FullName -notmatch '\\.git' } | ForEach-Object { node --check $_.FullName }
node --test tests/*.test.mjs
```

检查中文是否仍为 UTF-8：

```powershell
node -e "const fs=require('fs'); const bad=/[\u00e6\u00e7\u00e9\u20ac\u6d93\u9286\u9470]/; for (const f of ['index.html','README.md','AGENTS.md','config/exam.js','engine/clock.js','scripts/main.js','scripts/cover.js','scripts/gallery.js']) { const s=fs.readFileSync(f,'utf8'); console.log(f, s.includes('考试时钟') || s.includes('项目协作说明') || s.includes('沉着冷静'), bad.test(s)); }"
```

## 后续优化方向

- 继续清理 `config/exam.js` 的长行和重复排期，但先处理最常改、最容易出错的月考/模考。
- 重构时保留已有提示、署名和联系信息，不顺手缩写或改写；输入校验变更时让原提示进入对应分支。
- 修改计时逻辑时运行 `tests/clock.test.mjs`，覆盖排期、倒计时阶段、取消操作、跨午夜倒计时和调试倍率。
- 图库数据很长时，再按年份或批次拆配置文件；不要提前拆出孤立目录。
- CSS 可以继续按 region 整理重复样式，优先处理菜单、提示气泡和移动端可读性。
