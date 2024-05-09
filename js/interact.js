/* 
 * 页面交互
 */

var eleFullscreen = document.getElementById("fullscreen");

// 全屏
function fullscreen() {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      eleFullscreen.setAttribute("class", "fa-solid fa-expand");
      eleFullscreen.setAttribute("data-sub", "全屏");
    } else {
      document.documentElement.requestFullscreen();
      eleFullscreen.setAttribute("class", "fa-solid fa-compress");
      eleFullscreen.setAttribute("data-sub", "退出");
    }
  } catch (e) { console.warn(send("操作失败，请手动最大化窗口或全屏。<span class='dim'>建议使用Chrome/Edge/Firefox浏览器。</span>\n") + e); }
}
