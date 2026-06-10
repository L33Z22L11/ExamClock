import { showToast } from "../features/toast.js";
import { select } from "../utils/dom.js";
import { queryParams } from "../utils/query-params.js";
import { createToday, formatClockTime, MS_PER_HOUR, MS_PER_MINUTE, padTwoDigits } from "../utils/time.js";

const DEFAULT_ADMIT_MINUTES = 20;
const STARTING_SOON_WINDOW_MINUTES = 20;
const COVER_REFRESH_DELAY = 500;
const FULL_PROGRESS = 100;
const HALF_PROGRESS = 0.5;
const ZERO_PROGRESS = 0;
const LOG_TIMEZONE = "+08:00";
const DEFAULT_MAIN_SLOGAN = "沉着冷静&emsp;诚信考试";
const EMPTY_SLOGAN_LIST = [""];
const ACTIVITY_WAITING = "距离入场";
const ACTIVITY_STARTING = "距离开考";
const ACTIVITY_ELAPSED = "已用";
const ACTIVITY_REMAINING = "剩余";
const INJECTED_SLOGAN = "临时大标语: ";
const DEFAULT_SLOGAN = "默认大标语: ";
const INJECTED_ROLL_SLOGAN = "\n临时小标语: ";
const DEFAULT_ROLL_SLOGAN = "\n默认小标语: ";

const noop = () => {};
let coverPlayer = noop;

export let now = new Date();

export function setClockCoverPlayer(player) {
  coverPlayer = player;
}

export function setNow(value) {
  now = value;
  return now;
}

const today = createToday();

console.log(today);

const schedules = {};

const sloganRotator = {
  update() {
    this.main = this.main || this.$main;
    this.roll = this.roll || this.$roll;
    this.subnum = this.subnum < this.roll.length - 1 ? this.subnum + 1 : 0;

    select("#main-slogan").html(this.main || this.$main);
    select("#sub-slogan").html((this.roll || this.$roll)[this.subnum]);
  },
};

const countdownDisplay = {
  update() {
    select("#clock").html(formatClockTime(now));

    if (now >= engine.end) {
      schedules[engine.current].schedule();
      engine.duration = engine.duration;
    }

    this.setCurrentStage();
    select("#bar").style("width", `${this.progress}%`);
    select("#timer").html(this.num);
    select("#timer-unit").html(this.roll);
    select("#activity").html(this.activity);
  },

  setCurrentStage() {
    const admitMs = engine.admit * MS_PER_MINUTE;
    const admitAt = engine.start - admitMs;
    const startingSoonAt = admitAt - STARTING_SOON_WINDOW_MINUTES * MS_PER_MINUTE;

    if (now < startingSoonAt) {
      this.num = ((admitAt - now) / MS_PER_HOUR).toFixed((admitAt - now) / MS_PER_HOUR >= 10 ? 0 : 1);
      this.roll = "h";
      this.activity = ACTIVITY_WAITING;
      this.progress = ZERO_PROGRESS;
      return;
    }

    if (now < admitAt) {
      this.num = Math.round((admitAt - now) / MS_PER_MINUTE);
      this.roll = "min";
      this.activity = ACTIVITY_WAITING;
      this.progress = ZERO_PROGRESS;
      return;
    }

    if (now < engine.start) {
      this.num = Math.round((engine.start - now) / MS_PER_MINUTE);
      this.roll = "min";
      this.activity = ACTIVITY_STARTING;
      this.progress = (engine.start - now) / admitMs * FULL_PROGRESS;
      return;
    }

    if (now < engine.end) {
      const progress = (now - engine.start) / (engine.end - engine.start);
      const elapsed = progress < HALF_PROGRESS;

      this.num = Math.round((elapsed ? now - engine.start : engine.end - now) / MS_PER_MINUTE);
      this.roll = "min";
      this.activity = elapsed ? ACTIVITY_ELAPSED : ACTIVITY_REMAINING;
      this.progress = progress * FULL_PROGRESS;
      return;
    }

    engine.name = "";
    this.num = "";
    this.roll = "";
    this.activity = "";
    this.progress = FULL_PROGRESS;
  },
};

const engine = {
  get name() {
    return select("#subject").html();
  },
  set name(name) {
    select("#subject").html(name);
  },
  get duration() {
    if (now > this.end) return "";
    return `${formatClockTime(this.start)}~${formatClockTime(this.end)}`;
  },
  set duration(duration) {
    select("#duration").html(duration);
  },
  switch(type) {
    if (!(type in schedules)) {
      return showToast(`没有 ${type} 考试类型，切换失败。`);
    }

    if (queryParams.debug) setNow(new Date(0));
    this.name = "";
    this.start = this.end = new Date(0);
    this.current = type;
    this.$admit = schedules[type].earlyAdmit ?? DEFAULT_ADMIT_MINUTES;

    countdownDisplay.progress = ZERO_PROGRESS;
    sloganRotator.main = "";
    sloganRotator.roll = "";
    sloganRotator.subnum = 0;
    sloganRotator.$main = schedules[type].mainSlogan ?? DEFAULT_MAIN_SLOGAN;
    sloganRotator.$roll = schedules[type].rollSlogan ?? EMPTY_SLOGAN_LIST;

    schedules[this.current].schedule();
    sloganRotator.update();
    select("#exam-type-current").html(schedules[this.current].type);

    if (queryParams.debug == null) coverPlayer();

    setTimeout(() => {
      countdownDisplay.update();
      sloganRotator.update();
    }, COVER_REFRESH_DELAY);
  },
};

