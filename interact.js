/* 
 * 页面交互
 */
var eleMain = document.getElementById("main"),
  eleCP = document.getElementById("cp"),
  eleCPBD = document.getElementById("cpbd"),
  eleSizebar = document.getElementById("sizebar"),
  eleContrastbar = document.getElementById("contrastbar"),
  eleFullscreen = document.getElementById("fullscreen");
// 键盘功能函数
onkeydown = function (e) {
  switch (e.key) {
    // 隐藏右键菜单
    case "Escape": try { eleCP.style.display = "none"; } catch (e) { } break;
  }
};
// 右键控制中心
function displayCP() {
  eleCP.style.display = "";
  eleCP.style.opacity = eleCPBD.style.opacity = 0;
  setTimeout(function () { eleCP.style.opacity = ""; }, 0);
  setTimeout(function () { eleCPBD.style.opacity = ""; }, 50);
}
function hideCP() {
  eleCP.style.opacity = 0;
  setTimeout(function () {
    eleCP.style.display = "none";
    eleCP.style.opacity = "";
  }, 200);
}
eleMain.oncontextmenu = function (e) {
  if (!e.ctrlKey) {
    e.preventDefault();
    displayCP();
  }
};
eleCPBD.onclick = function (e) { hideCP(); }
eleSizebar.firstElementChild.style.width = (parseInt(eleMain.style.fontSize) - 0.75) * 200 + "%";
eleContrastbar.firstElementChild.style.width = (eleMain.style.opacity - 0.5) * 200 + "%";
eleSizebar.onmousedown = eleSizebar.ontouchstart =
  eleSizebar.onmousemove = eleSizebar.ontouchmove =
  eleSizebar.ondrag = function (e) {
    e.preventDefault();
    if (e.buttons == 1) {
      eleCPBD.style.opacity = 0;
      eleSizebar.firstElementChild.style.width = e.offsetX + "px";
      eleMain.style.fontSize = (e.offsetX / eleSizebar.clientWidth) / 2 + 0.75 + "em";
    }
  };
eleContrastbar.onmousedown = eleContrastbar.ontouchstart =
  eleContrastbar.onmousemove = eleContrastbar.ontouchmove =
  eleContrastbar.ondrag = function (e) {
    e.preventDefault();
    if (e.buttons == 1) {
      eleCPBD.style.opacity = 0;
      eleContrastbar.firstElementChild.style.width = e.offsetX + "px";
      eleMain.style.opacity = (e.offsetX / eleContrastbar.clientWidth) / 2 + 0.5;
    }
  };
// eleSizebar.ondragstart = eleContrastbar.ondragstart = function (e) {
//   e.preventDefault();
// }
onmouseup = function (e) { eleCPBD.style.opacity = ""; };
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
