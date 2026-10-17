export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;
export const MS_PER_WEEK = 7 * MS_PER_DAY;

const WEEK_START = parseDate("2022-02-06");
const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/**
 * 将 `yyyy-mm-dd` 转成不受零基月份影响的本地日期。
 *
 * @param {string} value 日期字符串。
 * @returns {Date}
 */
export function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 格式化日期为排期配置使用的 `yyyy-mm-dd`。
 *
 * @param {Date} date 日期对象。
 * @returns {string}
 */
export function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * 格式化时间为页面展示使用的 `h:mm`。
 *
 * @param {Date} date 日期对象。
 * @returns {string}
 */
export function formatClockTime(date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/**
 * 计算距离某一天还有多少天。
 *
 * @param {Date|string} date 目标日期或 `yyyy-mm-dd` 字符串。
 * @param {Date|number} [base=Date.now()] 当前时间。
 * @returns {number}
 */
export function daysUntil(date, base = Date.now()) {
  return Math.floor(((typeof date === "string" ? parseDate(date) : date) - base) / MS_PER_DAY);
}

/**
 * 生成考试排期所需的“今天”快照。
 *
 * @param {Date} [date=new Date()] 当前日期。
 * @returns {{date: string, week: number, day: number, weekday: string, isSummer: boolean}}
 */
export function createToday(date = new Date()) {
  return {
    date: formatDate(date),
    week: Math.floor((date - WEEK_START) / MS_PER_WEEK),
    day: date.getDay(),
    weekday: WEEKDAYS[date.getDay()],
    isSummer: date.getMonth() > 3 && date.getMonth() < 9,
  };
}
