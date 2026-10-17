import { collections } from "../monoroll.js";
import { showCoverScreen } from "./cover.js";
import { chooseBackground, renderGalleryMenu } from "./gallery.js";
import { loadLastCommitTime, logProjectInfo, renderExamMenu, showToast, toggleFullscreen } from "./page.js";
import { adjustMinutes, createCountdownExam, createTemporaryExam, engine, exams } from "../engine/clock.js";
import "../config/exam.js";
import { selectInitialSchedule, startExamClock } from "../engine/startup.js";
import { queryParams, readQueryParams, setRouteParam } from "../utils/query-params.js";

renderExamMenu("#exam-type-list", exams, "main");
renderExamMenu("#social-exam-list", exams, "social");
renderGalleryMenu();
chooseBackground(Object.keys(collections).at(-1));

document.querySelector("#main").addEventListener("click", (event) => {
  const item = event.target.closest("[data-action], [data-exam-type]");
  if (!item) return;

  if (item.dataset.examType) {
    engine.switch(item.dataset.examType);
    setRouteParam("type", item.dataset.examType);
    if (!queryParams.debug) showCoverScreen();
    return;
  }

  switch (item.dataset.action) {
    case "temporary-exam":
      createTemporaryExam();
      break;
    case "countdown-exam":
      createCountdownExam();
      break;
    case "random-background":
      showCoverScreen(chooseBackground(item.dataset.collection));
      break;
    case "clear-filter":
      document.documentElement.style.filter = "";
      item.style.display = "none";
      break;
    case "removed-slogan":
      showToast(`哥们就写点代码，别给哥们找麻烦。
        <span class="shield">尝试修改大标语时触发</span>
        <p class="dim">哥们2021年4月开始做这个项目，现在都三年多了，目前靠几个学弟更新考试时间。你说你玩心重，想改考试时钟大标语，哥们当年费大劲写堆代码，现在告状到我这边，哥们又得删删补补。要是真对网页感兴趣，别图一时修改爽快，建议来维护项目，看看能干几年。</p>`);
      break;
    case "adjust-start":
      adjustMinutes(engine.start, "开始时间");
      break;
    case "adjust-end":
      adjustMinutes(engine.end, "结束时间");
      break;
    case "fullscreen":
      toggleFullscreen();
      break;
  }
});

window.addEventListener("popstate", () => {
  const params = readQueryParams();
  // 调试倍率和校时参数决定时钟循环，跨模式历史导航需重新启动页面。
  if (params.debug !== queryParams.debug || params.tos !== queryParams.tos) {
    location.reload();
    return;
  }
  Object.assign(queryParams, params);
  queryParams.type = params.type;
  selectInitialSchedule();
});

loadLastCommitTime(document.querySelector("#last-commit-time"), "L33Z22L11/ExamClock");
logProjectInfo();
startExamClock();
