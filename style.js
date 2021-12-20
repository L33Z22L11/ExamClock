console.log("%c\n加入Techaos! 混技\nQQ群: 169994096\n", "font:3em Montserrat,sans-serif;");
console.log("%c\n野生技协(混技分部)\nQQ群: 894656456\n", "font:3em Montserrat,sans-serif;");
search = location.search;
setInterval(function () {
    try { if (!location.host.match("exam.thisis.host")) document.getElementById("verify").style.display = "flex"; }
    catch (e) { alert("检测到意外修改内容的考试时钟！\n" + e); location.href = "https://exam.thisis.host"; }
}(), 2000);
eleMain = document.getElementById("main");
eleMenu = document.getElementById("menu");
eleForewarn = document.getElementById("forewarn");
eleMsg = document.getElementById("msg");
eleHelp = document.getElementById("help");
send("目前你可以在右键菜单中自行设置背景。");
// 随便选一张壁纸
stylish(2, new Date() % 2030924);
// 定时换壁纸（康总加成🙏）
setInterval(stylish, 2040411, 2, new Date() % 411);
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
eleMain.onclick = function () { eleMenu.style.display = "none"; };
// 关闭通知气泡
eleForewarn.onclick = eleMsg.onclick = eleHelp.onclick = function () { this.style.display = ""; };
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
    try { clearInterval(numMsg); } catch (e) { }
    numMsg = setInterval(function () { eleMsg.style.display = ""; }, 15000);
}
// 向页内元素输出值
function output(id, value) { document.getElementById(id).innerHTML = value; }
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
function stylish(phase, seed) {
    eleMain.style.background = "rgba(0,0,0,0.75)";
    if (phase == 0) document.getElementsByTagName('html')[0].style.backgroundImage =
        'url(' + prompt('输入背景url') + ')';
    else if (phase == 1) document.getElementsByTagName("html")[0].style.backgroundImage =
        "url(https://bu.dusays.com/2021/11/23/" + ['9dd5f0f9ae39c', '86f0354849ead',
            'aef07ee202d3c', 'a3676bbf32d4e', '4b347391fec34', 'b1a6b10044d7e', '10f58d6677aeb']
        [seed % 7] + ".jpg)";
    else if (phase == 2) document.getElementsByTagName("html")[0].style.backgroundImage =
        "url(https://bu.dusays.com/2021/12/19/" + ['0e34aef718e53', 'cbb7ca9f47a46',
            'd9daedc01bca6', '2ecfe0c8ff887', '8a1d489af0279', '12479fb170d16', '9b17e5fffdb73',
            'cad676f747c56', 'eaf02f09741ea', 'c03de66f3cef0', '84a92ddf8c5c8', '6b4b98bd96ee2',
            '0b91c8d48bbb0'][seed % 13] + ".jpg)";
    else document.getElementsByTagName("html")[0].style.backgroundImage = eleMain.style.background = "";
}
// 全屏
function fullscreen() {
    try {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen(); output("fullscreen", "退出");
        } else { document.exitFullscreen(); output("fullscreen", "全屏"); }
    } catch (e) { send("该浏览器不支持此操作，请手动最大化窗口或全屏。"); }
}
