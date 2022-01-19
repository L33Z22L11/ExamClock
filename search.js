var search = location.search,
  eleVerify = document.getElementById("verify"),
  eleVerifycontent = document.getElementById("verifycontent");
// 先根据地址参数判断考试类型
if (search.match("totype30")) change("高三日常");
else if (search.match("totype31")) change("高三理科");
else if (search.match("totype32")) change("高三文科");
else if (search.match("totype21")) change("高二理科");
else if (search.match("totype22")) change("高二文科");
// 再在考试日期切换到考试类型
// else if (today.date == "2022-01-02") change("1.2临时");
else if (today.date.match("2022-01-0(8|9)")) {console.log(today.date); change("高三一检");}
else if (today.date.match("2022-01-2(0|1)")) change("高二理科");
// 最后设置缺省考试类型
else change("高三日常");
// 若不再包一层，slogan.update内的this就会指向window
setInterval(function () { slogan.update(); }, 2000);
// 篡改与浏览器检测
setInterval(function () {
  try {
    function ifwarn(condition, warn) {
      if (condition) {
        eleVerify.style.display = "block";
        console.warn(eleVerifycontent.innerHTML = warn);
      }
    }
    ifwarn(navigator.userAgent.match(" Trident| QQBrowser"), "IE/QQ浏览器功能老旧，我们推荐使用Chrome/Edge/Firefox浏览器。");
    ifwarn(!location.host.match("exam.thisis.host|ec.vercel.app"), "您可能在使用第三方或离线的考试时钟，无法保证内容时效性。<u><a href='https://exam.thisis.host '>点击访问考试时钟在线官网 https://exam.thisis.host </a></u>");
    ifwarn(search.match("debug"), "您目前处于科目检查(调试)模式。<u><a href='https://exam.thisis.host '>点击返回正常模式</a></u>");
  }
  catch (e) {
    alert("检测到非法篡改，请将此代码发送给纸鹿:\n" + e);
    if (confirm("是否访问在线考试时钟官网https://exam.thisis.host?")) location.href = "https://exam.thisis.host";
  }
}, 2000);
// 正常或调试模式
if (!search.match("debug")) {
  var now = new Date();
  timer.update();
  setInterval(function () {
    now = new Date();
    // 设置相对时差
    // now.setSeconds(now.getSeconds() + 30);
    timer.update();
  }, 2000);
} else {
  document.getElementById("bar").style.transition = "none";
  var now = new Date("2021-04");
  setInterval(function () {
    // 用加号会直接连接字符串，所以这里得减去负数，太魔幻了
    // 跳转到科目开始前一小时
    if (now < subject.start - 36E5) now = new Date(subject.start - 36E5);
    // 最后一场科目结束后重置时间
    if (now > subject.end - -36E5) { change(type); now = new Date("2021-04"); }
    // 调试模式速度设置
    now.setSeconds(now.getSeconds() + 30);
    timer.update();
  }, 25);
}
