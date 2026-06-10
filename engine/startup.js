import { queryParams, setRouteParam } from "../utils/query-params.js";
import { schedules, now, setNow, sloganRotator, engine, countdownDisplay, today } from "./schedule-clock.js";
import { select } from "../utils/dom.js";
import { MS_PER_HOUR } from "../utils/time.js";

const DEBUG_TICK_MS = 25;
const DEBUG_STEP_RATIO = 0.025;
const CLOCK_TICK_MS = 2_000;
const SLOGAN_ROTATE_INTERVAL = 3_000;
const OFFICIAL_HOST = "exam.thisis.host";
const LEGACY_HOST = "exam.cooo.site";
const MEMORIAL_DATES = /-12-06|-12-13/;

function warnIf(condition, html) {
  if (!condition) return;
  select("#verify-toast").display("block");
  select("#verify-content").html(html);
}

export function startExamClock() {
  showRuntimeNotices();
  selectInitialSchedule();

  if (queryParams.debug) {
    setNow(new Date(0));
    select("#bar").style("transition", "none");
    updateDebugClock();
  } else {
    updateClock();
  }

  setInterval(() => sloganRotator.update(), SLOGAN_ROTATE_INTERVAL);
  applyMemorialFilter();
}

function showRuntimeNotices() {
  warnIf(
    location.host !== OFFICIAL_HOST,
    "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host'>点击访问考试时钟在线官网 exam.thisis.host</a></u>",
  );
  warnIf(
    document.referrer.match(LEGACY_HOST),
    "检测到跳转自旧网址，请勿依赖此方式访问考试时钟。建议收藏本页或在考试时钟菜单内下载快捷方式。",
  );
  warnIf(
    queryParams.debug,
    `您目前处于 ${queryParams.debug} 倍时间流速的科目检查(调试)模式。<u><a href='?'>点击返回正常模式</a></u>`,
  );
}

function selectInitialSchedule() {
  if (queryParams.type in schedules) {
    engine.switch(queryParams.type);
    return;
  }

  if (today.date in schedules) {
    engine.switch(today.date);
    setRouteParam("type", today.date, { replace: true });
    return;
  }

  const defaultType = Object.keys(schedules)[0];
  engine.switch(defaultType);
  setRouteParam("type", defaultType, { replace: true });
}

function updateDebugClock() {
  try { select("#cover-launch").remove(); } catch (error) { }

  if (now < engine.start - MS_PER_HOUR) setNow(new Date(engine.start - MS_PER_HOUR));
  if (now > Number(engine.end) + MS_PER_HOUR) engine.switch(engine.current);

  now.setSeconds(now.getSeconds() + queryParams.debug * DEBUG_STEP_RATIO);
  countdownDisplay.update();
  setTimeout(updateDebugClock, DEBUG_TICK_MS);
}

function updateClock() {
  setNow(new Date());

  if (!Number.isNaN(Number(queryParams.tos))) {
    now.setSeconds(now.getSeconds() + Number(queryParams.tos));
  }

  countdownDisplay.update();
  setTimeout(updateClock, CLOCK_TICK_MS);
}

function applyMemorialFilter() {
  if (!today.date.match(MEMORIAL_DATES)) return;

  document.documentElement.style.filter = "grayscale(1)";
  select("#filter-switch").show();
}
