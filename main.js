console.log("%c\n欢迎加入野生技协\nQQ群: 894656456\n", "font:bold 3em Roboto,sans-serif;");
eleMain = document.getElementById("main");
eleMenu = document.getElementById("menu");
eleSsaver = document.getElementById("ssaver");
eleMsg = document.getElementById("msg");
eleHelp = document.getElementById("help");

try {
    !location.host.match("exam.thisis.host") ?
        document.getElementById("verify").style.display = "flex" : null;
}
catch (e) {
    alert("检测到盗版的考试时钟且发送警报失败！\n" + e);
    location.href = "https://exam.thisis.host";
}
// 希沃屏保预警，已全局关闭
// !location.href.match("nossaver") ?
//     setInterval(updateSST, 60000) : null;

// 希沃屏保剩余时间
ssavertime = 45;
onmousemove = onclick = function () { ssavertime = 45; }

onkeydown = function (e) {
    ssavertime = 45;
    send("你按下了" + e.key);
    switch (e.key) {
        case "Escape": eleMenu.style.display = "none";
        case "F12": e.preventDefault(); break;
        case "/": relStyle('fontSize', -0.05, 'em', 0.75, 1.25); break;
        case "*": relStyle('fontSize', +0.05, 'em', 0.75, 1.25); break;
        case "-": relStyle('opacity', -0.05, '', 0.5, 1); break;
        case "+": relStyle('opacity', +0.05, '', 0.5, 1); break;
    }
}

oncontextmenu = function (e) {
    e.preventDefault();
    eleMenu.style.display = "block";
    eleMenu.style.left = e.clientX + "px";
    eleMenu.style.top = e.clientY + "px";
}

eleMain.onclick = function () { eleMenu.style.display = "none"; };

eleSsaver.onclick = eleMsg.onclick = eleHelp.onclick =
    function () { this.style.display = ""; }


change("高三理科");
if (!location.href.match("debug")) {
    updateTime = function () {
        now = new Date();
        // 时钟校准，与学校铃声保持同步
        // now.setMinutes(now.getMinutes() + 1);
        output("clock", getClock(now));
        updateExam();
    }
    setInterval(updateTime, 2000);
} else {
    alert("已进入调试模式，关闭本页面可返回正常模式。")
    now = new Date("1970-01-01");
    updateExam();
    updateTime = function () {
        // 调试模式起始时间
        now < start - 36E5 ? now = new Date(start - 36E5) : null;
        // 调试模式截止时间
        // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
        if (now > end - -36E5) {
            change(type);
            now = new Date("1970-01-01");
        }
        // 调试模式速度设置
        now.setSeconds(now.getSeconds() + 30);
        // now.setMinutes(now.getMinutes() + 5);
        output("clock", getClock(now));
        updateExam();
    }
    setInterval(updateTime, 20);
}
updateTime();
updateSubtitle();
setInterval(updateSubtitle, 2000);


function change(totype) {
    // 切换类型时需要重新初始化的内容
    now = new Date();
    end = 0, progress = 0, order = 0;
    updateToday();

    type = totype;
    // console.log(type);
    output("type", type);

    // 切换类型的对焦动画
    eleMain.style.filter = "blur(.5em)";
    setTimeout(function () {
        eleMain.style.filter = "blur(0)";
        updateTime();
    }, 500);
}

function send(msg) {
    eleMsg.style.display = "flex";
    output("msgcontent", msg);
    setTimeout(function () { eleMsg.style.display = ""; }, 5000);
    // 有机会的话弄一个clearTimeout()
}


function relStyle(prop, delta, unit, minVal, maxVal) {
    propVal = eleMain.style[prop].replace(unit, "") * 1 + delta;
    propVal = Math.round(Math.min(Math.max(propVal, minVal), maxVal) * 1E2) / 1E2;
    eleMain.style[prop] = propVal + unit;
    // 保留两位小数，然而toFixed()有精度问题
    output(prop, propVal);
    send(prop + "增加了" + delta + "，调节为" + propVal);
}

function fullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        output("fullscreen", "退出");
    } else {
        document.exitFullscreen();
        output("fullscreen", "全屏");
    }
}

function updateToday() {
    today = fixDigit(now.getMonth() + 1) + "-" + fixDigit(now.getDate()) + "T";
}

