onload = function () {
    eleMain = document.getElementsByTagName("body")[0];
    // 默认类型
    change("高二理科");
    // 定时功能应该从这里调用
    if (String(location).indexOf("\?") == -1) {
        updateClock();
    } else {
        alert("已进入调试模式，关闭本选项卡或删除网址末尾的问号可以返回正常模式。")
        check();
    }
    updateSubtitle();
    updateSST();
}

onmousemove = onmousedown = function () { SST = 50; }

oncontextmenu = onkeydown = onselectstart = function () {
    SST = 50;
    return false;
}

// 不要从此函数调用定时功能，否则时间会累加
function change(i) {
    // 调试模式的初始时间
    now = new Date("2021-06-28T13:30+0800");
    // 每次切换类型时初始化变量
    SST = 50;
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
        updateExam();
    }, 500);
}

function relStyle(prop, delta, unit, minVal, maxVal) {
    propVal = Number(eleMain.style[prop].replace(unit, "")) + delta;
    propVal = Math.max(propVal, minVal);
    propVal = Math.min(propVal, maxVal);
    eleMain.style[prop] = propVal + unit;
    output(prop, Math.round(propVal * 1E2) / 1E2);
}

function fullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        output("fullscreen", "退出");
    }
    else {
        document.exitFullscreen();
        output("fullscreen", "全屏");
    }
}

// 普通模式的时间更新
function updateClock() {
    now = new Date();
    output("clock", getClock(now));
    updateExam();
    setTimeout(updateClock, 500);
}

// 调试模式的时间更新
function check() {
    // 超过标记的结束时间则重开
    now > new Date("2021-06-30T13:00+0800") ? change(type) : null;
    now.getHours() == 19 ? now.setHours(31) : null;
    now.setMinutes(now.getMinutes() + 1);
    output("clock", getClock(now));
    updateExam();
    setTimeout(check, 20);
}

function $(nextSubject, nextStart, nextEnd) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date("2021-" + nextStart + ":00+0800");
        end = new Date("2021-" + nextEnd + ":00+0800");
    }
}

/* 
宝鸡中学信息中心装的新系统只有IE!?
这个功能用其他方法实现吧。
21.6.25

就加了一点点功能，IE11又不支持了……
21.6.27

function add0Prefix(num, digit) {
    return String(num.length) > digit ? num :
        ("0".repeat(digit) + num).slice(-digit);
}*/

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
    setTimeout(updateSubtitle, 2000);
}

function updateExam() {
    switch (type) {
        // 在swich语句中定义的是各类型的缺省subtitle
        case "高二理科":
            subtitle = ["电脑时间存在误差，仅供参考，请以广播和司号为准。"];
            $("测试", "06-28T22:00", "06-28T22:07")
            $("语文", "06-29T07:40", "06-29T10:10");
            $("生物", "06-29T10:40", "06-29T12:10");
            $("数学", "06-29T14:20", "06-29T16:20");
            $("物理", "06-29T16:50", "06-29T18:30");
            $("英语", "06-30T07:40", "06-30T09:50");
            $("化学", "06-30T10:20", "06-30T12:00");
            break;
        case "高二文科":
            subtitle = ["电脑时间存在误差，仅供参考，请以广播和司号为准。"];
            $("语文", "06-29T07:40", "06-29T10:10");
            $("历史", "06-29T10:40", "06-29T12:20");
            $("数学", "06-29T14:20", "06-29T16:20");
            $("政治", "06-29T16:50", "06-29T18:30");
            $("英语", "06-30T07:40", "06-30T09:50");
            $("地理", "06-30T10:20", "06-30T12:00");
            break;
        case "高一":
            subtitle = ["电脑时间存在误差，仅供参考，请以实际铃声为准。"];
            $("数学", "06-28T14:20", "06-28T16:00");
            $("英语", "06-28T16:30", "06-28T18:10");
            $("语文", "06-29T07:50", "06-29T09:50");
            $("化学", "06-29T10:20", "06-29T12:00");
            $("物理", "06-29T14:20", "06-29T16:00");
            $("生物", "06-29T16:30", "06-29T18:00");
            $("政史", "06-30T07:50", "06-30T09:50");
            $("地理", "06-30T10:20", "06-30T11:20");
            break;
    }
    duration = getClock(start) + "~" + getClock(end);

    if (now < (start - 18E5)) {
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
        now.getHours() == 18 ?
            subtitle = ["警告：考场周围应保持环境安静！"] : null;
        timer = formatMin(end - now);
        activity = "距离结束";
        progress = (now - start) / (end - start) * 100;
    } else {
        subtitle = ["宝中的各位小蓝们，我们已经完成了本次考试！",
            "马上又要进入新的年级了，过去一年收获了多少？",
            "一起在短暂的假期里调整状态，迎接新学期！"];
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
    SST -= 1;
    if (SST < 10) {
        document.getElementById("SSTBubble").style.display = "flex";
        output("SST", SST);
    } else {
        document.getElementById("SSTBubble").style.display = "none";
    }
    setTimeout(updateSST, 60000);
}
