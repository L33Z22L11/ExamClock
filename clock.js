eleMain = document.getElementById("main");
change("高三日常");
// 正常模式
updateTime = function () {
    now = new Date();
    // 设置相对时差
    // now.setSeconds(now.getSeconds() + 30);
    output("clock", getClock(now));
    updateExam();
};
setInterval(updateTime, 2000);
updateTime();
// 考试标语轮播
setInterval(updateTitle, 2000);
// 考试标语轮播
function updateTitle() {
    maintitle = maintitle || $maintitle;
    subtitle = subtitle || $subtitle;
    order < subtitle.length - 1 ? order++ : order = 0;
    output("subtitle", subtitle[order]);
}
// 运行时间展示
setInterval(function () {
    output("runtime", ((now - new Date("2021-04")) / 36E5).toFixed(3) + "小时");
}, 1800);
// 切换考试类型
function change(totype) {
    // 切换类型时需要重新初始化的内容
    now = new Date();
    subtitle = maintitle = null;
    start = end = new Date("2021-04-01"), progress = 0, order = 0;
    // 生成$函数的今日日期字符串
    today = fixDigit(now.getMonth() + 1) + "-" + fixDigit(now.getDate()) + "T";
    type = totype || type;
    output("type", type);
    // 切换类型的对焦动画
    eleMain.style.filter = "blur(.5em)";
    // “客户想提升‘应用流畅度’，就把延迟改小点”
    setTimeout(function () {
        eleMain.style.filter = "blur(0)";
        updateTime();
        updateTitle();
    }, 200);
}
// “考试时钟的灵魂”
// 考试科目轮播
function $(nextSubject, nextStart, nextEnd, nextSubtitle, nextMaintitle) {
    if (now >= end) {
        subject = nextSubject;
        start = new Date("2021-" + nextStart + ":00+08:00");
        end = new Date("2021-" + nextEnd + ":00+08:00");
        subtitle = nextSubtitle || $subtitle;
        maintitle = nextMaintitle || $maintitle;
    }
    // “下次再好好研究这个怎么写”
    // subject == nextSubject && nextSubtitle ? subtitle = nextSubtitle : null;
}
// 生成考试时间$参数字符串
function fixDigit(num) { num = parseInt(num); return num < 10 ? "0" + num : num; }
// 生成友好时间字符串
function getClock(date) { return date.getHours() + ":" + fixDigit(date.getMinutes()); }
// 以分钟为单位相对调整时间
function fixMinutes(date, friendlyname) {
    date.setMinutes(date.getMinutes()
        + Number(prompt(friendlyname || "以分钟为单位增减" + getClock(date), -5)));
}
// 向页内元素输出值
function output(id, value) { document.getElementById(id).innerHTML = value; }
function setTemp() {
    $(prompt("考试科目名称", "临时"), today + fixDigit(prompt("考试开始时间(小时)", 16)) + ":" +
        fixDigit(prompt("考试开始时间(分钟)", 25)), today + fixDigit(prompt("考试结束时间(小时)", 23))
        + ":" + fixDigit(prompt("考试结束时间(分钟)", 55)), [prompt("考试副标语(可选)") ||
            "欢迎使用考试时钟，如有问题可以加入QQ群894656456交流。"]);
    output("maintitle", maintitle = prompt("考试大标语(可选)") || "沉着冷静&emsp;诚信考试");
    alert("考试科目：" + subject + "\n起止时间：" + getClock(start) + "~" + getClock(end));
}
function illback() {
    now.getHours() == 18 && now.getMinutes() > 30 ?
        now.getDate() == 4 ?
            subtitle = ["今天我就要离开，明天我还会回来。9min！"] :
            subtitle = ["祝各位努力的孩子取得理想的名次！"] : null;
}
