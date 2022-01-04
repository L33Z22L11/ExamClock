/* 
 * 页面交互
 */
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
    case "Escape": eleMenu.style.display = "none"; break;
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
// 展示右键菜单
eleMain.oncontextmenu = function (e) {
  if (!e.ctrlKey) {
    e.preventDefault();
    eleMenu.style.display = "block";
    eleMenu.style.left = e.clientX + "px";
    eleMenu.style.top = e.clientY + "px";
  }
};
// 隐藏右键菜单
eleMain.onclick = function () { eleMenu.style.display = ""; };
// 关闭通知气泡
// eleForewarn.onclick = 
eleMsg.onclick = function () { this.style.display = ""; };
// 希沃屏保预警，2021-09屏保已经更换内容且被信息中心关闭
function updateForewarn() {
  forewarntime -= 1;
  output("forewarntime", "在" + forewarntime + "分钟后");
  if (forewarntime < 0) {
    eleForewarn.style.backgroundColor = "rgba(255,255,255,.2)";
    output("forewarntime", "已经");
  } else if (forewarntime < 10) {
    eleForewarn.style.display = "flex";
    eleForewarn.style.backgroundColor = "#f52";
  } else {
    eleForewarn.style.display = "";
  }
}
// 运行时间展示
output("runtime", parseInt((new Date() - new Date("2021-04")) / 864E5) + "天");
// 篡改与浏览器检测
setInterval(function () {
  try {
    if (navigator.userAgent.match("( Trident)|( QQBrowser)")) {
      document.getElementById("verify").style.display = "block";
      console.warn(output("verifycontent", "IE/QQ浏览器功能老旧，我们推荐使用Chrome/Edge/Firefox浏览器。"));
    }
    if (!location.host.match("exam.thisis.host")) {
      document.getElementById("verify").style.display = "block";
      output("verifycontent", "您使用的可能是受篡改的或者离线的考试时钟，无法收到官方更新。<u><a href='https://exam.thisis.host'>点击访问在线考试时钟官网https://exam.thisis.host</a></u>");
    }
  }
  catch (e) {
    alert("检测到非法篡改，请将此代码发送给纸鹿：\n" + e);
    if (confirm("是否访问在线考试时钟官网https://exam.thisis.host？")) location.href = "https://exam.thisis.host";
  }
}, 2000);
// 全屏
function fullscreen() {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      output("fullscreen", "全屏");
    } else {
      document.documentElement.requestFullscreen();
      output("fullscreen", "退出");
    }
  } catch (e) { console.warn(send("操作失败，请手动最大化窗口或全屏。<span class='dim'>建议使用Chrome/Edge/Firefox浏览器。</span>\n") + e); }
}
