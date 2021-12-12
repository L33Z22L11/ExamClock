// 这是你的考试时钟代码，一个承载着痛苦的开始。
function change(totype) {
    // 切换类型时需要重新初始化的内容
    // maintitle = subtitle = null;
    start = end = new Date("2021-04"), progress = 0, order = 0;
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
            today = new Date();
            todate = fixDigit(today.getMonth() + 1) + "-" + fixDigit(today.getDate()) + "T";
            week = parseInt((today - new Date("2021-08-22")) / 6048E5);
            weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][today.getDay()];
            // 特别注意，最后一轮求余后应该是数组第0项
            test = [[, , "语文", , "历史/物理"], [, , "政治/化学", , "英语"], [, , "数学", , "地理/生物"]]
            [week % 3][today.getDay()] || "无";
            practice = [["英语", "语文", "地理/物理", "数学", "政治/化学", "历史/生物"],
            ["数学", "英语", "地理/物理", "政治/化学", "语文", "历史/生物"]][week % 2][today.getDay()] || "无";
            $maintitle = "距离高考" + parseInt((new Date("2022-06-07T22:30+08:00") - today) / 864E5) + "天";
            $subtitle = [""];
            updateSubject = function () {
                // “这种情况就比较复杂了，代码和人有一个能跑就行”
                if (today.getDay() == 0) {
                    // 周日下午
                    $subtitle = ["第" + week + "周" + weekday + "大考练"];
                    // console.log("0simulation" + today);
                    $(["综合", "语文"][week % 2], todate + "14:10", todate + "16:40");
                    $("订正", todate + "16:50", todate + "17:30");
                } else {
                    // 非周日的早上
                    // console.log("morning" + today);
                    if (today.getDay() == 5) $("听力", todate + "07:05", todate + "07:25");
                    // “非得早来10分钟”
                    $("晨读1", todate + "07:00", todate + "07:25");
                    $("晨会", todate + "07:25", todate + "07:30");
                    $("晨读2", todate + "07:30", todate + "08:00");
                    // “多睡5分钟能咋”
                    $("午休", todate + "12:00", todate + "13:50");
                }
                if (today.getDay() != 6) {
                    if (today.getDay() == 2 || today.getDay() == 4) {
                        // 周二、周四下午
                        // console.log("test" + today);
                        $subtitle = ["第" + week + "周(第" + (week % 3 || 3) + "轮)：" + weekday + test + "限时纠错训练"];
                        $("考练", todate + "16:05", todate + "16:50");
                    }
                    // 非周六的晚上
                    // console.log("evening" + today);
                    $("短训", todate + "18:25", todate + "18:45", null,
                        ["第" + week + ["周：双周", "周：单周"][week % 2] + weekday + practice + "小题精练"]);
                    $("晚写", todate + "18:45", todate + "18:55");
                    $("晚一", todate + "18:55", todate + "19:40");
                    $("晚二", todate + "19:50", todate + "20:35");
                    $("晚三", todate + "20:50", todate + "22:00");
                    $("晚修", todate + "22:00", todate + "23:00");
                } else {
                    // 周六的下午和晚上
                    // console.log("6simulation" + today);
                    $(["英语", "数学"][week % 2], todate + "16:00", todate + "17:45", null,
                        ["第" + week + "周" + weekday + "大考练"]);
                    $("订正", todate + "17:45", todate + "17:55");
                }
            };
            break;
        case "高一":
            // “高一年级部也太不给面子了”
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
            // “为什么大多数人都不知道这个功能”
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = [""];
            // “自己去右键菜单改标语吧，一般人也用不上，对吧”
            // $maintitle = prompt("考试大标语(可选)") || "沉着冷静&emsp;诚信考试";
            // $subtitle = [prompt("考试副标语(可选)")];
            $(prompt("考试科目名称(3个字以内)", "临时"),
                todate + fixDigit(prompt("考试开始时间(小时)", 16)) + ":" + fixDigit(prompt("考试开始时间(分钟)", 25)),
                todate + fixDigit(prompt("考试结束时间(小时)", 23)) + ":" + fixDigit(prompt("考试结束时间(分钟)", 55)));
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
