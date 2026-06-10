# 考试时钟 / ExamClock

考试时钟用于在考试、考练和日常作息场景中展示当前科目、起止时间、当前时间、倒计时和进度条。项目使用浏览器原生 ES Modules，不需要 npm、打包工具或构建步骤。

## 使用

直接部署或打开 `index.html` 即可。入口脚本：

```html
<script nomodule>
  alert("当前浏览器过于老旧，无法运行考试时钟。请使用现代浏览器。");
</script>
<script type="module" src="./main.js"></script>
```

常用地址参数：

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `type` | `?type=26` | 指定考试类型，对应 `config/exam.js` 中的排期 key。 |
| `debug` | `?debug=1000` | 调试模式，按倍率推进时间。 |
| `tos` | `?tos=60` | 时间修正，单位为秒。 |

## 更新配置

高频考试排期集中在 [config/exam.js](config/exam.js)。新增或修改考试类型时，直接编辑 `exams[id]` 配置：

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

背景图片列表集中在 [config/gallery.js](config/gallery.js)，这里只放批次、作者、名称和短链数据。背景选择、拼接图片地址、轮换定时和菜单渲染放在 [features/gallery.js](features/gallery.js)，不要把处理函数塞回配置文件。

日期请写成 `yyyy-mm-dd`，例如 `daysUntil("2026-06-08")`，不要使用 `new Date(2026, 5, 8)` 这类零基月份写法。

## 开发

项目结构和维护约定见 [AGENTS.md](AGENTS.md)，后续 AI/协作者请先阅读它。

修改 JS 后建议运行：

```powershell
Get-ChildItem -Recurse -Filter *.js | Where-Object { $_.FullName -notmatch '\\.git' } | ForEach-Object { node --check $_.FullName }
```

## 后续优化方向

- 把 `config/exam.js` 中重复的考试日期安排提成小型数据表，再由简单循环注入，优先处理月考、模考这类结构固定的排期。
- 继续压缩 `config/exam.js` 里的长行，把复杂标语拆成局部常量或数组选择，保持配置可读。
- 为 `engine/schedule-clock.js` 增加少量纯函数单测思路：时间格式化、日期解析、进度阶段判断；不引入测试框架也可以先保留手动烟测脚本。
- 给 `select(selector)` 增加空元素保护策略，避免选择器写错时静默失败或报错位置不清晰。
- 将图库配置继续拆成按年份或批次的配置文件，再由一个配置入口合并导出，降低单个文件长度。
- 清理仍然偏旧的中文文案和历史注释，保留必要来源信息，减少维护者阅读负担。
- 逐步减少 HTML 中纯展示性占位文本，让运行态内容更多由模块初始化填充。
- 保持无构建、无 npm 的前提下，补一份可复制的本地 smoke test 命令，方便每次改动后快速确认入口可导入。
