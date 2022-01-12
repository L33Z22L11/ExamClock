/* 
 * 页面交互
 */
var eleMain = document.getElementById("main"),
  eleControl = document.getElementById("control"),
  eleBackdrop = document.getElementsByClassName("backdrop")[0],
  eleSizebar = document.getElementById("sizebar"),
  eleContrastbar = document.getElementById("contrastbar"),
  eleFullscreen = document.getElementById("fullscreen"),
  eleRuntime = document.getElementById("runtime");
// 希沃屏保预警
// “屏保都统一关闭了，注释掉，白写个功能”
// if (!location.href.match("noforewarn")) setInterval(updateForewarn, 600);
// 希沃屏保剩余时间
var forewarntime = 45;
// onmousemove = onclick = function () { forewarntime = 45; };
// 键盘功能函数
window.onkeydown = function (e) {
  // forewarntime = 45;
  switch (e.key) {
    // 隐藏右键菜单
    case "Escape":
      try { eleControl.style.display = ""; }
      catch (e) { } break;
    case "F12": if (confirm("若要访问GitHub上的源代码仓库来研究代码，请点击“确定”。")) { open("https://github.com/ThisisHost/exam-clock"); }
    else if (confirm("确认要使用F12工具吗？由于本时钟的DOM元素属于异步加载、定时更新，你对网页所做的更改很可能会被随时覆盖。")) {
      alert("欢迎使用调试工具，若有问题或申请加入我项目组可与我联系，你将对自己所做的行为承担一切可能后果。");
    } else e.preventDefault(); break;
    case ";": relStyle("fontSize", -0.05, "em", 0.75, 1.25); break;
    case "'": relStyle("fontSize", +0.05, "em", 0.75, 1.25); break;
    case ",": relStyle("opacity", -0.05, "", 0.5, 1); break;
    case ".": relStyle("opacity", +0.05, "", 0.5, 1); break;
    case "/": try { alert(eval(prompt("Enter command"))); }
      catch (e) { alert(e); } break;
    default: console.log(e.key);
  }
};
// 右键控制中心
eleMain.oncontextmenu = function (e) {
  if (!e.ctrlKey) {
    e.preventDefault();
    eleControl.style.display = "flex";
  }
};
eleSizebar.onmousedown = eleSizebar.ontouchstart =
  eleSizebar.onmousemove = eleSizebar.ontouchmove =
  eleSizebar.ondrag = function (e) {
    if (e.type != "mousemove" || e.buttons == 1) {
      e.preventDefault();
      eleBackdrop.style.opacity = "0";
      eleSizebar.firstElementChild.style.width = e.offsetX + "px";
      eleMain.style.fontSize = (e.offsetX / eleSizebar.clientWidth) / 2 + 0.75 + "em";
    }
  };
eleContrastbar.onmousedown = eleContrastbar.ontouchstart =
  eleContrastbar.onmousemove = eleContrastbar.ontouchmove =
  eleContrastbar.ondrag = function (e) {
    e.preventDefault();
    if (e.buttons == 1) {
      eleBackdrop.style.opacity = "0";
      eleContrastbar.firstElementChild.style.width = e.offsetX + "px";
      eleMain.style.opacity = (e.offsetX / eleContrastbar.clientWidth) / 2 + 0.5;
      console.log((e.offsetX / eleContrastbar.clientWidth) / 2 + 0.5);
    }
  };
// eleSizebar.ondragstart = eleContrastbar.ondragstart = function (e) {
//   e.preventDefault();
// }
onmouseup = function (e) {
  eleBackdrop.style.opacity = "";
};
// 运行时间展示
eleRuntime.innerHTML = parseInt((new Date() - new Date("2021-04")) / 864E5) + "天";
// eleMain样式调节
function relStyle(prop, delta, unit, minVal, maxVal) {
  var propVal = eleMain.style[prop].replace(unit, "") * 1 + delta;
  // 保留两位小数，然而toFixed()有精度问题
  propVal = Math.round(Math.min(Math.max(propVal, minVal), maxVal) * 1E2) / 1E2;
  eleMain.style[prop] = propVal + unit;
  document.getElementById(prop).innerHTML = propVal;
  console.log(send(prop + "增加了" + delta + "，调节为" + propVal));
}
// 全屏
function fullscreen() {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      eleFullscreen.innerHTML = "<i class='fas fa-expand-arrows-alt'></i> 全屏";
    } else {
      document.documentElement.requestFullscreen();
      eleFullscreen.innerHTML = "<i class='fas fa-compress-arrows-alt'></i> 退出";
    }
  } catch (e) { console.warn(send("操作失败，请手动最大化窗口或全屏。<span class='dim'>建议使用Chrome/Edge/Firefox浏览器。</span>\n") + e); }
}
