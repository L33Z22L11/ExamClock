/* 
 * 适用于宝鸡中学的考试科目列表
 */
console.log("%c\n加入Techaos! 混技\nQQ群: 169994096\n", "font:3em Montserrat,sans-serif;");
console.log("%c\n野生技协(混技分部)\nQQ群: 894656456\n", "font:3em Montserrat,sans-serif;");
/* 
 * 考试科目内容实现
 */
function change(toSubjectType) {
  // 切换类型时需要重新初始化的内容
  subject.name = "无科目";
  subject.start = new Date("2021-04");
  subject.end = new Date("2021-04");
  timer.progress = 0;
  slogan.subnum = 0;
  slogan.main = slogan.sub = null;
  slogan.$main = "沉着冷静&emsp;诚信考试";
  switch (toSubjectType) {
    case "1.2临时":
      // “希望这样的安排以后都不要有”
      slogan.$main = "";
      slogan.$sub = [""];
      subject.update = function () {
        $("英语", "2022-01-02", "16:05", "18:00");
        $("晚训", "2022-01-02", "18:25", "18:55", null, ["我猜应该是历史/生物"]);
      };
      break;
    case "高三日常":
      // 特别注意，最后一轮求余后应该是数组第0项
      slogan.$main = "距离高考" + parseInt((new Date("2022-06-07T22:30+08:00") - new Date()) / 864E5) + "天";
      slogan.$sub = [""];
      subject.update = function () {
        // 这种情况就比较复杂了，代码和人有一个能跑就行
        if (today.day == 0) {
          // 周日下午
          // console.log("0simulation" + new Date());
          $(["综合", "语文"][today.week % 2], today.date, "14:10", "16:40", null,
            ["第" + today.week + "周" + today.weekday + "大考练"]);
          $("订正", today.date, "16:50", "17:30");
        } else {
          // 非周日的早上
          // console.log("morning" + new Date());
          if (today.day == 5) $("听力", today.date, "07:05", "07:25");
          // “非得早来10分钟”
          $("晨读1", today.date, "07:00", "07:25");
          $("晨会", today.date, "07:25", "07:30");
          $("晨读2", today.date, "07:30", "08:00");
          // “多睡5分钟能咋”
          $("午休", today.date, "12:00", "13:50");
        }
        if (today.day != 6) {
          if (today.day == 2 || today.day == 4) {
            // 周二、周四下午
            // console.log("test" + new Date());
            // $("考练", today.date, "16:05", "16:50", null,
            //   ["第" + today.week + "周(第" + (today.week % 3 || 3) + "轮): " + today.weekday +
            //     ([[, , "语文", , "历史/物理"], [, , "政治/化学", , "数学"], [, , "英语", , "地理/生物"]]
            //     [today.week % 3][today.day] || "无") + "限时纠错训练"]);
            $("考练", today.date, "17:00", "17:45", null, "目前暂未更新课表");
          }
          // 非周六的晚上
          // console.log("evening" + new Date());
          $("晚训", today.date, "18:25", "18:45", null,
            ["第" + today.week + ["周: 双周", "周: 单周"][today.week % 2] + today.weekday +
              ([["英语", "语文", "地理/物理", "数学", "政治/化学", "历史/生物"],
              ["数学", "英语", "地理/物理", "政治/化学", "语文", "历史/生物"]]
              [today.week % 2][today.day] || "无") + "小题精练"]);
          $("晚写", today.date, "18:45", "18:55");
          $("晚一", today.date, "18:55", "19:40");
          $("晚二", today.date, "19:50", "20:35");
          $("晚三", today.date, "20:50", "22:00");
          $("晚修", today.date, "22:00", "23:00");
        } else {
          // 周六的下午和晚上
          // console.log("6simulation" + new Date());
          $(["英语", "数学"][today.week % 2], today.date, "16:00", "17:45", null,
            ["第" + today.week + "周" + today.weekday + "大考练"]);
          $("订正", today.date, "17:45", "17:55");
        }
      };
      break;
    case "高三一检":
      slogan.$sub = ["2022年宝鸡市高考模拟检测(一): 请以实际司号及广播通知为准。"];
      subject.update = function () {
        $("语文", "2022-01-08", "09:00", "11:30");
        $("午休", "2022-01-08", "11:30", "12:50", "好好干饭，莫打球");
        $("数学", "2022-01-08", "15:00", "17:00");
        $("综合", "2022-01-09", "09:00", "11:30");
        $("午休", "2022-01-09", "11:30", "12:50", "好好干饭，莫打球");
        $("英语", "2022-01-09", "15:00", "17:00");
      };
      break;
    case "高三理科":
      slogan.$sub = ["高三理科月考三: 请以实际司号为准。"];
      subject.update = function () {
        $("数学", "2021-12-10", "14:00", "16:00");
        $("化学", "2021-12-10", "16:30", "18:10");
        $("语文", "2021-12-11", "07:40", "10:10");
        $("生物", "2021-12-11", "10:40", "12:10");
        $("英语", "2021-12-11", "14:00", "16:00");
        $("物理", "2021-12-11", "16:30", "18:10");
      };
      break;
    case "高三文科":
      slogan.$sub = ["高三文科月考三: 请以实际司号为准。"];
      subject.update = function () {
        $("数学", "2021-12-10", "14:00", "16:00");
        $("地理", "2021-12-10", "16:30", "18:10");
        $("语文", "2021-12-11", "07:40", "10:10");
        $("政治", "2021-12-11", "10:40", "12:20");
        $("英语", "2021-12-11", "14:00", "16:00");
        $("历史", "2021-12-11", "16:30", "18:10");
      };
      break;
    case "高二理科":
      slogan.$sub = ["高二理科阶段考试: 请以实际铃声为准。"];
      subject.update = function () {
        $("英语", "2021-12-17", "14:00", "16:00");
        $("物理", "2021-12-17", "16:30", "18:10");
        $("语文", "2021-12-18", "07:40", "10:10");
        $("生物", "2021-12-18", "10:40", "12:10");
        $("数学", "2021-12-18", "14:00", "16:00");
        $("化学", "2021-12-18", "16:30", "18:10");
      };
      break;
    case "高二文科":
      slogan.$sub = ["高二文科阶段考试: 请以实际铃声为准。"];
      subject.update = function () {
        $("英语", "2021-12-17", "14:00", "16:00");
        $("地理", "2021-12-17", "16:30", "18:10");
        $("语文", "2021-12-18", "07:40", "10:10");
        $("政治", "2021-12-18", "10:40", "12:20");
        $("数学", "2021-12-18", "14:00", "16:00");
        $("历史", "2021-12-18", "16:30", "18:10");
      };
      break;
    case "高一":
      // “高一年级竟然不用”
      slogan.$main = "暂未启用";
      slogan.$sub = ["高一暂未启用考试时钟。"];
      subject.update = function () {
        $("数学", "2021-06-28", "14:20", "16:00");
        $("英语", "2021-06-28", "16:30", "18:10");
        $("语文", "2021-06-29", "07:50", "09:50");
        $("化学", "2021-06-29", "10:20", "12:00");
        $("物理", "2021-06-29", "14:20", "16:00");
        $("生物", "2021-06-29", "16:30", "18:00");
        $("政史", "2021-06-30", "07:50", "09:50");
        $("地理", "2021-06-30", "10:20", "11:20");
      };
      break;
    case "临时科目":
      // “大多数人都没用过这个功能”
      slogan.$sub = [""];
      var ts, tsh, tsm, teh, tem;
      if (!(ts = prompt("考试科目名称(3个字以内)", "临时")) ||
        !(tsh = prompt("考试开始时间(小时)", 16)) ||
        !(tsm = prompt("考试开始时间(分钟)", 25)) ||
        !(teh = prompt("考试结束时间(小时)", 23)) ||
        !(tem = prompt("考试结束时间(分钟)", 55))) {
        // 取消创建临时科目
        console.warn(send("由于操作取消，未生成临时科目。"));
        toSubjectType = null;
      } else {
        // 成功创建临时科目
        $(ts, today.date, fixDigit(tsh) + ":" + fixDigit(tsm), fixDigit(teh) + ":" + fixDigit(tem));
        // alert("考试科目: " + subject.name + "\n起止时间: " + getClock(subject.start) + "~" + getClock(subject.end));
        subject.update = function () { };
        console.log(send("添加了一门在 " + today.date + " 从 " + fixDigit(tsh) + ":" + fixDigit(tsm) + " 到 " + fixDigit(teh) + ":" + fixDigit(tem) + " 的科目: " + ts));
      }
      break;
    default:
      slogan.$main = "考试时钟";
      slogan.$sub = ["不存在的考试类型，请重新选择。"];
      subject.update = function () { };
  }
  type = toSubjectType || type;
  eleType.innerHTML = type;
  // 切换类型的对焦动画
  eleCard.style.filter = "blur(.5em)";
  // “客户想提升‘应用流畅度’，就把延迟改小点”
  setTimeout(function () {
    eleCard.style.filter = "blur(0)";
    timer.update();
    slogan.update();
  }, 400);
}
// 在一位数前补“0”
function fixDigit(num) { num = parseInt(num); return num < 10 ? "0" + num : num; }
