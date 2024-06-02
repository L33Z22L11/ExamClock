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

function sendFeatureRemoved(shield) {
  send(`哥们就写点代码，别给哥们找麻烦。
  <span class="shield">${shield}</span>
  <p class="dim">哥们2021年4月开始做这个项目，现在都三年多了，目前靠几个学弟更新考试时间。你说你玩心重，想改考试时钟大标语，哥们当年费大劲写堆代码，现在告状到我这边，哥们又得删删补补。要是真对网页感兴趣，别图一时修改爽快，建议来维护项目，看看能干几年。</p>
  `);
}