function createTemporaryExam(subjectName, startHour, startMinute, endHour, endMinute) {
  engine.end = new Date(0);

  if (!(subjectName = prompt("考试科目名称(3个字以内)", "考练")) ||
    !(startHour = prompt("考试开始时间(小时)", 16)) ||
    !(startMinute = prompt("考试开始时间(分钟)", 25)) ||
    !(endHour = prompt("考试结束时间(小时)", 23)) ||
    !(endMinute = prompt("考试结束时间(分钟)", 55))) {
    return console.warn(showToast("由于操作取消，未生成临时科目。"));
  }

  patchSchedule(
    subjectName,
    today.date,
    `${padTwoDigits(startHour)}:${padTwoDigits(startMinute)}`,
    `${padTwoDigits(endHour)}:${padTwoDigits(endMinute)}`,
  );
  console.log(showToast(`添加了一门在 ${today.date} 从 ${formatClockTime(engine.start)} 到 ${formatClockTime(engine.end)} 的科目: ${subjectName}`));
  if (engine.end < now) console.log(showToast("设置的结束时间小于当前时间，你是认真的吗？"));
}

function createCountdownExam(minutes) {
  engine.end = new Date(0);

  if (!(minutes = prompt("倒计时分钟数", 20))) {
    return console.warn(showToast("由于操作取消，未生成临时科目。"));
  }

  const end = new Date(now);
  end.setMinutes(end.getMinutes() + Number(minutes));
  patchSchedule(
    "⏱️",
    today.date,
    `${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}`,
    `${padTwoDigits(end.getHours())}:${padTwoDigits(end.getMinutes())}`,
  );
  console.log(showToast(`添加了一个 ${today.date} 从 ${formatClockTime(engine.start)} 到 ${formatClockTime(engine.end)} 的倒计时`));
  if (end < now) console.log(showToast("时光无法回溯……"));
}

/**
 * 注入当前有效或即将开始的单场考试。
 *
 * @param {string} toSubject 科目名称。
 * @param {string} toDate 日期，格式为 `yyyy-mm-dd`。
 * @param {string} toStart 开始时间，格式为 `hh:mm`。
 * @param {string} toEnd 结束时间，格式为 `hh:mm`。
 * @param {string|null} [toMainslogan] 临时大标语。
 * @param {string[]|null} [toRollslogan] 临时滚动小标语。
 * @param {number|null} [toAdmit] 提前入场分钟数。
 */
function patchSchedule(toSubject, toDate, toStart, toEnd, toMainslogan, toRollslogan, toAdmit) {
  const startAt = new Date(`${toDate}T${toStart}${LOG_TIMEZONE}`);
  const endAt = new Date(`${toDate}T${toEnd}${LOG_TIMEZONE}`);

  if (now < engine.end) {
    console.log(`当前科目未结束，故不注入科目: ${toSubject}`);
    return;
  }

  if (now >= endAt) {
    console.log(`请求科目已结束，故不注入科目: ${toSubject}`);
    return;
  }

  engine.name = toSubject;
  engine.start = startAt;
  engine.end = endAt;
  engine.duration = engine.duration;
  engine.admit = toAdmit ?? engine.$admit;
  sloganRotator.main = toMainslogan ?? sloganRotator.$main;
  sloganRotator.roll = toRollslogan ?? sloganRotator.$roll;
  sloganRotator.update();

  const mainSloganLabel = toMainslogan != null ? INJECTED_SLOGAN : DEFAULT_SLOGAN;
  const rollSloganLabel = toRollslogan != null ? INJECTED_ROLL_SLOGAN : DEFAULT_ROLL_SLOGAN;
  console.log(
    `[${new Date()}]\n当前时间: ${now}\n注入科目: ${toSubject}\n开始时间: ${toDate}`,
    `${toStart}\n结束时间: ${toDate}`,
    `${toEnd}\n提前入场: ${engine.admit} min\n${mainSloganLabel}${sloganRotator.main}${rollSloganLabel}${sloganRotator.roll}`,
  );
}

function adjustMinutes(date, friendlyName) {
  date.setMinutes(date.getMinutes() + Number(prompt(`以分钟为单位增减${friendlyName || formatClockTime(date)}`, -5)));
  select("#duration").html(engine.duration);
}

export {
  patchSchedule,
  adjustMinutes,
  countdownDisplay,
  createCountdownExam,
  createTemporaryExam,
  engine,
  schedules,
  formatClockTime,
  padTwoDigits,
  sloganRotator,
  today,
};
