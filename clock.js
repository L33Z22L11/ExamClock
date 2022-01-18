/* 
 * 时间更新
 */
// 以当前日期为基础的日常/临时科目
var type, today = new Date(),
  eleType = document.getElementById("type"),
  eleCard = document.getElementsByClassName("card")[0],
  eleMainslogan = document.getElementById("mainslogan"),
  eleSubslogan = document.getElementById("subslogan"),
  eleSubject = document.getElementById("subject"),
  eleDuration = document.getElementById("duration"),
  eleClock = document.getElementById("clock"),
  eleTimer = document.getElementById("timer"),
  eleTimersub = document.getElementById("timersub"),
  eleActivity = document.getElementById("activity"),
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
      eleMainslogan.innerHTML = this.main || this.$main;
      eleSubslogan.innerHTML = (this.sub || this.$sub)[this.subnum];
    }
  },
  timer = {
    update: function () {
      eleClock.innerHTML = getClock(now);
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
      eleSubject.innerHTML = subject.name;
      eleDuration.innerHTML = subject.duration();
      eleTimer.innerHTML = this.num;
      eleTimersub.innerHTML = this.sub;
      eleActivity.innerHTML = this.activity;
    }
  };
// 注入当前科目
function $(toSubject, toDate, toStart, toEnd, toMainslogan, toSubslogan) {
  if (now < subject.end) {
    // console.log("当前科目未结束，故不注入科目: " + toSubject);
  } else if (now >= new Date(toDate + "T" + toEnd + "+08:00")) {
    // console.log("请求科目已结束，故不注入科目: " + toSubject);
  } else {
    subject.name = toSubject;
    subject.start = new Date(toDate + "T" + toStart + "+08:00");
    subject.end = new Date(toDate + "T" + toEnd + "+08:00");
    slogan.main = toMainslogan || slogan.$main;
    slogan.sub = toSubslogan || slogan.$sub;
    // 啊对对对，有很多种方法将变量转换为数字，我就用最麻烦的
    console.log(getClock(now) + "时成功注入科目: " + toSubject + "\n开始时间: " + toDate, toStart + "\n结束时间: " + toDate, toEnd + ["\n默认大标语: ", "\n指定大标语: "][~!toMainslogan + 2] + slogan.main + ["\n默认副标语: ", "\n指定副标语: "][!!toSubslogan - -0] + slogan.sub);
  }
}
// 输入Date对象，返回友好的时间(如"8:00")
function getClock(date) { return date.getHours() + ":" + fixDigit(date.getMinutes()); }
// 以分钟为单位相对调整Date对象的时间
function fixMinutes(date, friendlyname) {
  date.setMinutes(date.getMinutes() + Number(prompt("以分钟为单位增减" + (friendlyname || getClock(date)), -5)));
}
