/* 
 * 时间更新
 */

// 这里可以修改today.date
// 测试结束后一定要删除测试数据
// 否则“今天”就是today.date
var today = new Date;

today = {
  date: today.getFullYear() + "-" + fixDigit(today.getMonth() + 1) + "-" + fixDigit(today.getDate()),
  week: parseInt((today - new Date(2022, 1, 6)) / 6048E5),
  day: today.getDay(),
  weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][today.getDay()],
};
// 各个对象内置功能
var exam = {};
var subject = {
  get name() { return document.getElementById("subject").innerHTML; },
  set name(name) { document.getElementById("subject").innerHTML = name; },
  get duration() {
    if (now > this.end) return "";
    return getClock(this.start) + "~" + getClock(this.end);
  },
  set duration(duration) { document.getElementById("duration").innerHTML = duration; },
  // get _start() { },
  // set _start(start) { },
  // get _end() { },
  // set _end(end) { },
};
var slogan = {
  // 这块有机会再写


};
var timer = {
  // 这块也一样，有机会再写


};
subject.to = function (to) {
  // 切换类型时需要重置的内容
  if (SP.debug) now = new Date(0);
  this.name = "";
  this.start = new Date(0);
  this.end = new Date(0);
  this.$admit = 15;
  timer.progress = slogan.main = slogan.sub = slogan.subnum = 0;
  slogan.$main = "沉着冷静&emsp;诚信考试";
  slogan.$sub = [""];
  this.on = to in exam ? to : this.on;
  document.getElementById("type").innerHTML = exam[this.on]();
  if (SP.debug == null) playCover("正在传送到坐标 <span class='shield'>?type=" + this.on + "</span>，请稍候");
  // document.getElementsByClassName("card")[0].style.filter = "blur(.5em)";
  // 想提升应用启动速度，就把延迟改小点
  setTimeout(function () {
    // document.getElementsByClassName("card")[0].style.filter = "blur(0)";
    timer.update();
    slogan.update();
  }, 500);
}
// 设置临时科目
function setTemp(ts, tsh, tsm, teh, tem) {
  subject.end = new Date(0);
  if (!(ts = prompt("考试科目名称(3个字以内)", "考练")) ||
    !(tsh = prompt("考试开始时间(小时)", 16)) ||
    !(tsm = prompt("考试开始时间(分钟)", 25)) ||
    !(teh = prompt("考试结束时间(小时)", 23)) ||
    !(tem = prompt("考试结束时间(分钟)", 55))) {
    // 取消创建临时科目
    console.warn(send("由于操作取消，未生成临时科目。"));
  } else {
    // 成功创建临时科目
    console.log(send("添加了一门在 " + today.date + " 从 " + fixDigit(tsh) + ":" + fixDigit(tsm) + " 到 " + fixDigit(teh) + ":" + fixDigit(tem) + " 的科目：" + ts));
    $(ts, today.date, fixDigit(tsh) + ":" + fixDigit(tsm), fixDigit(teh) + ":" + fixDigit(tem));
    if (subject.end < now) console.log(send("设置的结束时间小于当前时间，你是认真的吗"));
  }
}
// 注入当前科目
function $(toSubject, toDate, toStart, toEnd, toMainslogan, toSubslogan, toAdmit) {
  if (now < subject.end) {
    // console.log("当前科目未结束，故不注入科目：" + toSubject);
  } else if (now >= new Date(toDate + "T" + toEnd + "+08:00")) {
    // console.log("请求科目已结束，故不注入科目：" + toSubject);
  } else {
    subject.name = toSubject;
    // document.getElementById("subject").innerHTML = subject.name;
    subject.start = new Date(toDate + "T" + toStart + "+08:00");
    subject.end = new Date(toDate + "T" + toEnd + "+08:00");
    subject.duration = subject.duration;
    subject.admit = toAdmit != null ? toAdmit : subject.$admit;
    // document.getElementById("duration").innerHTML = subject.duration;
    slogan.main = toMainslogan != null ? toMainslogan : slogan.$main;
    slogan.sub = toSubslogan != null ? toSubslogan : slogan.$sub;
    slogan.update();
    // 啊对对对，有很多种方法将变量转换为数字，我就用最麻烦的
    console.log("[" + new Date + "]\n时钟时间：" + now + "\n注入科目：" + toSubject + "\n开始时间：" + toDate, toStart + "\n结束时间：" + toDate, toEnd + "\n提前入场：" + subject.admit + " min\n" + ["默认大标语：", "指定大标语："][~!toMainslogan + 2] + slogan.main + ["\n默认副标语：", "\n指定副标语："][!!toSubslogan - -0] + slogan.sub);
  }
}
slogan.update = function () {
  this.main = this.main || this.$main;
  document.getElementById("mainslogan").innerHTML = this.main || this.$main;
  this.sub = this.sub || this.$sub;
  this.subnum < this.sub.length - 1 ? this.subnum++ : this.subnum = 0;
  document.getElementById("subslogan").innerHTML = (this.sub || this.$sub)[this.subnum];
}
timer.update = function () {
  document.getElementById("clock").innerHTML = getClock(now);
  if (now >= subject.end) {
    exam[subject.on]();
    // subject.duration = subject.duration;
    document.getElementById("subject").innerHTML = subject.name;
    document.getElementById("duration").innerHTML = subject.duration;
  }
  if (now < (subject.start - subject.admit * 6E4 - 12E5)) {
    this.num = (subject.start - subject.admit * 6E4 - now) / 36E5;
    this.num = this.num.toFixed(this.num >= 10 ? 0 : 1);
    this.sub = "h";
    this.activity = "距离入场";
    this.progress = 0;
  } else if (now < (subject.start - subject.admit * 6E4)) {
    this.num = Math.round((subject.start - now - subject.admit * 6E4) / 6E4);
    this.sub = "min";
    this.activity = "距离入场";
    this.progress = 0;
  } else if (now < subject.start) {
    this.num = Math.round((subject.start - now) / 6E4);
    this.sub = "min";
    this.activity = "距离开始";
    this.progress = (subject.start - now) / subject.admit / 600;
  } else if (now < subject.end) {
    if ((now - subject.start) / (subject.end - subject.start) < 0.5) {
      this.num = Math.round((now - subject.start) / 6E4);
      this.activity = "已经开始";
    } else {
      this.num = Math.round((subject.end - now) / 6E4);
      this.activity = "距离结束";
    }
    this.sub = "min";
    this.progress = (now - subject.start) / (subject.end - subject.start) * 100;
  } else {
    // 结束后的内容
    subject.name = this.num = this.sub = this.activity = "";
    this.progress = 100;
  }
  document.getElementById("bar").style.width = this.progress + "%";
  document.getElementById("timer").innerHTML = this.num;
  document.getElementById("timersub").innerHTML = this.sub;
  document.getElementById("activity").innerHTML = this.activity;
}
// 输入Date对象，返回友好的时间(如"8:00")
function getClock(date) { return date.getHours() + ":" + fixDigit(date.getMinutes()); }
// 以分钟为单位相对调整Date对象的时间
function fixMinutes(date, friendlyname) {
  date.setMinutes(date.getMinutes() + Number(prompt("以分钟为单位增减" + (friendlyname || getClock(date)), -5)));
  document.getElementById("duration").innerHTML = subject.duration;
}
// 在一位数前补“0”
function fixDigit(num) { num = parseInt(num); return num < 10 ? "0" + num : num; }
