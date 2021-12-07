// 这是你的考试时钟代码，一个承载着痛苦的开始。
function change(totype) {
    // 切换类型时需要重新初始化的内容
    // maintitle = subtitle = null;
    start = end = new Date("2021-04"), progress = 0, order = 0;
    // 生成$函数的今日日期字符串
    today = fixDigit(now.getMonth() + 1) + "-" + fixDigit(now.getDate()) + "T";
    type = totype || type;
    output("type", type);
    // 切换类型的对焦动画
    eleMain.style.filter = "blur(.5em)";
    switch (type) {
        case "高三理科":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高三理科月考三：请以实际司号为准。"];
            updateSubject = function () {
                $("数学", "12-10T14:00", "12-10T16:00");
                $("化学", "12-10T16:30", "12-10T18:10");
                $("语文", "12-11T07:40", "12-11T10:10");
                $("生物", "12-11T10:40", "12-11T12:10");
                $("英语", "12-11T14:00", "12-11T16:00");
                $("物理", "12-11T16:30", "12-11T18:10");
            };
            break;
        case "高三文科":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高三文科月考三：请以实际司号为准。"];
            updateSubject = function () {
                $("数学", "12-10T14:00", "12-10T16:00");
                $("地理", "12-10T16:30", "12-10T18:10");
                $("语文", "12-11T07:40", "12-11T10:10");
                $("政治", "12-11T10:40", "12-11T12:20");
                $("英语", "12-11T14:00", "12-11T16:00");
                $("历史", "12-11T16:30", "12-11T18:10");
            };
            break;
        case "高二理科":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高二理科阶段考试：请以实际铃声为准。"];
            updateSubject = function () {
                $("英语", "12-17T14:00", "12-17T16:00");
                $("物理", "12-17T16:30", "12-17T18:10");
                $("语文", "12-18T07:40", "12-18T10:10");
                $("生物", "12-18T10:40", "12-18T12:10");
                $("数学", "12-18T14:00", "12-18T16:00");
                $("化学", "12-18T16:30", "12-18T18:10");
            };
            break;
        case "高二文科":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高二文科阶段考试：请以实际铃声为准。"];
            updateSubject = function () {
                $("英语", "12-17T14:00", "12-17T16:00");
                $("地理", "12-17T16:30", "12-17T18:10");
                $("语文", "12-18T07:40", "12-18T10:10");
                $("政治", "12-18T10:40", "12-18T12:20");
                $("数学", "12-18T14:00", "12-18T16:00");
                $("历史", "12-18T16:30", "12-18T18:10");
            };
            break;
        case "高三日常":
            $maintitle = "距离高考" + parseInt((new Date("2022-06-07T22:30+08:00") - now) / 864E5) + "天";
            $subtitle = [""];
            week = parseInt((now - new Date("2021-08-22")) / 6048E5);
            weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][now.getDay()];
            // 特别注意，最后一轮求余后应该是数组第0项
            test = [[, , "语文", , "历史/物理"], [, , "政治/化学", , "英语"], [, , "数学", , "地理/生物"]]
            [week % 3][now.getDay()] || "无";
            practice = [["英语", "语文", "地理/物理", "数学", "政治/化学", "历史/生物"],
            ["数学", "英语", "地理/物理", "政治/化学", "语文", "历史/生物"]][week % 2][now.getDay()] || "无";
            updateSubject = function () {
                // “这种情况就比较复杂了，代码和人有一个能跑就行”
                if (now.getDay() == 0) {
                    // console.log("0simulation"+now);
                    $(["语文", "综合"][week % 2], today + "14:10", today + "16:40", null,
                        ["第" + week + "周" + weekday + "大考练"]);
                    $("订正", today + "16:40", today + "17:30");
                } else {
                    // console.log("morning"+now);
                    // “非得早来10分钟”
                    $("晨读1", today + "07:00", today + "07:25");
                    $("晨会", today + "07:25", today + "07:30");
                    $("晨读2", today + "07:30", today + "08:00");
                    // “多睡5分钟能咋”
                    $("午休", today + "12:00", today + "13:50");
                }
                if (now.getDay() != 6) {
                    // console.log("evening");
                    if (now.getDay() % 2 == 0) {
                        // console.log("test");
                        $("考练", today + "16:05", today + "16:50", null,
                            ["第" + week + "周(第" + (week % 3 || 3) + "轮)：" + weekday + test + "限时纠错训练"]);
                    }
                    $("短训", today + "18:25", today + "18:45", null,
                        ["第" + week + ["周：双周", "周：单周"][week % 2] + weekday + practice + "小题精练"]);
                    $("晚写", today + "18:45", today + "18:55");
                    $("晚一", today + "18:55", today + "19:40");
                    $("晚二", today + "19:50", today + "20:35");
                    $("晚三", today + "20:50", today + "22:00");
                    $("晚修", today + "22:00", today + "23:00");
                } else {
                    // console.log("6simulation");
                    $(["英语", "数学"][week % 2], today + "16:00", today + "17:45", null,
                        ["第" + week + "周" + weekday + "大考练"]);
                    $("订正", today + "17:45", today + "17:55");
                }
            };
            break;
        case "高一":
            $maintitle = "暂未启用";
            $subtitle = ["高一暂未启用考试时钟。"];
            updateSubject = function () {
                $("数学", "06-28T14:20", "06-28T16:00");
                $("英语", "06-28T16:30", "06-28T18:10");
                $("语文", "06-29T07:50", "06-29T09:50");
                $("化学", "06-29T10:20", "06-29T12:00");
                $("物理", "06-29T14:20", "06-29T16:00");
                $("生物", "06-29T16:30", "06-29T18:00");
                $("政史", "06-30T07:50", "06-30T09:50");
                $("地理", "06-30T10:20", "06-30T11:20");
            };
            break;
        case "临时科目":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = [""];
            // $maintitle = prompt("考试大标语(可选)") || "沉着冷静&emsp;诚信考试";
            // $subtitle = [prompt("考试副标语(可选)")];
            $(prompt("考试科目名称(3个字以内)", "临时"),
                today + fixDigit(prompt("考试开始时间(小时)", 16)) + ":" + fixDigit(prompt("考试开始时间(分钟)", 25)),
                today + fixDigit(prompt("考试结束时间(小时)", 23)) + ":" + fixDigit(prompt("考试结束时间(分钟)", 55)));
            alert("考试科目：" + subject + "\n起止时间：" + getClock(start) + "~" + getClock(end));
            updateSubject = function () { };
            break;
        default:
            $maintitle = "考试时钟";
            $subtitle = ["不存在的考试类型，请重新选择。"];
            updateSubject = function () { };
    }
    // “客户想提升‘应用流畅度’，就把延迟改小点”
    setTimeout(function () {
        eleMain.style.filter = "blur(0)";
        updateTime();
        updateTitle();
    }, 200);
}
