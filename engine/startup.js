/*
 * 启动流程：选择初始考试类型，启动真实/调试时钟，并处理页面级运行提示。
 */
import { queryParams, setRouteParam } from "../utils/query-params.js";
import { exams, slogan, engine, timer, today } from "./clock.js";
import { select } from "../utils/dom.js";
import { MS_PER_HOUR } from "../utils/time.js";

const debugTick = 25;
const debugStepRatio = 0.025;
const clockTick = 2_000;
const sloganRotateInterval = 3_000;
const officialHost = "exam.thisis.host";
const legacyHost = "exam.cooo.site";
const memorialDates = /-12-06|-12-13/;

function warnIf(condition, html) {
  if (!condition) return;
  select("#verify-toast").display("block");
  select("#verify-content").html(html);
}

export function startExamClock(showCoverScreen) {
  showRuntimeNotices();
  selectInitialSchedule();
  if (queryParams.debug == null) showCoverScreen?.();

  if (queryParams.debug) {
    engine.now = new Date(0);
    select("#bar").style("transition", "none");
    updateDebugClock();
  } else {
    updateClock();
  }

  setInterval(() => slogan.update(), sloganRotateInterval);
  applyMemorialFilter();
}

function showRuntimeNotices() {
  warnIf(
    location.host !== officialHost,
    "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host'>点击访问考试时钟在线官网 exam.thisis.host</a></u>",
  );
  warnIf(
    document.referrer.match(legacyHost),
    "检测到跳转自旧网址，请勿依赖此方式访问考试时钟。建议收藏本页或在考试时钟菜单内下载快捷方式。",
  );
  warnIf(
    queryParams.debug,
    `您目前处于 ${queryParams.debug} 倍时间流速的科目检查(调试)模式。<u><a href='?'>点击返回正常模式</a></u>`,
  );
}

function selectInitialSchedule() {
  if (queryParams.type in exams) {
    engine.switch(queryParams.type);
    return;
  }

  if (today.date in exams) {
    engine.switch(today.date);
    setRouteParam("type", today.date, { replace: true });
    return;
  }

  const defaultType = Object.keys(exams)[0];
  engine.switch(defaultType);
  setRouteParam("type", defaultType, { replace: true });
}

function updateDebugClock() {
  try { select("#cover-launch").remove(); } catch (error) { }

  if (engine.now < engine.start - MS_PER_HOUR) engine.now = new Date(engine.start - MS_PER_HOUR);
  if (engine.now > Number(engine.end) + MS_PER_HOUR) engine.switch(engine.current);

  engine.now.setSeconds(engine.now.getSeconds() + queryParams.debug * debugStepRatio);
  timer.update();
  setTimeout(updateDebugClock, debugTick);
}

function updateClock() {
  engine.now = new Date();

  if (!Number.isNaN(Number(queryParams.tos))) {
    engine.now.setSeconds(engine.now.getSeconds() + Number(queryParams.tos));
  }

  timer.update();
  setTimeout(updateClock, clockTick);
}

function applyMemorialFilter() {
  if (!today.date.match(memorialDates)) return;

  document.documentElement.style.filter = "grayscale(1)";
  select("#filter-switch").show();
}
