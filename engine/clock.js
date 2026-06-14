/*
 * 时钟主逻辑：沿用旧版 subject/exams/slogan/timer 的直白语义，只换成 ES Modules 导出。
 */
import { showToast } from "../scripts/page.js";
import { select } from "../utils/dom.js";
import { queryParams } from "../utils/query-params.js";
import { createToday, formatClockTime, MS_PER_HOUR, MS_PER_MINUTE, padTwoDigits } from "../utils/time.js";

const defaultAdmitMinutes = 20;
const minuteCountdownWindow = 20;
const switchDelay = 500;
const localTimeZone = "+08:00";
const defaultSlogan = {
  main: "沉着冷静&emsp;诚信考试",
  roll: [""],
};

export const today = createToday();
export const exams = {};

export const slogan = {
  main: "",
  roll: [],
  index: 0,
  defaultMain: defaultSlogan.main,
  defaultRoll: defaultSlogan.roll,

  reset(exam) {
    this.main = "";
    this.roll = [];
    this.index = 0;
    this.defaultMain = exam.mainSlogan ?? defaultSlogan.main;
    this.defaultRoll = exam.rollSlogan ?? defaultSlogan.roll;
  },

  update() {
    const main = this.main || this.defaultMain;
    const roll = this.roll.length ? this.roll : this.defaultRoll;

    this.index = this.index < roll.length - 1 ? this.index + 1 : 0;
    select("#main-slogan").html(main);
    select("#sub-slogan").html(roll[this.index] ?? "");
  },
};

export const timer = {
  progress: 0,
  value: "",
  unit: "",
  label: "",

  update() {
    select("#clock").html(formatClockTime(engine.now));

    if (engine.now >= engine.end) {
      exams[engine.current]?.schedule();
      engine.duration = engine.duration;
    }

    this.updateStage();
    select("#bar").style("width", `${this.progress}%`);
    select("#timer").html(this.value);
    select("#timer-unit").html(this.unit);
    select("#activity").html(this.label);
  },

  updateStage() {
    const admitMs = engine.admitMinutes * MS_PER_MINUTE;
    const entryAt = engine.start - admitMs;
    const minuteCountdownAt = entryAt - minuteCountdownWindow * MS_PER_MINUTE;

    if (engine.now < minuteCountdownAt) {
      const hours = (entryAt - engine.now) / MS_PER_HOUR;
      this.value = hours.toFixed(hours >= 10 ? 0 : 1);
      this.unit = "h";
      this.label = "距离入场";
      this.progress = 0;
      return;
    }

    if (engine.now < entryAt) {
      this.value = Math.round((entryAt - engine.now) / MS_PER_MINUTE);
      this.unit = "min";
      this.label = "距离入场";
      this.progress = 0;
      return;
    }

    if (engine.now < engine.start) {
      this.value = Math.round((engine.start - engine.now) / MS_PER_MINUTE);
      this.unit = "min";
      this.label = "距离开始";
      this.progress = ((engine.start - engine.now) / admitMs) * 100;
      return;
    }

    if (engine.now < engine.end) {
      const progress = (engine.now - engine.start) / (engine.end - engine.start);
      const showElapsed = progress < 0.5;

      this.value = Math.round((showElapsed ? engine.now - engine.start : engine.end - engine.now) / MS_PER_MINUTE);
      this.unit = "min";
      this.label = showElapsed ? "已经开始" : "距离结束";
      this.progress = progress * 100;
      return;
    }

    engine.name = "";
    this.value = "";
    this.unit = "";
    this.label = "";
    this.progress = 100;
  },
};

export const engine = {
  now: new Date(),
  current: "",
  start: new Date(0),
  end: new Date(0),
  admitMinutes: defaultAdmitMinutes,
  defaultAdmitMinutes,

  get name() {
    return select("#subject").html();
  },

  set name(name) {
    select("#subject").html(name);
  },

  get duration() {
    if (this.now > this.end) return "";
    return `${formatClockTime(this.start)}~${formatClockTime(this.end)}`;
  },

  set duration(duration) {
    select("#duration").html(duration);
  },

  switch(type) {
    const exam = exams[type];
    if (!exam) return showToast(`没有 ${type} 考试类型，切换失败。`);

    if (queryParams.debug) this.now = new Date(0);

    this.name = "";
    this.start = new Date(0);
    this.end = new Date(0);
    this.current = type;
    this.defaultAdmitMinutes = exam.earlyAdmit ?? defaultAdmitMinutes;
    timer.progress = 0;
    slogan.reset(exam);

    exam.schedule();
    slogan.update();
    select("#exam-type-current").html(exam.type);

    setTimeout(() => {
      timer.update();
      slogan.update();
    }, switchDelay);
  },
};

