// “等我研究了地址查询传参到对象，就把type改成channel”
// 正常或调试模式
if (search.match("debug")) {
  send("已进入调试模式，关闭本页面可返回正常模式。");
  now = new Date("2021-04");
  document.getElementById("bar").style.transition = "none";
  updateTime = function () {
    // 调试模式起始时间
    if (now < start - 36E5) now = new Date(start - 36E5);
    // 调试模式截止时间
    // “用加号会直接连接字符串，所以这里得减去负数，太魔幻了”
    if (now > end - -36E5) { change(type); now = new Date("2021-04"); }
    // 调试模式速度设置
    now.setSeconds(now.getSeconds() + 30);
    output("clock", getClock(now));
    updateExam();
  };
  setInterval(updateTime, 20);
} else {
  now = new Date();
  updateTime = function () {
    now = new Date();
    // 设置相对时差
    // now.setSeconds(now.getSeconds() + 30);
    output("clock", getClock(now));
    updateExam();
  };
  setInterval(updateTime, 2000);
}
// 以当前日期为基础的日常/临时科目
today = new Date();
todate = today.getFullYear() + "-" + fixDigit(today.getMonth() + 1) + "-" + fixDigit(today.getDate());
week = parseInt((today - new Date("2021-08-22")) / 6048E5);
weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][today.getDay()];
// “切啊切啊切”
// 根据地址参数切换考试类型
if (search.match("totype30")) change("高三日常");
else if (search.match("totype31")) change("高三理科");
else if (search.match("totype32")) change("高三文科");
else if (search.match("totype21")) change("高二理科");
else if (search.match("totype22")) change("高二文科");
// 在考试日期切换到考试类型
else if (now.getDate() == 31) change("12.31临时");
// else if (now.getDate() == 10 || now.getDate() == 11) change("高三理科");
// else if (now.getDate() == 17 || now.getDate() == 18) change("高二理科");
// 默认考试类型
else change("高三日常");
setInterval(updateTitle, 2000);
// 运行时间展示
output("runtime", parseInt((new Date() - new Date("2021-04")) / 864E5) + "天");
// 考试标语轮播
function updateTitle() {
  maintitle = maintitle || $maintitle;
  subtitle = subtitle || $subtitle;
  subtitlenum < subtitle.length - 1 ? subtitlenum++ : subtitlenum = 0;
  output("maintitle", maintitle);
  output("subtitle", subtitle[subtitlenum]);
}
// “考试时钟的灵魂”
// 考试科目判断
function $(nextSubject, nextDate, nextStart, nextEnd, nextMaintitle, nextSubtitle) {
  if (now < end) console.log("当前科目未结束，故不注入科目：" + nextSubject);
  else if (now >= new Date(nextDate + "T" + nextEnd + "+08:00"))
    console.log("请求科目已结束，故不注入科目：" + nextSubject);
  else {
    subject = nextSubject;
    start = new Date(nextDate + "T" + nextStart + "+08:00");
    end = new Date(nextDate + "T" + nextEnd + "+08:00");
    maintitle = nextMaintitle || $maintitle;
    subtitle = nextSubtitle || $subtitle;
    console.log(getClock(now) + "时成功注入科目：" + nextSubject + "\n开始时间：" + nextDate, nextStart + "\n结束时间：" + nextDate, nextEnd + ["\n指定大标语：", "\n默认大标语："][!nextMaintitle * 1] + maintitle + ["\n指定副标语：", "\n默认副标语："][!nextSubtitle * 1] + subtitle);
  }
}
// 考试时钟科目时间更新
function updateExam() {
  if (now >= end) { updateSubject(); }
  duration = getClock(start) + "~" + getClock(end);
  if (now < (start - 6E5) && type.match("日常")) {
    timer = parseInt((start - now) / 36E5);
    timersub = ((start - now) / 36E5).toFixed(1).slice(-2) + " h";
    activity = "距离开始";
    progress = 0;
  }
  else if (now < (start - 18E5)) {
    // now.getHours() == 12 && now.getHours() == 18 ?
    //   subtitle = "干饭时间到！" : 0;
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
    //   subtitle = ["12:05可能自动关机，请留意提示。"] : 0;
    // now.getHours() == 18 ?
    //   subtitle = ["警告：考场周围应保持环境安静！"] : 0;
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
    // 结束后的内容
    updateSubject = function () {
      maintitle = "考试结束";
      subtitle = ["式微式微，胡不归？", "考试人，考试魂，考试都是人上人",
        "任何时刻都不轻言放弃", "晚安，考试人，向你salute！"];
    }
    subject = duration = timer = timersub = activity = "";
    progress = 100;
  }
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
