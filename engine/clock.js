/*
 * 时钟主逻辑：沿用旧版 subject/exams/slogan/timer 的直白语义，只换成 ES Modules 导出。
 */
import { showToast } from "../scripts/page.js";
import { queryParams } from "../utils/query-params.js";
import { createToday, formatDate, formatClockTime, MS_PER_HOUR, MS_PER_MINUTE } from "../utils/time.js";

const defaultAdmitMinutes = 20;
const minuteCountdownWindow = 20;
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

    document.querySelector("#main-slogan").innerHTML = main;
    document.querySelector("#sub-slogan").innerHTML = roll[this.index] ?? "";
    this.index = (this.index + 1) % (roll.length || 1);
  },
};

export const timer = {
  progress: 0,
  value: "",
  unit: "",
  label: "",

  update() {
    document.querySelector("#clock").textContent = formatClockTime(engine.now);

    // 刷新日常排期使用的日期，但保留仍在进行的跨午夜科目。
    if (!queryParams.debug && today.date !== formatDate(engine.now)) {
      Object.assign(today, createToday(engine.now));
    }

    if (engine.now >= engine.end) {
      exams[engine.current]?.schedule();
      document.querySelector("#duration").textContent = engine.duration;
    }

    this.updateStage();
    document.querySelector("#bar").style.width = `${this.progress}%`;
    document.querySelector("#timer").textContent = this.value;
    document.querySelector("#timer-unit").textContent = this.unit;
    document.querySelector("#activity").textContent = this.label;
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
    return document.querySelector("#subject").textContent;
  },

  set name(name) {
    document.querySelector("#subject").textContent = name;
  },

  get duration() {
    if (this.now >= this.end) return "";
    return `${formatClockTime(this.start)}~${formatClockTime(this.end)}`;
  },

  switch(type) {
    const exam = exams[type];
    if (!Object.hasOwn(exams, type)) return showToast(`没有 ${type} 考试类型，切换失败。`);

    if (queryParams.debug) this.now = new Date(0);

    this.name = "";
    // 清空上一场的截止时间，允许切回时间更早、但尚未结束的排期。
    this.start = new Date(0);
    this.end = new Date(0);
    this.current = type;
    this.defaultAdmitMinutes = exam.earlyAdmit ?? defaultAdmitMinutes;
    timer.progress = 0;
    slogan.reset(exam);

    exam.schedule();
    if (this.end.getTime() === 0) slogan.update();
    document.querySelector("#exam-type-current").textContent = exam.type;

    timer.update();
    document.querySelector("#duration").textContent = this.duration;
  },
};

export function createTemporaryExam() {
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

  const parts = [startHour, startMinute, endHour, endMinute].map(Number);
  if (parts.some((value, index) => !Number.isInteger(value) || value < 0 || value > (index % 2 ? 59 : 23))) {
    return showToast("请输入有效的小时（0~23）和分钟（0~59）。");
  }
  const [startH, startM, endH, endM] = parts.map(value => String(value).padStart(2, "0"));
  const startTime = `${startH}:${startM}`;
  const endTime = `${endH}:${endM}`;
  const start = atLocalTime(today.date, startTime);
  const end = atLocalTime(today.date, endTime);
  if (end <= engine.now) return console.warn(showToast("设置的结束时间小于当前时间，你是认真的吗？"));
  if (end <= start) return showToast("结束时间应晚于开始时间。");
  engine.end = new Date(0);
  patchSchedule(subjectName, today.date, startTime, endTime);

  console.log(showToast(`添加了一门在 ${today.date} 从 ${formatClockTime(engine.start)} 到 ${formatClockTime(engine.end)} 的科目：${subjectName}`));
  timer.update();
}

export function createCountdownExam() {
  const minutes = prompt("倒计时分钟数", 20);
  if (!minutes) return console.warn(showToast("由于操作取消，未生成临时科目。"));

  const duration = Number(minutes) * MS_PER_MINUTE;
  const end = new Date(engine.now.getTime() + duration);
  if (duration < 0) return console.warn(showToast("编写本功能的加零提示：时光无法回溯……"));
  if (!Number.isFinite(duration) || duration <= 0 || Number.isNaN(end.getTime())) {
    return showToast("请输入大于零的有效分钟数。");
  }
  // 直接使用时间戳，保留秒数并支持跨午夜倒计时。
  engine.name = "⏱️";
  engine.start = new Date(engine.now);
  engine.end = end;
  slogan.main = slogan.defaultMain;
  slogan.roll = slogan.defaultRoll;
  slogan.index = 0;
  slogan.update();
  document.querySelector("#duration").textContent = engine.duration;
  timer.update();
  console.log(showToast(`添加了一个 ${formatDate(engine.start)} 从 ${formatClockTime(engine.start)} 到 ${formatClockTime(end)} 的倒计时`));
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

  if (!Number.isFinite(startAt.getTime()) || !Number.isFinite(endAt.getTime()) || endAt <= startAt) {
    console.warn(`科目时间无效，故不注入科目：${subject}`);
    return;
  }

  if (engine.now < engine.end) {
    console.debug(`当前科目未结束，故不注入科目：${subject}`);
    return;
  }
  if (engine.now >= endAt) {
    console.debug(`请求科目已结束，故不注入科目：${subject}`);
    return;
  }

  engine.name = subject;
  engine.start = startAt;
  engine.end = endAt;
  document.querySelector("#duration").textContent = engine.duration;
  engine.admitMinutes = admitMinutes ?? engine.defaultAdmitMinutes;
  slogan.main = mainSlogan ?? slogan.defaultMain;
  slogan.roll = rollSlogans ?? slogan.defaultRoll;
  slogan.index = 0;
  slogan.update();

  console.log(
    `[${new Date()}]\n当前时间：${engine.now}\n注入科目：${subject}\n开始时间：${date}`,
    `${startTime}\n结束时间：${date}`,
    `${endTime}\n提前入场：${engine.admitMinutes} min\n${mainSlogan == null ? "默认大标语：" : "临时大标语："}${slogan.main}${rollSlogans == null ? "\n默认小标语：" : "\n临时小标语："}${slogan.roll}`,
  );
}

export function adjustMinutes(date, label = formatClockTime(date)) {
  const minutes = prompt(`以分钟为单位增减${label}`, -5);
  if (minutes == null || !Number.isFinite(Number(minutes))) return;

  date.setMinutes(date.getMinutes() + Number(minutes));
  document.querySelector("#duration").textContent = engine.duration;
}

function atLocalTime(date, time) {
  return new Date(`${date}T${time}${localTimeZone}`);
}
