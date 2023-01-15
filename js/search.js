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
    ifwarn(navigator.userAgent.match(" Trident| QQBrowser"), "IE/QQ浏览器功能老旧，我们推荐使用Chrome/Edge/Firefox浏览器。");
    ifwarn(!location.host.match("exam.thisis.host"), "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host'>点击访问考试时钟在线官网 exam.thisis.host</a></u>");
    ifwarn(location.host.match("exam.cooo.site"), "我们于近日解决了野生技协免费网站服务的域名保护冲突，考试时钟的网址已经恢复为<u><a href='https://exam.thisis.host'>exam.thisis.host(点击访问)</a></u>");
    ifwarn(SP.debug, "您目前处于科目检查(调试)模式。<u><a href='https://exam.thisis.host '>点击返回正常模式</a></u>");
  }
  catch (e) {
    alert("检测到非法篡改，请将此代码发送给QQ 2399052066:\n" + e);
    if (confirm("是否访问在线考试时钟官网 exam.thisis.host ?")) location.href = "https://exam.thisis.host";
  }
  setTimeout(verify, 2000);
}();
// 正常或调试模式
if (SP.debug) {
  now = new Date(0);
  document.getElementById("bar").style.transition = "none";
  !function update() {
    // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
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
// 先根据地址参数判断考试类型
if (SP.type in exam) subject.to(SP.type);
// 再在考试日期切换到考试类型
else if (today.date in exam) subject.to(today.date);
else if (today.date.match("2023-01-1(6|7)")) subject.to(231);
// 最后设置缺省考试类型
else subject.to(23);
// 若不再包一层，slogan.update内的this就会指向window
setInterval(function () { slogan.update(); }, 2000);

// 黑白滤镜
if (today.date.match("-12-06|-12-13")) {
  document.documentElement.style.filter = "grayscale(1)";
  document.getElementById("filterSwitch").style.display = "";
}
