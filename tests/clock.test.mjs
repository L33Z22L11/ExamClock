import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
process.env.TZ = "Asia/Shanghai";

// 只模拟页面边界；排期、计时和路由使用实际模块。
const elements = new Map();
const events = new Map();
const timeouts = [];
mock.method(globalThis, "setTimeout", (callback, delay) => {
  const task = { callback, delay, cancelled: false };
  timeouts.push(task);
  return task;
});
mock.method(globalThis, "clearTimeout", (task) => { if (task) task.cancelled = true; });
mock.method(globalThis, "setInterval", () => 1);
mock.method(console, "log", () => {});
mock.method(console, "warn", () => {});
mock.method(console, "debug", () => {});
globalThis.document = {
  referrer: "",
  documentElement: { style: {} },
  body: { style: {} },
  addEventListener(name, callback) { events.set(name, callback); },
  querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      style: {}, dataset: {}, innerHTML: "", textContent: "", removed: false,
      remove() { this.removed = true; }, addEventListener() {},
    });
    return elements.get(selector);
  },
};
globalThis.location = new URL("https://exam.thisis.host/");
const historyCalls = [];
globalThis.history = Object.fromEntries(["pushState", "replaceState"].map((method) => [method,
  (_, __, url) => { historyCalls.push(method); globalThis.location = new URL(url); },
]));
globalThis.prompt = () => null;

const { engine, exams, timer, slogan, today, patchSchedule, createTemporaryExam, createCountdownExam } = await import("../engine/clock.js");
const { queryParams, readQueryParams, setRouteParam } = await import("../utils/query-params.js");
const { selectInitialSchedule, startExamClock } = await import("../engine/startup.js");
const { showCoverScreen } = await import("../scripts/cover.js");
const { showToast, toggleFullscreen } = await import("../scripts/page.js");
const { createToday } = await import("../utils/time.js");

beforeEach(() => {
  for (const name of Object.keys(exams)) delete exams[name];
  globalThis.location = new URL("https://exam.thisis.host/");
  globalThis.prompt = () => null;
  Object.assign(queryParams, { type: undefined, debug: 0, tos: 0 });
  Object.assign(engine, {
    current: "", now: new Date("2026-10-17T08:00:00+08:00"),
    start: new Date(0), end: new Date(0), defaultAdmitMinutes: 20, admitMinutes: 20,
  });
  Object.assign(today, createToday(engine.now));
  slogan.reset({});
  timeouts.length = historyCalls.length = 0;
});

test("排期忽略已结束科目、保留进行中的科目，并在结束时接续下一场", () => {
  exams.sample = { type: "测试", schedule() {
    patchSchedule("已结束", "2026-10-17", "06:00", "07:00");
    patchSchedule("语文", "2026-10-17", "09:00", "11:00");
    patchSchedule("数学", "2026-10-17", "14:00", "16:00");
  } };
  engine.switch("sample");
  assert.equal(engine.name, "语文");
  assert.equal(engine.duration, "9:00~11:00");
  engine.now = new Date("2026-10-17T11:00:00+08:00");
  timer.update();
  assert.equal(engine.name, "数学");
  engine.now = new Date("2026-10-17T16:00:00+08:00");
  timer.update();
  assert.equal(engine.name, "");
  assert.equal(engine.duration, "");
  assert.equal(timer.progress, 100);
});

test("入场、开考、前后半程的计时阶段保持正确", () => {
  patchSchedule("语文", "2026-10-17", "09:00", "11:00");
  for (const [time, label, value, progress] of [
    ["08:30", "距离入场", 10, 0], ["08:50", "距离开始", 10, 50],
    ["09:30", "已经开始", 30, 25], ["10:30", "距离结束", 30, 75],
  ]) {
    engine.now = new Date(`2026-10-17T${time}:00+08:00`);
    timer.updateStage();
    assert.deepEqual([timer.label, timer.value, timer.progress], [label, value, progress]);
  }
});

