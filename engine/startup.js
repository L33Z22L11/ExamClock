/*
 * 启动流程：选择初始考试类型，启动真实/调试时钟，并处理页面级运行提示。
 */
import { queryParams, setRouteParam } from "../utils/query-params.js";
import { exams, slogan, engine, timer, today } from "./clock.js";
import { MS_PER_HOUR } from "../utils/time.js";
import { showCoverScreen } from "../scripts/cover.js";

const debugTick = 25;
const clockTick = 2_000;
const sloganRotateInterval = 3_000;
const officialHost = "exam.thisis.host";
const legacyHost = "exam.cooo.site";
const memorialDates = /-12-06|-12-13/;

function warnIf(condition, html) {
  if (!condition) return;
  document.querySelector("#verify-toast").style.display = "block";
  document.querySelector("#verify-content").innerHTML = html;
}

export function startExamClock() {
  showRuntimeNotices();
  engine.now = queryParams.debug ? new Date(0) : new Date(Date.now() + queryParams.tos * 1000);
  selectInitialSchedule();
  console.log(today);
  if (!queryParams.debug) showCoverScreen();

  if (queryParams.debug) {
    document.querySelector("#cover-launch")?.remove();
    document.querySelector("#bar").style.transition = "none";
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
    document.referrer && new URL(document.referrer).hostname === legacyHost,
    "检测到跳转自旧网址，请勿依赖此方式访问考试时钟。建议收藏本页或在考试时钟菜单内下载快捷方式。",
  );
  warnIf(
    queryParams.debug,
    `您目前处于 ${queryParams.debug} 倍时间流速的科目检查(调试)模式。<u><a href='?'>点击返回正常模式</a></u>`,
  );
}

export function selectInitialSchedule() {
  const type = Object.hasOwn(exams, queryParams.type) ? queryParams.type
    : Object.hasOwn(exams, today.date) ? today.date : Object.keys(exams)[0];
  engine.switch(type);
  if (queryParams.type !== type) setRouteParam("type", type, { replace: true });
}

function updateDebugClock() {
  if (engine.now < engine.start - MS_PER_HOUR) engine.now = new Date(engine.start - MS_PER_HOUR);
  if (engine.now > Number(engine.end) + MS_PER_HOUR) engine.switch(engine.current);

  engine.now.setTime(engine.now.getTime() + queryParams.debug * debugTick);
  timer.update();
  setTimeout(updateDebugClock, debugTick);
}

function updateClock() {
  engine.now = new Date(Date.now() + queryParams.tos * 1000);

  timer.update();
  setTimeout(updateClock, clockTick);
}

function applyMemorialFilter() {
  if (!today.date.match(memorialDates)) return;

  document.documentElement.style.filter = "grayscale(1)";
  document.querySelector("#filter-switch").style.display = "inline-block";
}
