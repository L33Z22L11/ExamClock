/*
 * 封面过渡动画：沿用旧版 cover tip 和切换节奏。
 */
import { engine, exams } from "../engine/clock.js";
import { select } from "../utils/dom.js";
import { currentBackground } from "./gallery.js";

const fadeStartDelay = 2_000;
const hideDelay = 2_500;
const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];

const cover = select("#cover-screen").element;
const coverImage = select("#cover-image").element;
const coverDateBadges = select("#cover-date-badge p").all();

const coverTips = [
  "来学习！咕！咕！咕咕咕！",
  "新版本请多多关照！发现bug请拨打：QQ2399052066",
  "关注纸鹿本鹿谢谢喵～",
  "野生技协会一直陪伴着你。。只要你需要技术协助的话！",
  "希望野生技协能帮助你们到天长地久，抱抱",
  "8.0啦，大家都长大啦ww",
  "我觉得生发剂不一定有用，得植发",
  "诶…防脱洗发水用完了…",
  "猜猜你要重新加载多少次才能再看到这条tip￣︶￣",
  "这是一条属于8.0版本的Tips！",
  "print(\"Hello tips8.0\");",
  "来猜猜看这边有几个有用的信息呢~",
  "你知道吗？其实tips全都是废话（确信",
  "啊！要给你看什么Tip好呢…(翻",
  "上次看到这条Tip还是在上次",
];

coverDateBadges[0].textContent = new Date().getDate();
coverDateBadges[1].textContent = monthLabels[new Date().getMonth()];

export function showCoverScreen(message) {
  try {
    const galleryItem = currentBackground;
    select("#gallery-hook").html(`${galleryItem.author} - ${galleryItem.name} (${galleryItem.collectionName})`);
    cover.style.backgroundImage = `url(${galleryItem.url})`;
    coverImage.style.backgroundImage = `url(${galleryItem.url})`;

    const currentExam = exams[engine.current];
    select("#cover-title").html(currentExam.type);
    select("#cover-author").html(currentExam.author);
    select("#cover-origin").html(currentExam.origin);
  } catch { }

  select("#cover-tips").html(message || pickOne(coverTips));

  cover.style.display = "flex";
  setTimeout(() => { cover.style.opacity = ""; }, 0);
  setTimeout(() => { cover.style.opacity = "0"; }, fadeStartDelay);
  setTimeout(() => { cover.style.display = ""; }, hideDelay);

  return message;
}

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}