test("从下午排期切回上午时先清空 end，较早场次能重新注入", () => {
  exams.later = { type: "下午", schedule() { patchSchedule("数学", "2026-10-17", "14:00", "16:00"); } };
  exams.earlier = { type: "上午", schedule() { patchSchedule("语文", "2026-10-17", "09:00", "11:00"); } };
  engine.switch("later");
  assert.equal(engine.name, "数学");
  engine.switch("earlier");
  assert.equal(engine.name, "语文");
  assert.equal(engine.end.toISOString(), "2026-10-17T03:00:00.000Z");
});

test("临时考试可覆盖原来更晚的场次，同时支持零分钟输入", () => {
  engine.now = new Date(`${today.date}T08:00:00+08:00`);
  patchSchedule("数学", today.date, "14:00", "16:00");
  const answers = ["语文", "9", "0", "11", "0"];
  globalThis.prompt = () => answers.shift();
  createTemporaryExam();
  assert.equal(engine.name, "语文");
  assert.equal(engine.duration, "9:00~11:00");
});

test("取消或输入无效值不会破坏当前考试", () => {
  patchSchedule("语文", "2026-10-17", "09:00", "11:00");
  const end = engine.end;
  createTemporaryExam();
  createCountdownExam();
  assert.equal(engine.end, end);
  for (const value of ["-1", "0", "NaN", "Infinity"]) {
    globalThis.prompt = () => value;
    createCountdownExam();
    assert.equal(engine.end, end);
  }
  const answers = ["测试", "25", "0", "26", "0"];
  globalThis.prompt = () => answers.shift();
  createTemporaryExam();
  assert.equal(engine.end, end);
});

test("倒计时保留秒数并正确跨午夜", () => {
  engine.now = new Date("2026-10-17T23:55:30+08:00");
  globalThis.prompt = () => "20";
  createCountdownExam();
  assert.equal(engine.end - engine.start, 20 * 60_000);
  assert.equal(engine.end.toISOString(), "2026-10-17T16:15:30.000Z");
  assert.equal(engine.name, "⏱️");
});

test("type 优先级、默认路由及无效参数", () => {
  exams.default = { type: "默认", schedule() {} };
  exams[today.date] = { type: "今日", schedule() {} };
  selectInitialSchedule();
  assert.equal(engine.current, today.date);
  assert.deepEqual(historyCalls, ["replaceState"]);
  queryParams.type = "default";
  selectInitialSchedule();
  assert.equal(engine.current, "default");
  delete exams[today.date];
  queryParams.type = "toString";
  selectInitialSchedule();
  assert.equal(engine.current, "default");
  setRouteParam("type", "default");
  assert.equal(historyCalls.at(-1), "pushState");
  for (const value of ["0", "", "-1", "NaN", "Infinity"]) {
    location.search = `?debug=${value}&tos=Infinity`;
    assert.equal(readQueryParams().debug, 0);
    assert.equal(readQueryParams().tos, 0);
  }
});

test("1 倍调试每帧推进 25ms，启动层只在启动时移除", () => {
  location.search = "?debug=1";
  queryParams.debug = 1;
  exams.sample = { type: "调试", schedule() { patchSchedule("语文", "2026-10-17", "09:00", "11:00"); } };
  startExamClock();
  assert.equal(engine.now.getTime(), new Date("2026-10-17T08:00:00+08:00").getTime() + 25);
  const tick = timeouts.find((task) => task.delay === 25);
  const previous = engine.now.getTime();
  tick.callback();
  assert.equal(engine.now.getTime() - previous, 25);
  assert.equal(document.querySelector("#cover-launch").removed, true);
});

test("连续切换封面取消旧计时器，通知只安排一次隐藏", () => {
  showCoverScreen("第一张");
  const first = timeouts.slice();
  showCoverScreen("第二张");
  assert.ok(first.every((task) => task.cancelled));
  assert.equal(document.querySelector("#cover-tips").textContent, "第二张");
  showToast("提示一");
  const toast = timeouts.at(-1);
  showToast("提示二");
  assert.equal(toast.cancelled, true);
  assert.equal(timeouts.at(-1).delay, 30_000);
});

