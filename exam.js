function updateExam() {
    // $("", "01-01T00:00", "01-01T00:00", ["考试时钟预设内容"]);
    switch (type) {
        case "高三理科":
            // illback();
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高三理科月考二：请以实际司号为准。"];
            // subtitle = ["高三素质拓展理科模拟训练"];
            $("英语", "11-05T14:00", "11-05T16:00");
            $("物理", "11-05T16:30", "11-05T18:10");
            $("语文", "11-06T07:40", "11-06T10:10");
            $("生物", "11-06T10:40", "11-06T12:10");
            $("数学", "11-06T14:00", "11-06T16:00");
            $("化学", "11-06T16:30", "11-06T18:10");
            break;
        case "高三文科":
            // illback();
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高三文科月考二：请以实际司号为准。"];
            // subtitle = ["高三素质拓展文科模拟训练"];
            $("英语", "11-05T14:00", "11-05T16:00");
            $("历史", "11-05T16:30", "11-05T18:10");
            $("语文", "11-06T07:40", "11-06T10:10");
            $("地理", "11-06T10:40", "11-06T12:20");
            $("数学", "11-06T14:00", "11-06T16:00");
            $("政治", "11-06T16:30", "11-06T18:10");
            break;
        case "高二理科":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高二理科期中暨模块结业考试：请以实际铃声为准。"];
            $("数学", "11-12T14:00", "11-12T16:00");
            $("物理", "11-12T16:30", "11-12T18:10");
            $("语文", "11-13T07:40", "11-13T10:10");
            $("生物", "11-13T10:40", "11-13T12:10");
            $("英语", "11-13T14:00", "11-13T16:00");
            $("化学", "11-13T16:30", "11-13T18:10");
            break;
        case "高二文科":
            $maintitle = "沉着冷静&emsp;诚信考试";
            $subtitle = ["高二文科期中暨模块结业考试：请以实际铃声为准。"];
            $("数学", "11-12T14:00", "11-12T16:00");
            $("历史", "11-12T16:30", "11-12T18:10");
            $("语文", "11-13T07:40", "11-13T10:10");
            $("地理", "11-13T10:40", "11-13T12:20");
            $("英语", "11-13T14:00", "11-13T16:00");
            $("政治", "11-13T16:30", "11-13T18:10");
            break;
        case "高三日常":
            $maintitle = "";
            $subtitle = [""];
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
            $maintitle = "暂未启用";
            $subtitle = ["高一暂未启用考试时钟。"];
            $("数学", "06-28T14:20", "06-28T16:00");
            $("英语", "06-28T16:30", "06-28T18:10");
            $("语文", "06-29T07:50", "06-29T09:50");
            $("化学", "06-29T10:20", "06-29T12:00");
            $("物理", "06-29T14:20", "06-29T16:00");
            $("生物", "06-29T16:30", "06-29T18:00");
            $("政史", "06-30T07:50", "06-30T09:50");
            $("地理", "06-30T10:20", "06-30T11:20");
            break;
        case "临时科目": break;
        default: $subtitle = ["不存在的考试类型，请重新选择。"];
    }
    duration = getClock(start) + "~" + getClock(end);
    if (now < (start - 18E5)) {
        // now.getHours() == 12 && now.getHours() == 18 ?
        //     subtitle = "干饭时间到！" : null;
        timer = Math.round((start - now - 12E5) / 36E4) / 10;
        timersub = "h";
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
        // subtitle = ["式微式微，胡不归？"];
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