function $(nextSubject, nextStart, nextEnd, nextSubtitle) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date("2021-" + nextStart + ":00+08:00");
        end = new Date("2021-" + nextEnd + ":00+08:00");
    }
    subject == nextSubject && nextSubtitle ? subtitle = nextSubtitle : null;
}

function fixDigit(num) {
    num = parseInt(num);
    return num < 10 ? "0" + num : num;
}

function getClock(date) {
    return date.getHours() + ":" + fixDigit(date.getMinutes());
}

function output(id, value) {
    document.getElementById(id).innerHTML = value;
}

function updateSubtitle() {
    order < subtitle.length - 1 ? order++ : order = 0;
    output("subtitle", subtitle[order]);
}

function setTemp(sh, sm, eh, em) {
    sh = prompt("考试开始时间(小时)", 16);
    sm = prompt("考试开始时间(分钟)", 25);
    eh = prompt("考试结束时间(小时)", 18);
    em = prompt("考试结束时间(分钟)", 55);
    $(prompt("考试科目名称", "临时"),
        today + fixDigit(sh) + ":" + fixDigit(sm),
        today + fixDigit(eh) + ":" + fixDigit(em));
    alert("考试科目：" + subject + "\n起止时间：" + getClock(start) + "~" + getClock(end));
}

function illback() {
    now.getHours() == 18 && now.getMinutes() > 30 ?
        now.getDate() == 4 ?
            subtitle = ["今天我就要离开，明天我还会回来。9min！"] :
            subtitle = ["祝各位努力的孩子取得理想的名次！"] : null;
}

