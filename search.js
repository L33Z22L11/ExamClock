try {
  var SP = Object.fromEntries(new URLSearchParams(location.search).entries());
  TOS = isNaN(SP.tos) ? 0 : --SP.tos;
}
catch (e) { var SP = {}; }
// 篡改与浏览器检测
!function verify() {
  try {
    function ifwarn(condition, warn) {
      if (condition) {
        document.getElementById("verify").style.display = "block";
        document.getElementById("verifycontent").innerHTML = warn;
      }
    }
    ifwarn(navigator.userAgent.match(" Trident| QQBrowser"), "IE/QQ浏览器功能老旧，我们推荐使用Chrome/Edge/Firefox浏览器。");
    ifwarn(!location.host.match("exam.thisis.host|ec.vercel.app"), "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host '>点击访问考试时钟在线官网 https://exam.thisis.host </a></u>");
    ifwarn(SP.debug, "您目前处于科目检查(调试)模式。<u><a href='https://exam.thisis.host '>点击返回正常模式</a></u>");
  }
  catch (e) {
    alert("检测到非法篡改，请将此代码发送给纸鹿:\n" + e);
    if (confirm("是否访问在线考试时钟官网https://exam.thisis.host?")) location.href = "https://exam.thisis.host";
  }
  setTimeout(verify, 2000);
}();
// 先根据地址参数判断考试类型
if (SP.type in exam) subject.to(SP.type);
// if (SP.type in Object.entries(exam)) subject.to(Object.entries(exam)[SP.type][0] );
// 再在考试日期切换到考试类型
// else if (today.date == "2022-01-02") subject.to("t1");
else if (today.date.match("2022-02-0(8|9)")) subject.to(31);
else if (today.date.match("2022-01-2(0|1)")) subject.to(21);
// 最后设置缺省考试类型
else subject.to(30);
// 若不再包一层，slogan.update内的this就会指向window
setInterval(function () { slogan.update(); }, 2000);
// 正常或调试模式
if (SP.debug) {
  document.getElementById("bar").style.transition = "none";
  !function update() {
    // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
    // 跳转到科目开始前一小时
    if (now < subject.start - 36E5) now = new Date(subject.start - 36E5);
    // 最后一场科目结束后重置时间
    if (now > subject.end - -36E5) subject.to(subject.on);
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

