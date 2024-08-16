// 此处代码需要兼容IE浏览器，以保证报错正常显示
try {
  var SP = Object.fromEntries(new URLSearchParams(location.search).entries());
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
    ifwarn(navigator.userAgent.match("Trident"), "IE浏览器过于老旧，不保证功能的可用性。我们推荐使用Chrome/Edge/Firefox浏览器。");
    // ifwarn(location.host != "exam.thisis.host", "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host'>点击访问考试时钟在线官网 exam.thisis.host</a></u>");
    // ifwarn(SP.fromold, "检测到跳转自旧网址，请勿依赖此方式访问考试时钟。建议收藏本页或在考试时钟菜单内下载快捷方式。");
    ifwarn(SP.debug, "您目前处于" + SP.debug + "倍时间流速的科目检查(调试)模式。<u><a href='?'>点击返回正常模式</a></u>");
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
    // 移除动画
    try { document.getElementById("coverLaunch").remove(); } catch (err) { }
    // 跳转到科目开始前一小时
    if (now < subject.start - 36E5) now = new Date(subject.start - 36E5);
    // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
    // 注：加一个正号也能转换为数字。
    // 注：注：正号加错位置了！
    // 最后一场科目结束后重置时间
    if (now > +subject.end + 36E5) subject.switch(subject.current);
    // 调试模式速度设置
    now.setSeconds(now.getSeconds() + SP.debug * .025);
    timer.update();
    setTimeout(update, 25);
  }();
} else !function update() {
  now = new Date;
  // 设置相对时差
  if (!isNaN(SP.tos)) now.setSeconds(now.getSeconds() + +SP.tos);
  timer.update();
  setTimeout(update, 2000);
}();

// 先根据地址参数判断考试类型
if (SP.type in exams) subject.switch(SP.type);
// 再在考试日期切换到考试类型
else if (today.date in exams) subject.switch(today.date);
else if (today.date.match("2023-01-1(6|7)")) subject.switch(231);
// 最后设置缺省考试类型
else subject.switch(25);
// 若不再包一层，slogan.update内的this就会指向window
setInterval(function () { slogan.update(); }, 3000);

// 黑白滤镜
if (today.date.match("-12-06|-12-13")) {
  document.documentElement.style.filter = "grayscale(1)";
  document.getElementById("filterSwitch").style.display = "";
}
