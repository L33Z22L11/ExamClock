eleMenu = document.getElementById("menu");
eleForewarn = document.getElementById("forewarn");
eleMsg = document.getElementById("msg");
eleHelp = document.getElementById("help");
// 希沃屏保预警
// “屏保都统一关闭了，注释掉，白写个功能”
// !location.href.match("noforewarn") ? setInterval(updateSST, 600) : null;
// 希沃屏保剩余时间
forewarntime = 45;
onmousemove = onclick = function () { forewarntime = 45; }
// 键盘功能函数
onkeydown = function (e) {
    forewarntime = 45;
    switch (e.key) {
        // 隐藏右键菜单
        case "Escape": eleMenu.style.display = "none"; break;
        // 调试请按Ctrl+Shift+I或从浏览器菜单调出
        case "F12": e.preventDefault(); send("若要调试，请联系混技。"); break;
        case ";": relStyle("fontSize", -0.05, "em", 0.75, 1.25); break;
        case "'": relStyle("fontSize", +0.05, "em", 0.75, 1.25); break;
        case ",": relStyle("opacity", -0.05, "", 0.5, 1); break;
        case ".": relStyle("opacity", +0.05, "", 0.5, 1); break;
    }
}
// 展示右键菜单
oncontextmenu = function (e) {
    e.preventDefault();
    eleMenu.style.display = "block";
    eleMenu.style.left = e.clientX + "px";
    eleMenu.style.top = e.clientY + "px";
}
// 隐藏右键菜单
eleMain.onclick = function () { eleMenu.style.display = "none"; };
// 关闭通知气泡
eleForewarn.onclick = eleMsg.onclick = eleHelp.onclick = function () { this.style.display = ""; }
// 希沃屏保预警，2021-09屏保已经更换内容且被信息中心关闭
function updateSST() {
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
    setInterval(function () { eleMsg.style.display = ""; }, 5000);
    // “清除任务会重叠，有时间再改吧”
}
// 主体元素样式调节
function relStyle(prop, delta, unit, minVal, maxVal) {
    propVal = eleMain.style[prop].replace(unit, "") * 1 + delta;
    propVal = Math.round(Math.min(Math.max(propVal, minVal), maxVal) * 1E2) / 1E2;
    eleMain.style[prop] = propVal + unit;
    // 保留两位小数，然而toFixed()有精度问题
    output(prop, propVal);
    send(prop + "增加了" + delta + "，调节为" + propVal);
}
// 更换背景
function stylish(name) {
    eleMain.style.background = "rgba(0,0,0,0.75)";
    document.getElementsByTagName("html")[0].style.backgroundImage = "url(https://bu.dusays.com/2021/11/23/" + name + ".jpg)";
}
// 全屏
function fullscreen() {
    try {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen(); output("fullscreen", "退出");
        } else { document.exitFullscreen(); output("fullscreen", "全屏"); }
    } catch (e) { send("该浏览器不支持此操作，请手动最大化窗口或全屏。"); }
}