function updateExam() {
    // 功能是写出来了，不过到现在都不知道subtitle在哪设置合适
    // 防止某些类型由于没有起止时间而崩溃
    $("", "01-01T00:00", "01-01T00:00", ["考试时钟预设内容"]);
    switch (type) {
        case "高三理科":
            // illback();
            subtitle = ["高三理科月考一：请以实际铃声为准。"];
            // subtitle = ["高三素质拓展理科模拟训练"];
            $("数学", "10-04T14:00", "10-04T16:00");
            $("化学", "10-04T16:30", "10-04T18:10");
            $("语文", "10-05T07:40", "10-05T10:10");
            $("生物", "10-05T10:40", "10-05T12:10");
            $("英语", "10-05T14:00", "10-05T16:00");
            $("物理", "10-05T16:30", "10-05T18:10");
            break;
        case "高三文科":
            // illback();
            subtitle = ["高三文科月考一：请以实际铃声为准。"];
            // subtitle = ["高三素质拓展文科模拟训练"];
            $("数学", "10-04T14:00", "10-04T16:00");
            $("政治", "10-04T16:30", "10-04T18:10");
            $("语文", "10-05T07:40", "10-05T10:10");
            $("历史", "10-05T10:40", "10-05T12:20");
            $("英语", "10-05T14:00", "10-05T16:00");
            $("地理", "10-05T16:30", "10-05T18:10");
            break;
        case "高二理科":
            subtitle = ["高二理科阶段性考试一：请以实际铃声为准。"];
            $("英语", "10-08T14:00", "10-08T16:00");
            $("化学", "10-08T16:30", "10-08T18:10");
            $("语文", "10-09T07:40", "10-09T10:10");
            $("生物", "10-09T10:40", "10-09T12:10");
            $("数学", "10-09T14:00", "10-09T16:00");
            $("物理", "10-09T16:30", "10-09T18:10");
            break;
        case "高二文科":
            subtitle = ["高二文科阶段性考试一：请以实际铃声为准。"];
            $("英语", "10-08T14:00", "10-08T16:00");
            $("政治", "10-08T16:30", "10-08T18:10");
            $("语文", "10-09T07:40", "10-09T10:10");
            $("历史", "10-09T10:40", "10-09T12:20");
            $("数学", "10-09T14:00", "10-09T16:00");
            $("地理", "10-09T16:30", "10-09T18:10");
            break;
        case "高三日常":
            subtitle = " "; //加空格，防止length为0
            $("晨读1", today + "07:10", today + "07:25");
            $("晨会", today + "07:25", today + "07:30");
            $("晨读2", today + "07:30", today + "08:00");
            $("午休", today + "12:00", today + "13:55");
            $("考练", today + "16:05", today + "16:50");
            $("晚训", today + "18:25", today + "18:45");
            $("晚写", today + "18:45", today + "18:55");
            $("晚一", today + "18:55", today + "19:40");
            $("晚二", today + "19:50", today + "20:35");
            $("晚三", today + "20:50", today + "22:00");
            $("晚修", today + "22:00", today + "23:00");
            break;
        case "高一":
            subtitle = ["高一暂未启用考试时钟。"];
            $("数学", "06-28T14:20", "06-28T16:00");
            $("英语", "06-28T16:30", "06-28T18:10");
            $("语文", "06-29T07:50", "06-29T09:50");
            $("化学", "06-29T10:20", "06-29T12:00");
            $("物理", "06-29T14:20", "06-29T16:00");
            $("生物", "06-29T16:30", "06-29T18:00");
            $("政史", "06-30T07:50", "06-30T09:50");
            $("地理", "06-30T10:20", "06-30T11:20");
            break;
        case "临时科目":
            subtitle = ["欢迎使用考试时钟，如有问题可以加入QQ群894656456交流。"];
            break;
        default:
            subtitle = ["不存在的考试类型，请重新选择。"];
    }

    duration = getClock(start) + "~" + getClock(end);

    if (now < (start - 18E5)) {
        // now.getHours() == 12 && now.getHours() == 18 ?
        //     subtitle = "干饭时间到！" : null;
        timer = Math.round((start - now) / 36E4) / 10;
        timersub = "h";
        activity = "考试加油";
        progress = 0;
    } else if (now < (start - 12E5)) {
        timer = Math.round((now - start + 18E5) / 6E4);
        timersub = "/ 10 min";
        activity = "课间休息";
        progress = (now - start + 18E5) / 6E3;
    } else if (now < (start - 6E5)) {
        timer = Math.round((now - start + 12E5) / 6E4);
        timersub = "/ 10 min";
        activity = "入场扫描";
        progress = (now - start + 12E5) / 6E3;
    } else if (now < (start - 3E5)) {
        timer = Math.round((now - start + 6E5) / 6E4);
        timersub = "/ 5 min";
        activity = "发卡贴码";
        progress = (now - start + 6E5) / 3E3;
    } else if (now < start) {
        timer = Math.round((now - start + 3E5) / 6E4);
        timersub = "/ 5 min";
        activity = "发卷审题";
        progress = (now - start + 3E5) / 3E3;
    } else if (now < end) {
        // now.getHours() == 12 ?
        //     subtitle = ["12:05可能自动关机，请留意提示。"] : null;
        // now.getHours() == 18 ?
        //     subtitle = ["警告：考场周围应保持环境安静！"] : null;
        if ((now - start) / (end - start) < .5) {
            timer = Math.round((now - start) / 6E4);
            activity = "已经开始";
        } else {
            timer = Math.round((end - now) / 6E4);
            activity = "距离结束";
        }
        timersub = "min";
        progress = (now - start) / (end - start) * 100;
    } else {
        // 结束后的subtitle
        // subtitle = ["宝中的各位小蓝们，我们已经完成了本次考试！",
        //     "马上又要进入新的年级了，过去一年我们收获了不少",
        //     "一起调整状态，迎接新的年级！",
        //     "不过各位在短暂的假期里要先保证休息哦~"];
        subject = "";
        duration = "";
        timer = "";
        timersub = "考试结束";
        activity = "";
        progress = 100;
    }

    document.getElementById("bar").style.width = progress + "%";
    output("subject", subject);
    output("duration", duration);
    output("timer", timer);
    output("timersub", timersub);
    output("activity", activity);
}

// 希沃屏保预警，2021-09屏保已经更换内容且被信息中心关闭
function updateSST() {
    ssavertime -= 1;
    output("ssavertime", "在" + ssavertime + "分钟后");
    if (ssavertime < 0) {
        eleSsaver.style.backgroundColor = "rgba(255,255,255,.2)";
        output("ssavertime", "已经");
    } else if (ssavertime < 10) {
        eleSsaver.style.display = "flex";
        eleSsaver.style.backgroundColor = "#f52";
    } else {
        eleSsaver.style.display = "";
    }
}
