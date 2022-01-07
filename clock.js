/* 
 * 时间更新
 */
// 以当前日期为基础的日常/临时科目
var type, today = new Date(),
  today = {
    date: today.getFullYear() + "-" + fixDigit(today.getMonth() + 1) + "-" + fixDigit(today.getDate()),
    week: parseInt((today - new Date("2021-08-22")) / 6048E5),
    day: today.getDay(),
    weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][today.getDay()]
  },
  // 各个对象内置功能
  subject = {
    duration: function () {
      if (now > this.end) return "";
      else return getClock(this.start) + "~" + getClock(this.end);
    }
  },
  slogan = {
    update: function () {
      this.main = this.main || this.$main;
      this.sub = this.sub || this.$sub;
      this.subnum < this.sub.length - 1 ? this.subnum++ : this.subnum = 0;
      output("mainslogan", this.main || this.$main);
      output("subslogan", (this.sub || this.$sub)[this.subnum]);
    }
  },
  timer = {
    update: function () {
      if (now >= subject.end) { subject.update(); }
      if (now < (subject.start - 6E5) && type.match("日常")) {
        this.num = (subject.start - now) / 36E5;
        this.num = this.num.toFixed(this.num >= 10 ? 0 : 1);
        this.sub = " h";
        this.activity = "距离开始";
        this.progress = 0;
      } else if (now < subject.start && type.match("检|模")) {
        if (now < (subject.start - 3E6)) {
          this.num = (subject.start - now - 24E5) / 36E5;
          this.num = this.num.toFixed(this.num >= 10 ? 0 : 1);
          this.sub = " h";
          this.activity = "考试加油";
          this.progress = 0;
        } else if (now < (subject.start - 24E5)) {
          this.num = Math.round((subject.start - now - 24E5) / 6E4);
          this.sub = "min";
          this.activity = "距离入场";
          this.progress = (subject.start - now - 24E5) / 6E3;
        } else if (now < subject.start) {
          this.num = Math.round((subject.start - now) / 6E4);
          this.sub = "min";
          this.activity = "距离开始";
          this.progress = (subject.start - now) / 24E3;
        }
      } else if (now < (subject.start - 18E5)) {
        this.num = (subject.start - now - 12E5) / 36E5;
        this.num = this.num.toFixed(this.num >= 10 ? 0 : 1);
        this.sub = " h";
        this.activity = "考试加油";
        this.progress = 0;
      } else if (now < (subject.start - 12E5)) {
        this.num = Math.round((subject.start - now - 12E5) / 6E4);
        this.sub = "min";
        this.activity = "距离入场";
        this.progress = (subject.start - now - 12E5) / 6E3;
      } else if (now < (subject.start - 6E5)) {
        this.num = Math.round((now - subject.start + 12E5) / 6E4);
        this.sub = "/ 10 min";
        this.activity = "入场扫描";
        this.progress = (now - subject.start + 12E5) / 6E3;
      } else if (now < subject.start) {
        this.num = Math.round((subject.start - now) / 6E4);
        this.sub = "min";
        this.activity = "距离开始";
        this.progress = (subject.start - now) / 6E3;
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
        subject.update = function () { };
        subject.name = this.num = this.sub = this.activity = "";
        this.progress = 100;
      }
      document.getElementById("bar").style.width = this.progress + "%";
      output("subject", subject.name);
      output("duration", subject.duration());
      output("timer", this.num);
      output("timersub", this.sub);
      output("activity", this.activity);
    }
  };
// 先根据地址参数判断考试类型
if (location.search.match("totype30")) change("高三日常");
else if (location.search.match("totype31")) change("高三理科");
else if (location.search.match("totype32")) change("高三文科");
else if (location.search.match("totype21")) change("高二理科");
else if (location.search.match("totype22")) change("高二文科");
// 再在考试日期切换到考试类型
// else if (todate == "2022-01-02") change("1.2临时");
else if (today.date.match("2022-01-08|9")) change("高三一检");
// else if (todate.match("2022-01-15|6")) change("高二理科");
// 最后设置缺省考试类型
else change("高三日常");
// 若不再包一层，slogan.update内的this就会指向window
setInterval(function () { slogan.update(); }, 2000);
// 注入当前科目
function $(toSubject, toDate, toStart, toEnd, toMainslogan, toSubslogan) {
  if (now < subject.end) console.log("当前科目未结束，故不注入科目: " + toSubject);
  else if (now >= new Date(toDate + "T" + toEnd + "+08:00"))
    console.log("请求科目已结束，故不注入科目: " + toSubject);
  else {
    subject.name = toSubject;
    subject.start = new Date(toDate + "T" + toStart + "+08:00");
    subject.end = new Date(toDate + "T" + toEnd + "+08:00");
    slogan.main = toMainslogan || slogan.$main;
    slogan.sub = toSubslogan || slogan.$sub;
    // 啊对对对，有很多种方法将变量转换为数字，我就用最麻烦的
    console.log(getClock(now) + "时成功注入科目: " + toSubject + "\n开始时间: " + toDate, toStart + "\n结束时间: " + toDate, toEnd + ["\n默认大标语: ", "\n指定大标语: "][~!toMainslogan + 2] + slogan.main + ["\n默认副标语: ", "\n指定副标语: "][!!toSubslogan - -0] + slogan.sub);
  }
}
// 正常或调试模式
if (!location.search.match("debug")) {
  var now = new Date();
  output("clock", getClock(now));
  timer.update();
  setInterval(function () {
    now = new Date();
    // 设置相对时差
    // now.setSeconds(now.getSeconds() + 30);
    output("clock", getClock(now));
    timer.update();
  }, 2000);
} else {
  send("已进入调试模式，关闭本页面可返回正常模式。");
  document.getElementById("bar").style.transition = "none";
  var now = new Date("2021-04");
  setInterval(function () {
    // 调试模式起始时间
    if (now < subject.start - 72E5) now = new Date(subject.start - 72E5);
    // 调试模式截止时间
    // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
    if (now > subject.end - -36E5) { change(type); now = new Date("2021-04"); }
    // 调试模式速度设置
    now.setSeconds(now.getSeconds() + 30);
    output("clock", getClock(now));
    timer.update();
  }, 50);
}
