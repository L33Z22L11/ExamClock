// 在考试日切换到考试
if (now.getDate() == 10 || now.getDate() == 11) { change("高三理科"); }
// 根据地址参数切换考试类型
if (search.match("totype31")) { change("高三理科"); }
if (search.match("totype32")) { change("高三文科"); }
if (search.match("totype21")) { change("高二理科"); }
if (search.match("totype22")) { change("高二文科"); }
// 正常或调试模式
if (search.match("debug")) {
    send("已进入调试模式，关闭本页面可返回正常模式。");
    now = new Date("2021-04-01");
    document.getElementById("bar").style.transition = "none";
    updateTime = function () {
        // 调试模式起始时间
        if (now < start - 36E5) { now = new Date(start - 36E5); }
        // 调试模式截止时间
        // “用加号会直接连接字符串，所以这里得减去负数，太魔幻了”
        if (now > end - -36E5) { change(type); now = new Date("2021-04-01"); }
        // 调试模式速度设置
        now.setSeconds(now.getSeconds() + 30);
        output("clock", getClock(now));
        updateExam();
    };
    setInterval(updateTime, 20);
} else {
    updateTime = function () {
        now = new Date();
        // 设置相对时差
        // now.setSeconds(now.getSeconds() + 30);
        output("clock", getClock(now));
        updateExam();
    };
    setInterval(updateTime, 2000);
}
// 正常模式
change("高三日常");
updateTime();
setInterval(updateTitle, 2000);
// 运行时间展示
output("runtime", parseInt((now - new Date("2021-04")) / 864E5) + "天");
// 考试标语轮播
function updateTitle() {
    maintitle = maintitle || $maintitle;
    subtitle = subtitle || $subtitle;
    order < subtitle.length - 1 ? order++ : order = 0;
    output("subtitle", subtitle[order]);
}
// “考试时钟的灵魂”
// 考试科目判断
function $(nextSubject, nextStart, nextEnd, nextMaintitle, nextSubtitle) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date("2021-" + nextStart + ":00+08:00");
        end = new Date("2021-" + nextEnd + ":00+08:00");
        maintitle = nextMaintitle || $maintitle;
        subtitle = nextSubtitle || $subtitle;
    }
}
// 考试时钟科目时间更新
function updateExam() {
    updateSubject();
    duration = getClock(start) + "~" + getClock(end);
    if (now < (start - 18E5)) {
        // now.getHours() == 12 && now.getHours() == 18 ?
        //     subtitle = "干饭时间到！" : 0;
        timer = parseInt((start - now - 12E5) / 36E5);
        timersub = ((start - now - 12E5) / 36E5).toFixed(1).slice(-2) + " h";
        activity = "考试加油";
        progress = 0;
    } else if (now < (start - 12E5)) {
        timer = Math.round((start - now - 12E5) / 6E4);
        timersub = "min";
        activity = "距离入场";
        progress = (start - now - 12E5) / 6E3;
    } else if (now < (start - 6E5)) {
        timer = Math.round((now - start + 12E5) / 6E4);
        timersub = "/ 10 min";
        activity = "入场扫描";
        progress = (now - start + 12E5) / 6E3;
    } else if (now < start) {
        timer = Math.round((start - now) / 6E4);
        timersub = "min";
        activity = "距离开始";
        progress = (start - now) / 6E3;
    } else if (now < end) {
        // now.getHours() == 12 ?
        //     subtitle = ["12:05可能自动关机，请留意提示。"] : 0;
        // now.getHours() == 18 ?
        //     subtitle = ["警告：考场周围应保持环境安静！"] : 0;
        if ((now - start) / (end - start) < 0.5) {
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
        subtitle = ["式微式微，胡不归？"];
        subject = duration = timer = activity = "";
        timersub = "考试结束";
        progress = 100;
    }
    output("maintitle", maintitle);
    document.getElementById("bar").style.width = progress + "%";
    output("subject", subject);
    output("duration", duration);
    output("timer", timer);
    output("timersub", timersub);
    output("activity", activity);
}
// 生成考试时间$参数字符串
function fixDigit(num) { num = parseInt(num); return num < 10 ? "0" + num : num; }
// 生成友好的时间字符串
function getClock(date) { return date.getHours() + ":" + fixDigit(date.getMinutes()); }
// 以分钟为单位相对调整时间
function fixMinutes(date, friendlyname) {
    date.setMinutes(date.getMinutes() +
        Number(prompt(friendlyname || "以分钟为单位增减" + getClock(date), -5)));
}
// 向页内元素输出值
function output(id, value) { document.getElementById(id).innerHTML = value; }
