/*
 * 页面交互
 */
import { select } from "../utils/dom.js";
import { showToast } from "./toast.js";

const fullscreenButton = select("#fullscreen-button").element;

// 全屏
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

export function showRemovedFeatureNotice(shield) {
  showToast(`这个功能已经移除。<span class="shield">${shield}</span>
  <p class="dim">考试时钟目前以排期展示和临时倒计时为主，建议把可长期维护的能力放进配置或模块里。</p>
  `);
}
