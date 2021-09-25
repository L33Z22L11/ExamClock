onload = function () {
    console.warn("%c\n欢迎加入野生技协\nQQ群: 894656456\n",
        "font:bold 3em Roboto,sans-serif;");
    // 希沃屏保剩余时间
    // SCREENSAVER_TIME = 45;
    eleMain = document.getElementsByTagName("body")[0];
    change("高三理科");
    if (String(location).indexOf("debug") == -1) {
        updateTime = function () {
            now = new Date();
            // 铃声校准
            // now.setMinutes(now.getMinutes() + 1);
            output("clock", getClock(now));
            updateExam();
        }
        setInterval(updateTime, 2000);
    } else {
        alert("已进入调试模式，关闭本页面可返回正常模式。")
        // 调试模式初始时间
        now = new Date("2021-09-18T15:00+08:00");
        updateTime = function () {
            // 最晚结束时间
            now > new Date("2021-09-20T19:00+08:00") ? change(type) : null;
            // 调试模式跳过夜晚
            if (now.getHours() == 19) {
                now.setHours(31);
                today = fixDigit(now.getMonth() + 1)
                    + "-" + fixDigit(now.getDate());
            }
            // 调试模式速度设置
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
    // 希沃屏保预警，已全局关闭
    // String(location).indexOf("noscreensaver") == -1 ?
    //     setInterval(updateSST, 60000) : null;
}

// onmousemove = onmousedown = function () { SCREENSAVER_TIME = 45; }

oncontextmenu = onkeydown = onselectstart = function () {
    // SCREENSAVER_TIME = 45;
    return false;
}

function change(totype) {
    // 切换类型时需要重新初始化的内容
    now = new Date();
    end = 0, progress = 0, order = 0;
    today = fixDigit(now.getMonth() + 1) + "-" + fixDigit(now.getDate());

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
    }
    subject == nextSubject && nextSubtitle ?
        subtitle = nextSubtitle : null;
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
    sh = prompt("考试开始时间所在的小时", 17);
    sm = prompt("考试开始时间所在的分钟", 0);
    eh = prompt("考试结束时间所在的小时", 18);
    em = prompt("考试结束时间所在的分钟", 0);
    $(prompt("考试科目名称", "临时"),
        today + "T" + fixDigit(sh) + ":" + fixDigit(sm),
        today + "T" + fixDigit(eh) + ":" + fixDigit(em));
    alert("考试科目：" + subject + "\n起止时间："
        + getClock(start) + "~" + getClock(end));
}

function illback() {
    now.getHours() == 18 && now.getMinutes() > 30 ?
        now.getDate() == 4 ?
            subtitle = ["今天我就要离开，明天我还会回来。9min！"] :
            subtitle = ["祝各位努力的孩子取得理想的名次！"] : null;
}

function updateExam() {
    // 防止某些类型由于没有起止时间而崩溃
    $("", "01-01T00:00", "01-01T00:00", ["考试时钟预设内容"]);
    switch (type) {
        case "高三理科":
            // illback();
            subtitle = ["高三素质拓展理科模拟训练"];
//             $("Ext<span class='small'>Holiday</span>",
//                 "09-18T17:45", "09-18T18:10",
//                 ["本场科目数据仅用作测试",
//                     "高三年级9月18日17:45放学",
//                     "预祝各位中秋快乐！"]);
            $("语文", "09-25T14:25", "09-25T16:55");
//             $("英语", "09-20T16:10", "09-20T18:10");
            break;
        case "高三文科":
            // illback();
//             subtitle = ["高三素质拓展文科模拟训练"];
//             $("Ext<span class='small'>Holiday</span>",
//                 "09-18T17:45", "09-18T18:10",
//                 ["本场科目数据仅用作测试",
//                     "高三年级9月18日17:45放学",
//                     "预祝各位中秋快乐！"]);
            $("语文", "09-25T14:25", "09-25T16:55");
//             $("英语", "09-20T16:10", "09-20T18:10");
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
        case "高三日常":
            subtitle = " "; //加空格，防止length为0
            $("晨读1", today + "T07:10", today + "T07:25");
            $("晨会", today + "T07:25", today + "T07:30");
            $("晨读2", today + "T07:30", today + "T08:00");
            $("考练", today + "T16:20", today + "T17:05");
            $("晚训", today + "T18:45", today + "T19:05");
            $("晚写", today + "T19:05", today + "T19:15");
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
        timersub = "/10min";
        activity = "课间休息";
        progress = (now - start + 18E5) / 6E3;
    } else if (now < (start - 6E5)) {
        timer = Math.round((now - start + 12E5) / 6E4);
        timersub = "/10min";
        activity = "入场扫描";
        progress = (now - start + 12E5) / 6E3;
    } else if (now < (start - 3E5)) {
        timer = Math.round((now - start + 6E5) / 6E4);
        timersub = "/5min";
        activity = "发卡贴码";
        progress = (now - start + 6E5) / 3E3;
    } else if (now < start) {
        timer = Math.round((now - start + 3E5) / 6E4);
        timersub = "/5min";
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
