// 仅需单次初始化的内容及定时设置
onload = function () {
    // 希沃屏保，快乐古诗文
    SCREENSAVER_TIME = 45;
    eleMain = document.getElementsByTagName("body")[0];
    change("高三理科");
    if (String(location).indexOf("\?") == -1) {
        updateTime = function () {
            now = new Date();
            // 宝鸡中学铃声快一分钟，诶，就是玩儿~
            // now.setMinutes(now.getMinutes() + 1);
            output("clock", getClock(now));
            updateExam();
        }
        setInterval(updateTime, 2000);
    } else {
        alert("已进入调试模式，关闭本选项卡或删除网址末尾的问号可以返回正常模式。")
        updateTime = function () {
            now > new Date("2021-06-30T13:00+08:00") ? change(type) : null;
            now.getHours() == 19 ? now.setHours(31) : null;
            now.setMinutes(now.getMinutes() + 1);
            output("clock", getClock(now));
            updateExam();
        }
        setInterval(updateTime, 20);
    }
    updateTime();
    updateSubtitle();
    setInterval(updateSubtitle, 2000);
    updateSST();
    setInterval(updateSST, 60000);
}

onmousemove = onmousedown = function () { SCREENSAVER_TIME = 45; }

oncontextmenu = onkeydown = onselectstart = function () {
    SCREENSAVER_TIME = 45;
    return false;
}

// 不要从此函数调用定时功能，否则时间会累加
function change(i) {
    // 调试模式的初始时间
    now = new Date("2021-06-28T13:30+08:00");
    //  切换类型时需要重新初始化的内容
    end = 0;
    progress = 0;
    order = 0;

    type = i;
    console.log(type);
    output("type", type);

    // 切换类型的对焦动画
    eleMain.style.filter = "blur(.5em)";
    setTimeout(function () {
        eleMain.style.filter = "blur(0)";
        updateTime();
    }, 500);
}

function relStyle(prop, delta, unit, minVal, maxVal) {
    propVal = Number(eleMain.style[prop].replace(unit, "")) + delta;
    propVal = Math.max(propVal, minVal);
    propVal = Math.min(propVal, maxVal);
    eleMain.style[prop] = propVal + unit;
    // 保留两位小数
    output(prop, Math.round(propVal * 1E2) / 1E2);
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

function $(nextSubject, nextStart, nextEnd) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date("2021-" + nextStart + ":00+08:00");
        end = new Date("2021-" + nextEnd + ":00+08:00");
    }
}

function getClock(date) {
    return date.getMinutes() < 10 ?
        date.getHours() + ":0" + date.getMinutes() :
        date.getHours() + ":" + date.getMinutes();
}

function formatMin(i) {
    return Math.round(i / 60000) + '<span class="small">min</span>';
}

function output(id, value) {
    document.getElementById(id).innerHTML = value;
}

function updateSubtitle() {
    // 在此处可以设置基于当前时间的subtitle
    output("subtitle", subtitle[order]);
    order < subtitle.length - 1 ? order++ : order = 0;
}

function updateExam() {
    switch (type) {
        // 在swich语句中定义的是各类型的缺省subtitle
        case "高三理科":
            subtitle = [""];
            $("物理", "08-26T10:40", "08-26T12:10");
            $("英语", "08-26T14:20", "08-26T16:20");
            $("化学", "08-26T16:50", "08-26T18:20");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("生物", "08-27T10:40", "08-27T12:10");
            $("数学", "08-27T14:20", "08-27T16:20");
            break;
        case "高三文科":
            $("历史", "08-26T10:40", "08-26T12:10");
            $("英语", "08-26T14:20", "08-26T16:20");
            $("地理", "08-26T16:50", "08-26T18:20");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("政治", "08-27T10:40", "08-27T12:10");
            $("数学", "08-27T14:20", "08-27T16:20");
            break;
        case "高二理科":
            subtitle = [""];
            $("物理", "08-26T10:40", "08-26T12:20");
            $("数学", "08-26T14:20", "08-26T16:20");
            $("化学", "08-26T16:50", "08-26T18:30");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("生物", "08-27T10:40", "08-27T12:10");
            $("英语", "08-27T14:20", "08-27T16:20");
            break;
        case "高二文科":
            subtitle = [""];
            $("历史", "08-26T10:40", "08-26T12:20");
            $("数学", "08-26T14:20", "08-26T16:20");
            $("地理", "08-26T16:50", "08-26T18:30");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("政治", "08-27T10:40", "08-27T12:20");
            $("英语", "08-27T14:20", "08-27T16:20");
            break;
        case "欢迎高一":
            subtitle = ["高一暂时没有考试。"];
            $("数学", "06-28T14:20", "06-28T16:00");
            $("英语", "06-28T16:30", "06-28T18:10");
            $("语文", "06-29T07:50", "06-29T09:50");
            $("化学", "06-29T10:20", "06-29T12:00");
            $("物理", "06-29T14:20", "06-29T16:00");
            $("生物", "06-29T16:30", "06-29T18:00");
            $("政史", "06-30T07:50", "06-30T09:50");
            $("地理", "06-30T10:20", "06-30T11:20");
            break;
        default:
            subtitle = ["不存在的考试类型，请重新选择。"]
            $("", "01-01T00:00", "01-01T00:01");
    }
    duration = getClock(start) + "~" + getClock(end);

    if (now < (start - 18E5)) {
        (now.getHours() == 12 && now.getHours() == 18) ?
            subtitle = "干饭时间到！" : null;
        timer = "Soon";
        activity = "考试加油";
        progress = 0;
    } else if (now < (start - 12E5)) {
        timer = formatMin(start - 12E5 - now);
        activity = "距离入场";
        progress = (start - 12E5 - now) / 6E3;
    } else if (now < (start - 6E5)) {
        timer = formatMin(start - 6E5 - now);
        activity = "距离发卡";
        progress = (start - 6E5 - now) / 6E3;
    } else if (now < (start - 3E5)) {
        timer = formatMin(start - 3E5 - now);
        activity = "距离发卷";
        progress = (start - 3E5 - now) / 3E3;
    } else if (now < start) {
        timer = formatMin(start - now);
        activity = "距离开考";
        progress = (start - now) / 3E3;
    } else if (now < end) {
        now.getHours() == 12 ?
            subtitle = ["警告：信息中心设置12:05自动关机，请注意取消。"] : null;
        // now.getHours() == 18 ?
        //     subtitle = ["警告：考场周围应保持环境安静！"] : null;
        timer = formatMin(end - now);
        activity = "距离结束";
        progress = (now - start) / (end - start) * 100;
    } else {
        // subtitle = ["宝中的各位小蓝们，我们已经完成了本次考试！",
        //     "马上又要进入新的年级了，过去一年我们收获了不少",
        //     "一起调整状态，迎接新的年级！",
        //     "不过各位在短暂的假期里要先保证休息哦~"];
        subject = "";
        duration = "";
        timer = "";
        activity = "";
        progress = 100;
    }

    document.getElementById("bar").style.width = progress + "%";
    output("subject", subject);
    output("duration", duration);
    output("timer", timer);
    output("activity", activity)
}

function updateSST() {
    SCREENSAVER_TIME -= 1;
    if (SCREENSAVER_TIME < 10) {
        document.getElementById("SSTBubble").style.display = "flex";
        output("SST", SCREENSAVER_TIME);
    } else {
        document.getElementById("SSTBubble").style.display = "none";
    }
}
