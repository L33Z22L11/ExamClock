onload = function () {
    eleMain = document.getElementsByTagName("body")[0];
    change("高二理科");
    String(location).indexOf("\?") == -1 ? updateClock() : check();
    // timeZoneOffset = new Date().getTimezoneOffset();
}

oncontextmenu = onkeydown = onselectstart = function () { return false; }

function change(i) {
    now = new Date("2021-06-28T07:00");
    end = 0;
    progress = 0;
    order = 0;

    type = i;
    console.log(type);
    output("type", type);

    eleMain.style.filter = "blur(.5em)";
    setTimeout('eleMain.style.filter="blur(0)"', 500);
}

function updateClock() {
    now = new Date();
    output("clock", getClock(now));
    examTimer();
    setTimeout(updateClock, 500);
}

function check() {
    now > new Date("2021-07-01T07:00") ? change(type) : null;
    now.getHours() == 19 ? now.setHours(31) : null;
    now.setMinutes(now.getMinutes() + 1);
    output("clock", getClock(now));
    examTimer();
    setTimeout(check, 20);
}

function $(nextSubject, nextStart, nextEnd) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date(nextStart);
        end = new Date(nextEnd);
    }
}

function add0Prefix(num, digit) {
    return String(num.length) > digit ? num :
        ("0".repeat(digit) + num).slice(-digit);
}

function getClock(date) {
    return date.getHours() + ":" + add0Prefix(date.getMinutes(), 2);
}

function formatMin(i) {
    return Math.round(i / 60000) + '<span class="small">min</span>';
}

function output(id, value) {
    document.getElementById(id).innerHTML = value;
}

function examTimer() {
    subtitle = ["电脑时间存在误差，仅供参考，请以实际铃声为准。"];
    switch (type) {
        case "高二理科":
            $("语文", "2021-06-28T07:40", "2021-06-28T10:10");
            $("生物", "2021-06-28T10:40", "2021-06-28T12:10");
            $("数学", "2021-06-28T14:20", "2021-06-28T16:20");
            $("物理", "2021-06-28T16:50", "2021-06-28T18:30");
            $("英语", "2021-06-30T07:40", "2021-06-30T09:50");
            $("化学", "2021-06-30T10:20", "2021-06-30T12:00");
            break;
        case "高二文科":
            $("语文", "2021-06-28T07:40", "2021-06-28T10:10");
            $("历史", "2021-06-28T10:40", "2021-06-28T12:20");
            $("数学", "2021-06-28T14:20", "2021-06-28T16:20");
            $("政治", "2021-06-28T16:50", "2021-06-28T18:30");
            $("英语", "2021-06-30T07:40", "2021-06-30T09:50");
            $("地理", "2021-06-30T10:20", "2021-06-30T12:00");
            break;
        case "高一":
            $("数学", "2021-06-28T14:20", "2021-06-28T16:00");
            $("英语", "2021-06-28T16:30", "2021-06-30T18:10");
            $("语文", "2021-06-28T07:50", "2021-06-28T09:50");
            $("化学", "2021-06-28T10:20", "2021-06-28T12:00");
            $("物理", "2021-06-28T14:20", "2021-06-28T16:00");
            $("生物", "2021-06-28T16:30", "2021-06-28T18:00");
            $("政史", "2021-06-30T07:50", "2021-06-30T09:50");
            $("地理", "2021-06-30T10:20", "2021-06-30T11:20");
            break;
    }
    duration = getClock(start) + "~" + getClock(end);

    if (now < (start - 18E5)) {
        timer = "Soon";
        next = "考试加油";
        progress = 0;
    } else if (now < (start - 12E5)) {
        timer = formatMin(start - 12E5 - now);
        next = "距离入场";
        progress = (start - 12E5 - now) / 6E3;
    } else if (now < (start - 6E5)) {
        timer = formatMin(start - 6E5 - now);
        next = "距离发卡";
        progress = (start - 6E5 - now) / 6E3;
    } else if (now < (start - 3E5)) {
        timer = formatMin(start - 3E5 - now);
        next = "距离发卷";
        progress = (start - 3E5 - now) / 3E3;
    } else if (now < start) {
        timer = formatMin(start - now);
        next = "距离开考";
        progress = (start - now) / 3E3;
    } else if (now < end) {
        timer = formatMin(end - now);
        next = "距离结束";
        progress = (now - start) / (end - start) * 100;
    } else {
        // subtitle = ["我们已经迁移服务器",
        //     "联系QQ 2399052066"];
        subject = "";
        duration = "";
        timer = "";
        next = "";
        progress = 100;
    }

    document.getElementById("bar").style.width = progress + "%";
    // console.log(order);
    output("subtitle", subtitle[order]);
    order < subtitle.length - 1 ? order++ : order = 0;
    output("subject", subject);
    output("duration", duration);
    output("timer", timer);
    output("next", next)
}

/*

*/

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