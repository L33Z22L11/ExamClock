/*
 * 页面入口：渲染菜单，并把 HTML 上的 data-action 绑定到对应功能。
 */
import { showCoverScreen } from "./cover.js";
import { chooseBackground, renderGalleryMenu } from "./gallery.js";
import { loadLastCommitTime, renderExamMenu, showToast, toggleFullscreen } from "./page.js";
import {
  adjustMinutes,
  createCountdownExam,
  createTemporaryExam,
  engine,
  exams,
} from "../engine/clock.js";
import "../config/exam.js";
import { startExamClock } from "../engine/startup.js";
import { select } from "../utils/dom.js";
import { queryParams, readQueryParams, setRouteParam } from "../utils/query-params.js";

renderExamMenu("#exam-type-list", exams, "main");
renderExamMenu("#social-exam-list", exams, "social");
renderGalleryMenu(showCoverScreen);

select("[data-exam-type]").all().forEach((item) => {
  item.addEventListener("click", () => {
    engine.switch(item.dataset.examType);
    setRouteParam("type", item.dataset.examType);
    if (queryParams.debug == null) showCoverScreen();
  });
});

select('[data-action="temporary-exam"]').all().forEach((item) => {
  item.addEventListener("click", createTemporaryExam);
});

select('[data-action="countdown-exam"]').all().forEach((item) => {
  item.addEventListener("click", createCountdownExam);
});

select('[data-action="random-background"]').all().forEach((item) => {
  item.addEventListener("click", () => showCoverScreen(chooseBackground()));
});

select('[data-action="clear-filter"]').all().forEach((item) => {
  item.addEventListener("click", (event) => {
    document.documentElement.style.filter = "";
    select(event.currentTarget).hide();
  });
});

select('[data-action="removed-slogan"]').all().forEach((item) => {
  item.addEventListener("click", () => {
    showToast(`哥们就写点代码，别给哥们找麻烦。
    <span class="shield">尝试修改大标语时触发</span>
    <p class="dim">哥们2021年4月开始做这个项目，现在都三年多了，目前靠几个学弟更新考试时间。你说你玩心重，想改考试时钟大标语，哥们当年费大劲写堆代码，现在告状到我这边，哥们又得删删补补。要是真对网页感兴趣，别图一时修改爽快，建议来维护项目，看看能干几年。</p>
    `);
  });
});

select('[data-action="adjust-start"]').all().forEach((item) => {
  item.addEventListener("click", () => adjustMinutes(engine.start, "开始时间"));
});

select('[data-action="adjust-end"]').all().forEach((item) => {
  item.addEventListener("click", () => adjustMinutes(engine.end, "结束时间"));
});

select('[data-action="fullscreen"]').all().forEach((item) => {
  item.addEventListener("click", toggleFullscreen);
});

window.addEventListener("popstate", () => {
  const type = readQueryParams().type;
  if (type in exams) engine.switch(type);
});

loadLastCommitTime(select("#last-commit-time").element, "L33Z22L11/ExamClock");
startExamClock(showCoverScreen);
