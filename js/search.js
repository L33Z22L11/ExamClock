try {
  var SP = Object.fromEntries(new URLSearchParams(location.search).entries());
}
catch (e) { var SP = {}; }
var TOS = isNaN(SP.tos) ? 0 : +SP.tos;
// 篡改与浏览器检测
!function verify() {
  try {
    function ifwarn(condition, warn) {
      if (condition) {
        document.getElementById("verify").style.display = "block";
        document.getElementById("verifycontent").innerHTML = warn;
      }
    }
    ifwarn(navigator.userAgent.match("Trident"), "IE浏览器过于老旧，不保证功能的可用性。我们推荐使用Chrome/Edge/Firefox浏览器。");
    ifwarn(location.host != "exam.thisis.host", "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host'>点击访问考试时钟在线官网 exam.thisis.host</a></u>");
    ifwarn(document.referrer == "https://exam.cooo.site", "检测到跳转自旧网址，请勿依赖此方式访问考试时钟。<br>建议收藏本页或在考试时钟菜单内下载快捷方式。");
    ifwarn(SP.debug, "您目前处于科目检查(调试)模式。<u><a href='?'>点击返回正常模式</a></u>");
  }
  catch (e) {
    alert("检测到非法篡改，请将此代码发送给QQ 2399052066:\n" + e);
    if (confirm("是否访问在线考试时钟官网 exam.thisis.host ?")) location.href = "https://exam.thisis.host";
  }
  setTimeout(verify, 2000);
}();

// 先根据地址参数判断考试类型
// if (SP.type in exam) subject.to(SP.type);
// 2023毕业特别企划（之前写的代码只能从回忆中读懂一点了）
if (today.date == "2023-06-04") {
  document.getElementById("type").innerHTML = "要毕业了";
  subject.name = "高中";
  subject.duration = "2020~2023";
  slogan.$main = "留好照片 因为我们就要出发";
  slogan.$sub = [
    "1025天前，2020年8月13日，我拿到了录取通知书。",
    "1016天前，2020年8月22日晚，我们坐在教室开了第一节班会。",
    "1015天前，2020年8月23日中午，中午买饭的队伍好长，午睡醒来路上是兴奋的我们。",
    "1014天前，2020年8月24日晚，在操场做队列训练。",
    "969天前，2020年10月8日晚，学校80周年校庆真气派。",
    "927天前，2020年11月29日，高二去春游了，羡慕。",
    "614天前，2021年9月28日，运动会开幕式的《让我们荡起双桨》好有活力。",
    "613天前，2021年9月29日晚，我要艺术节汉服社小哥哥的联系方式！",
    "529天前，2021年12月22日，校门口人行横道被封了，难过。",
    "451天前，2022年3月10日下午，我们和高一紧急离校上网课了。",
    "365天前，2022年6月4日，高三走了，他们奔向了自己的前程。",
    "247天前，2022年9月30日晚，DJ版校歌！",
    "130天前，2023年1月25日晚，谁晚自习对着教学楼放烟花啊，可恶。",
    "118天前，2023年2月6日晚，学校有元宵节烟花晚会欸！",
    "96天前，2023年2月28日，成人礼！百日誓师！勇敢宝中人不怕困难！",
    "43天前，2023年4月22日，三模了，我们之间话好像越来越少了。",
    "3天前，2023年6月1日，高中生也要过六一！",
    "1天前，2023年6月3日，做完了关门卷，今晚好像睡不着了。",
    "今天是2023年6月3日，我们也即将要离开了。",
    "我和宝中的故事，未完待续。",
  ]
}
// 再在考试日期切换到考试类型
else if (today.date in exam) subject.to(today.date);
else if (today.date.match("2023-01-1(6|7)")) subject.to(231);
// 最后设置缺省考试类型
else subject.to(23);
// 若不再包一层，slogan.update内的this就会指向window
setInterval(function () { slogan.update(); }, 3000);

// 正常或调试模式
if (SP.debug) {
  now = new Date(0);
  document.getElementById("bar").style.transition = "none";
  !function update() {
    // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
    // 注：加一个正号也能转换为数字。
    // 跳转到科目开始前一小时
    if (now < subject.start - 36E5) now = new Date(subject.start - 36E5);
    // 最后一场科目结束后重置时间
    if (now > subject.end + +36E5) subject.to(subject.on);
    // 调试模式速度设置
    now.setSeconds(now.getSeconds() + 30);
    timer.update();
    setTimeout(update, 25);
  }();
} else !function update() {
  now = new Date;
  // 设置相对时差
  now.setSeconds(now.getSeconds() + TOS);
  timer.update();
  setTimeout(update, 2000);
}();

// 黑白滤镜
if (today.date.match("-12-06|-12-13")) {
  document.documentElement.style.filter = "grayscale(1)";
  document.getElementById("filterSwitch").style.display = "";
}
