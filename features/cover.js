/*
 * 封面过渡动画
 */
import { engine, schedules } from "../engine/schedule-clock.js";
import { select } from "../utils/dom.js";
import { pick } from "../utils/random.js";
import { getCurrentGalleryItem } from "./gallery.js";

const COVER_FADE_START_DELAY = 2_000;
const COVER_HIDE_DELAY = 2_500;
const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];

const cover = select("#cover-screen").element;
const coverImage = select("#cover-image").element;
const coverDateBadges = select("#cover-date-badge p").all();

const coverTips = [
  "祝考试顺利，稳住节奏。",
  "背景来自一卷图库，感谢投稿与维护。",
  "需要临时考试或倒计时，可以从菜单添加。",
  "如果时间不对，先检查设备系统时间。",
  "欢迎继续补充考试安排，让这个小工具活下去。",
];

coverDateBadges[0].textContent = new Date().getDate();
coverDateBadges[1].textContent = MONTH_LABELS[new Date().getMonth()];

export function showCoverScreen(message) {
  try {
    const galleryItem = getCurrentGalleryItem();
    select("#gallery-hook").html(`${galleryItem.author} - ${galleryItem.name} (${galleryItem.collectionName})`);
    cover.style.backgroundImage = `url(${galleryItem.url})`;
    coverImage.style.backgroundImage = `url(${galleryItem.url})`;

    const currentExam = schedules[engine.current];
    select("#cover-title").html(currentExam.type);
    select("#cover-author").html(currentExam.author);
    select("#cover-origin").html(currentExam.origin);
  } catch { }

  select("#cover-tips").html(message || pick(coverTips));

  cover.style.display = "flex";
  setTimeout(() => { cover.style.opacity = ""; }, 0);
  setTimeout(() => { cover.style.opacity = "0"; }, COVER_FADE_START_DELAY);
  setTimeout(() => { cover.style.display = ""; }, COVER_HIDE_DELAY);

  return message;
}