export function createTemporaryExam() {
  engine.end = new Date(0);

  const subjectName = prompt("考试科目名称(3个字以内)", "考练");
  if (!subjectName) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  const startHour = prompt("考试开始时间(小时)", 16);
  if (!startHour) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  const startMinute = prompt("考试开始时间(分钟)", 25);
  if (!startMinute) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  const endHour = prompt("考试结束时间(小时)", 23);
  if (!endHour) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  const endMinute = prompt("考试结束时间(分钟)", 55);
  if (!endMinute) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  patchSchedule(
    subjectName,
    today.date,
    `${padTwoDigits(startHour)}:${padTwoDigits(startMinute)}`,
    `${padTwoDigits(endHour)}:${padTwoDigits(endMinute)}`,
  );

  console.log(showToast(`添加了一门在 ${today.date} 从 ${formatClockTime(engine.start)} 到 ${formatClockTime(engine.end)} 的科目：${subjectName}`));
  if (engine.end < engine.now) console.log(showToast("设置的结束时间小于当前时间，你是认真的吗？"));
}

export function createCountdownExam() {
  engine.end = new Date(0);

  const minutes = prompt("倒计时分钟数", 20);
  if (!minutes) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  const end = new Date(engine.now);
  end.setMinutes(end.getMinutes() + Number(minutes));
  patchSchedule(
    "⏱️",
    today.date,
    `${padTwoDigits(engine.now.getHours())}:${padTwoDigits(engine.now.getMinutes())}`,
    `${padTwoDigits(end.getHours())}:${padTwoDigits(end.getMinutes())}`,
  );

  console.log(showToast(`添加了一个 ${today.date} 从 ${formatClockTime(engine.start)} 到 ${formatClockTime(engine.end)} 的倒计时`));
  if (end < engine.now) console.log(showToast("编写本功能的加零提示：时光无法回溯……"));
}

/**
 * 注入当前有效或即将开始的单场考试。
 *
 * @param {string} subject 科目名称。
 * @param {string} date 日期，格式为 `yyyy-mm-dd`。
 * @param {string} startTime 开始时间，格式为 `hh:mm`。
 * @param {string} endTime 结束时间，格式为 `hh:mm`。
 * @param {string|null} [mainSlogan] 临时大标语。
 * @param {string[]|null} [rollSlogans] 临时滚动小标语。
 * @param {number|null} [admitMinutes] 提前入场分钟数。
 */
export function patchSchedule(subject, date, startTime, endTime, mainSlogan, rollSlogans, admitMinutes) {
  const startAt = atLocalTime(date, startTime);
  const endAt = atLocalTime(date, endTime);

  if (engine.now < engine.end) {
    console.log(`当前科目未结束，故不注入科目：${subject}`);
    return;
  }

  if (engine.now >= endAt) {
    console.log(`请求科目已结束，故不注入科目：${subject}`);
    return;
  }

  engine.name = subject;
  engine.start = startAt;
  engine.end = endAt;
  engine.duration = engine.duration;
  engine.admitMinutes = admitMinutes ?? engine.defaultAdmitMinutes;
  slogan.main = mainSlogan ?? slogan.defaultMain;
  slogan.roll = rollSlogans ?? slogan.defaultRoll;
  slogan.update();

  console.log(
    `[${new Date()}]\n当前时间：${engine.now}\n注入科目：${subject}\n开始时间：${date}`,
    `${startTime}\n结束时间：${date}`,
    `${endTime}\n提前入场：${engine.admitMinutes} min\n${mainSlogan == null ? "默认大标语：" : "临时大标语："}${slogan.main}${rollSlogans == null ? "\n默认小标语：" : "\n临时小标语："}${slogan.roll}`,
  );
}

export function adjustMinutes(date, label = formatClockTime(date)) {
  const minutes = prompt(`以分钟为单位增减${label}`, -5);
  if (minutes == null) return;

  date.setMinutes(date.getMinutes() + Number(minutes));
  select("#duration").html(engine.duration);
}

function atLocalTime(date, time) {
  return new Date(`${date}T${time}${localTimeZone}`);
}

export { formatClockTime, padTwoDigits };
