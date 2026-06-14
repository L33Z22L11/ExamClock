/*
 * 页面提示、菜单和少量浏览器交互
 */
import { select } from "../utils/dom.js";

const TOAST_HIDE_DELAY = 30_000;
let toastTimer = null;

const messageToast = select("#message-toast").element;
const fullscreenButton = select("#fullscreen-button").element;
select("#message-toast").hide();

export function renderExamMenu(target, exams, group) {
  const container = select(target).element;
  if (!container) return;

  const actionEntry = select("[data-action]", container).element;
  Object.entries(exams).forEach(([type, schedule]) => {
    if (schedule.hidden || (schedule.menu ?? "main") !== group) return;

    const item = document.createElement("a");
    item.dataset.examType = type;
    item.textContent = schedule.displayName ?? schedule.type;
    container.insertBefore(item, actionEntry);
  });
}

export function showToast(message) {
  select("#message-toast").show();
  select("#message-content").html(message);
  clearInterval(toastTimer);
  toastTimer = setInterval(() => select("#message-toast").hide(), TOAST_HIDE_DELAY);
  return message;
}

export function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      select(fullscreenButton).attr("class", "fa-solid fa-expand");
      select(fullscreenButton).attr("data-sub", "全屏");
    } else {
      document.documentElement.requestFullscreen();
      select(fullscreenButton).attr("class", "fa-solid fa-compress");
      select(fullscreenButton).attr("data-sub", "退出");
    }
  } catch (error) {
    console.warn(`${showToast("操作失败，请手动最大化窗口或全屏。<span class='dim'>建议使用 Chrome/Edge/Firefox 浏览器。</span>\n")}${error}`);
  }
}

export function loadLastCommitTime(element, repo) {
  fetch(`https://ungh.cc/repos/${repo}`)
    .then((response) => response.json())
    .then(({ repo }) => {
      select(element).text(`${new Date(repo.updatedAt).toLocaleString()}`);
    })
    .catch((error) => {
      select(element).text("(获取失败)");
      select(element).attr("title", error);
    });
}

messageToast.addEventListener("click", () => select(messageToast).hide());
