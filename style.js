console.log("%c\n加入Techaos! 混技\nQQ群: 169994096\n", "font:3em Montserrat,sans-serif;");
console.log("%c\n野生技协(混技分部)\nQQ群: 894656456\n", "font:3em Montserrat,sans-serif;");
search = location.search;
setInterval(function () {
  try {
    if (navigator.userAgent.match("(Trident)|(QQBrowser)")) {
      document.getElementById("verify").style.display = "block";
      output("verifycontent", "IE/QQ浏览器功能老旧，我们推荐使用Chrome/Edge/Firefox浏览器。");
    }
    if (!location.host.match("exam.thisis.host")) {
      document.getElementById("verify").style.display = "block";
      output("verifycontent", "您使用的可能是受篡改的或者离线的考试时钟，无法收到官方更新。<u><a href='https://exam.thisis.host'>点击访问在线考试时钟官网https://exam.thisis.host</a></u>");
    }
  }
  catch (e) { alert("检测到意外修改内容的考试时钟!\n" + e); location.href = "https://exam.thisis.host"; }
}, 2000);
eleMain = document.getElementById("main");
eleMenu = document.getElementById("menu");
// eleForewarn = document.getElementById("forewarn");
eleMsg = document.getElementById("msg");
eleCard = document.getElementsByClassName("card")[0];
// 希沃屏保预警
// “屏保都统一关闭了，注释掉，白写个功能”
// !location.href.match("noforewarn") ? setInterval(updateForewarn, 600) : 0;
// 希沃屏保剩余时间
// forewarntime = 45;
// onmousemove = onclick = function () { forewarntime = 45; };
// 键盘功能函数
onkeydown = function (e) {
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
    case "\\": try { alert(eval(prompt("Enter command"))); }
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
// 发送气泡通知
function send(msg) {
  eleMsg.style.display = "flex";
  output("msgcontent", msg);
  // “变量不定义也不会报错了，妙啊”
  try { clearInterval(msgnum); } catch (e) { }
  msgnum = setInterval(function () { eleMsg.style.display = ""; }, 30000);
  return msg;
}
// 向页内元素输出值
function output(id, value) { return document.getElementById(id).innerHTML = value; }
// 主体元素样式调节
function relStyle(prop, delta, unit, minVal, maxVal) {
  propVal = eleMain.style[prop].replace(unit, "") * 1 + delta;
  propVal = Math.round(Math.min(Math.max(propVal, minVal), maxVal) * 1E2) / 1E2;
  eleMain.style[prop] = propVal + unit;
  // 保留两位小数，然而toFixed()有精度问题
  output(prop, propVal);
  console.log(send(prop + "增加了" + delta + "，调节为" + propVal));
}
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
  } catch (e) { console.warn(send("不支持IE/QQ浏览器，请手动最大化窗口或全屏。<span class='dim'>建议使用Chrome/Edge/Firefox浏览器。</span>\n") + e); }
}
