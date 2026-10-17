/*
 * 封面过渡动画：沿用旧版 cover tip 和切换节奏。
 */
import { engine, exams } from "../engine/clock.js";
import { currentBackground } from "./gallery.js";

const fadeStartDelay = 2_000;
const hideDelay = 2_500;
const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];

const cover = document.querySelector("#cover-screen");
const coverImage = document.querySelector("#cover-image");
let fadeTimer;
let hideTimer;
const version = document.querySelector("#app-version").textContent;

const coverTips = [
  "来学习！咕！咕！咕咕咕！",
  "新版本请多多关照！发现bug请拨打：QQ2399052066",
  "关注纸鹿本鹿谢谢喵～",
  "野生技协会一直陪伴着你。。只要你需要技术协助的话！",
  "希望野生技协能帮助你们到天长地久，抱抱",
  `${version}啦，大家都长大啦ww`,
  "我觉得生发剂不一定有用，得植发",
  "诶…防脱洗发水用完了…",
  "猜猜你要重新加载多少次才能再看到这条tip￣︶￣",
  `这是一条属于${version}版本的Tips！`,
  `print("Hello tips${version}");`,
  "来猜猜看这边有几个有用的信息呢~",
  "你知道吗？其实tips全都是废话（确信",
  "啊！要给你看什么Tip好呢…(翻",
  "上次看到这条Tip还是在上次",
];

export function showCoverScreen(message) {
  const date = new Date();
  document.querySelector(".cover-date-day").textContent = date.getDate();
  document.querySelector(".cover-date-month").textContent = monthLabels[date.getMonth()];
  if (currentBackground) {
    const { author, name, collection, url } = currentBackground;
    document.querySelector("#gallery-hook").textContent = `${author} - ${name} (${collection})`;
    cover.style.backgroundImage = coverImage.style.backgroundImage = `url("${url}")`;
  }
  const exam = exams[engine.current];
  document.querySelector("#cover-title").textContent = exam?.type ?? "考试时钟";
  document.querySelector("#cover-author").textContent = exam?.author ?? "野生技协";
  document.querySelector("#cover-origin").textContent = exam?.origin ?? "宝鸡中学";
  document.querySelector("#cover-tips").textContent = message || coverTips[Math.floor(Math.random() * coverTips.length)];

  clearTimeout(fadeTimer);
  clearTimeout(hideTimer);
  cover.style.display = "flex";
  cover.style.opacity = "1";
  fadeTimer = setTimeout(() => { cover.style.opacity = "0"; }, fadeStartDelay);
  hideTimer = setTimeout(() => { cover.style.display = ""; }, hideDelay);
}