test("全屏失败被捕获，外部退出也更新按钮", async () => {
  document.documentElement.requestFullscreen = async () => { throw new Error("拒绝全屏"); };
  await toggleFullscreen();
  assert.match(document.querySelector("#message-content").innerHTML, /操作失败/);
  document.fullscreenElement = {};
  events.get("fullscreenchange")();
  assert.equal(document.querySelector("#fullscreen-button").dataset.sub, "退出");
  document.fullscreenElement = null;
  events.get("fullscreenchange")();
  assert.equal(document.querySelector("#fullscreen-button").dataset.sub, "全屏");
});

test("每场科目的轮播从第一条开始，空列表不会污染轮播下标", () => {
  exams.sample = { type: "轮播", rollSlogan: ["第一条", "第二条"], schedule() {
    patchSchedule("语文", today.date, "09:00", "11:00");
    patchSchedule("数学", today.date, "14:00", "16:00", null, ["下一场第一条", "下一场第二条"]);
  } };
  engine.switch("sample");
  assert.equal(document.querySelector("#sub-slogan").innerHTML, "第一条");
  slogan.update();
  assert.equal(document.querySelector("#sub-slogan").innerHTML, "第二条");
  engine.now = new Date("2026-10-17T11:00:00+08:00");
  timer.update();
  assert.equal(document.querySelector("#sub-slogan").innerHTML, "下一场第一条");
  slogan.reset({ rollSlogan: [] });
  slogan.update();
  slogan.update();
  assert.equal(slogan.index, 0);
  assert.equal(document.querySelector("#sub-slogan").innerHTML, "");
});

test("跨午夜保留正在运行的倒计时，结束后接入新一天的日常排期", () => {
  exams.daily = { type: "日常", schedule() { patchSchedule("早读", today.date, "06:00", "07:00"); } };
  engine.switch("daily");
  engine.now = new Date("2026-10-17T23:55:30+08:00");
  globalThis.prompt = () => "20";
  createCountdownExam();
  const end = engine.end;
  engine.now = new Date("2026-10-18T00:00:00+08:00");
  timer.update();
  assert.equal(today.date, "2026-10-18");
  assert.equal(today.day, 0);
  assert.equal(engine.end, end);
  assert.equal(engine.name, "⏱️");
  engine.now = new Date(end);
  timer.update();
  assert.equal(engine.name, "早读");
  assert.equal(engine.start.toISOString(), "2026-10-17T22:00:00.000Z");
});

test("无效排期不能污染时钟状态", () => {
  for (const [date, start, end] of [["bad-date", "09:00", "11:00"], [today.date, "11:00", "09:00"], [today.date, "09:00", "09:00"]]) {
    patchSchedule("无效", date, start, end);
    assert.equal(engine.start.getTime(), 0);
    assert.equal(engine.end.getTime(), 0);
  }
  patchSchedule("有效", today.date, "09:00", "11:00");
  assert.equal(engine.name, "有效");
});

test("负数倒计时和过去的结束时间显示原有提示，同时保留当前考试", () => {
  patchSchedule("语文", today.date, "09:00", "11:00");
  const end = engine.end;
  globalThis.prompt = () => "-1";
  createCountdownExam();
  assert.equal(document.querySelector("#message-content").innerHTML, "编写本功能的加零提示：时光无法回溯……");
  assert.equal(engine.end, end);
  const answers = ["测试", "6", "0", "7", "0"];
  globalThis.prompt = () => answers.shift();
  createTemporaryExam();
  assert.equal(document.querySelector("#message-content").innerHTML, "设置的结束时间小于当前时间，你是认真的吗？");
  assert.equal(engine.end, end);
});

test("纪念日启用灰度时，解除滤镜的开关必须显式显示", () => {
  Object.assign(today, createToday(new Date("2026-12-13T08:00:00+08:00")));
  location.search = "?debug=1";
  queryParams.debug = 1;
  exams.sample = { type: "测试", schedule() { patchSchedule("语文", today.date, "09:00", "11:00"); } };
  startExamClock();
  assert.equal(document.documentElement.style.filter, "grayscale(1)");
  assert.equal(document.querySelector("#filter-switch").style.display, "inline-block");
});
