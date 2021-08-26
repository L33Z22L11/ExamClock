onload = function () {
    // 希沃屏保，快乐古诗文
    SCREENSAVER_TIME = 45;
    eleMain = document.getElementsByTagName("body")[0];
    change("高三理科");
    if (String(location).indexOf("debug") == -1) {
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
            // 超过最晚结束时间则重新开始
            now > new Date("2021-08-27T17:00+08:00") ? change(type) : null;
            now.getHours() == 19 ? now.setHours(31) : null;
            // now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(now.getSeconds() + 30);
            output("clock", getClock(now));
            updateExam();
        }
        setInterval(updateTime, 20);
    }
    updateTime();
    updateSubtitle();
    setInterval(updateSubtitle, 2000);
    String(location).indexOf("noscreensaver") == -1 ?
        setInterval(updateSST, 60000) : null;
}

onmousemove = onmousedown = function () { SCREENSAVER_TIME = 45; }

oncontextmenu = onkeydown = onselectstart = function () {
    SCREENSAVER_TIME = 45;
    // return false;
}

function change(i) {
    // 调试模式的初始时间
    now = new Date("2021-08-26T10:00+08:00");
    // 切换类型时需要重新初始化的内容
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

function $(nextSubject, nextStart, nextEnd, nextSubtitle) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date("2021-" + nextStart + ":00+08:00");
        end = new Date("2021-" + nextEnd + ":00+08:00");
        nextSubtitle ? subtitle = nextSubtitle : null;
    }
}

function getClock(date) {
    return date.getMinutes() < 10 ?
        date.getHours() + ":0" + date.getMinutes() :
        date.getHours() + ":" + date.getMinutes();
}

function small(i) {
    return "<span class='small'>" + i + "</span>";
}

function output(id, value) {
    document.getElementById(id).innerHTML = value;
}

function updateSubtitle() {
    // 在此处可以设置基于当前时间的全局subtitle
    output("subtitle", subtitle[order]);
    order < subtitle.length - 1 ? order++ : order = 0;
}

function updateExam() {
    switch (type) {
        // 在swich语句中定义的是各类型的缺省subtitle
        case "高三理科":
            subtitle = ["高三理科诊断性考试：请以实际司号为准。"];
            $("物理", "08-26T10:40", "08-26T12:10");
            $("英语", "08-26T14:20", "08-26T16:20");
            $("化学", "08-26T16:50", "08-26T18:20");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("生物", "08-27T10:40", "08-27T12:10");
            $("数学", "08-27T14:20", "08-27T16:20");
            $("自习", "08-27T16:20", "08-27T17:00",
                ["考试已结束，请关闭考试时钟。",
                    "各位假期愉快！可联系纸鹿反馈建议。"])
            break;
        case "高三文科":
            subtitle = ["高三文科诊断性考试：请以实际司号为准。"];
            $("历史", "08-26T10:40", "08-26T12:10");
            $("英语", "08-26T14:20", "08-26T16:20");
            $("地理", "08-26T16:50", "08-26T18:20");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("政治", "08-27T10:40", "08-27T12:10");
            $("数学", "08-27T14:20", "08-27T16:20");
            $("自习", "08-27T16:20", "08-27T17:00",
                ["考试已结束，请关闭考试时钟。",
                    "各位假期愉快！可联系纸鹿反馈建议。"])
            break;
        case "高二理科":
            subtitle = ["高二理科诊断性考试：请以实际铃声为准。"];
            $("物理", "08-26T10:40", "08-26T12:20");
            $("数学", "08-26T14:20", "08-26T16:20");
            $("化学", "08-26T16:50", "08-26T18:30");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("生物", "08-27T10:40", "08-27T12:10");
            $("英语", "08-27T14:20", "08-27T16:20");
            break;
        case "高二文科":
            subtitle = ["高二文科诊断性考试：请以实际铃声为准。"];
            $("历史", "08-26T10:40", "08-26T12:20");
            $("数学", "08-26T14:20", "08-26T16:20");
            $("地理", "08-26T16:50", "08-26T18:30");
            $("语文", "08-27T07:40", "08-27T10:10");
            $("政治", "08-27T10:40", "08-27T12:20");
            $("英语", "08-27T14:20", "08-27T16:20");
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
            $("", "01-01T00:00", "01-01T00:01",
                ["该功能开发中，敬请期待。"]);
            break;
        default:
            $("", "01-01T00:00", "01-01T00:01",
                ["不存在的考试类型，请重新选择。"]);
    }
    duration = getClock(start) + "~" + getClock(end);

    if (now < (start - 18E5)) {
        (now.getHours() == 12 && now.getHours() == 18) ?
            subtitle = "干饭时间到！" : null;
        timer = Math.floor((start - now) / 36E4) / 10 + small("h后");
        activity = "考试加油";
        progress = 0;
    } else if (now < (start - 12E5)) {
        timer = Math.floor((now - start + 18E5) / 6E4) + small("/10min");
        activity = "课间休息";
        progress = (start - 12E5 - now) / 6E3;
    } else if (now < (start - 6E5)) {
        timer = Math.floor((now - start + 12E5) / 6E4) + small("/10min");
        activity = "入场扫描";
        progress = (start - 6E5 - now) / 6E3;
    } else if (now < (start - 3E5)) {
        timer = Math.floor((now - start + 6E5) / 6E4) + small("/5min");
        activity = "发卡贴码";
        progress = (start - 3E5 - now) / 3E3;
    } else if (now < start) {
        timer = Math.floor((now - start + 3E5) / 6E4) + small("/5min");
        activity = "发卷审题";
        progress = (start - now) / 3E3;
    } else if (now < end) {
        now.getHours() == 12 ?
            subtitle = ["警告：信息中心设置12:05自动关机，请注意取消。"] : null;
        // now.getHours() == 18 ?
        //     subtitle = ["警告：考场周围应保持环境安静！"] : null;
        if ((now - start) / (end - start) < .5) {
            timer = Math.floor((now - start) / 6E4) + small("min");
            activity = "已经开始";
        } else {
            timer = Math.floor((end - now) / 6E4) + small("min");
            activity = "距离结束";
        }
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
    eleSST = document.getElementById("SSTBubble");
    SCREENSAVER_TIME -= 1;
    if (SCREENSAVER_TIME < 0) {
        eleSST.style.backgroundColor = "rgba(255,255,255,.2)";
        output("SST", "已经");
    } else if (SCREENSAVER_TIME < 10) {
        eleSST.style.display = "flex";
        eleSST.style.backgroundColor = "#f52";
        output("SST", "在" + SCREENSAVER_TIME + "分钟后");
    } else {
        eleSST.style.display = "";
    }
}
