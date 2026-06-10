import { bindPageActions } from "./features/actions.js";
import { showCoverScreen } from "./features/cover.js";
import { selectGalleryItem, setGalleryCoverPlayer } from "./features/gallery.js";
import { toggleFullscreen, showRemovedFeatureNotice } from "./features/page-actions.js";
import { loadLastCommitTime } from "./features/updates.js";
import {
  adjustMinutes,
  createCountdownExam,
  createTemporaryExam,
  engine,
  schedules,
  setClockCoverPlayer,
} from "./engine/schedule-clock.js";
import "./config/exam.js";
import { startExamClock } from "./engine/startup.js";
import { select } from "./utils/dom.js";
import { readQueryParams, setRouteParam } from "./utils/query-params.js";

setClockCoverPlayer(showCoverScreen);
setGalleryCoverPlayer(showCoverScreen);

bindPageActions({
  schedules,
  switchExam: (type) => {
    engine.switch(type);
    setRouteParam("type", type);
  },
  createTemporaryExam,
  createCountdownExam,
  showRandomBackground: () => showCoverScreen(selectGalleryItem()),
  clearFilter: (event) => {
    document.documentElement.style.filter = "";
    select(event.currentTarget).hide();
  },
  showRemovedSloganNotice: () => showRemovedFeatureNotice("尝试修改大标语时触发"),
  adjustStart: () => adjustMinutes(engine.start, "开始时间"),
  adjustEnd: () => adjustMinutes(engine.end, "结束时间"),
  toggleFullscreen,
});

window.addEventListener("popstate", () => {
  const type = readQueryParams().type;
  if (type in schedules) engine.switch(type);
});

loadLastCommitTime(select("#last-commit-time").element, "L33Z22L11/ExamClock");
startExamClock();
