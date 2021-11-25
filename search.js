console.log("%c\n加入Techaos! 混技\nQQ群: 169994096\n", "font:bold 3em Roboto,sans-serif;");
console.log("%c\n野生技协(混技分部)\nQQ群: 894656456\n", "font:bold 3em Roboto,sans-serif;");
search = location.search;
setInterval(function () {
    try { !location.host.match("exam.thisis.host") ? document.getElementById("verify").style.display = "flex" : null; }
    catch (e) { alert("检测到意外修改内容的考试时钟！\n" + e); location.href = "https://exam.thisis.host"; }
}(), 2000);
// 根据地址参数切换考试类型
if (search.match("totype31")) { change("高三理科"); }
if (search.match("totype32")) { change("高三文科"); }
if (search.match("totype21")) { change("高二理科"); }
if (search.match("totype22")) { change("高二文科"); }
// 调试模式
if (search.match("debug")) {
    send("已进入调试模式，关闭本页面可返回正常模式。");
    now = new Date("2021-04-01");
    document.getElementById("bar").style.transition = "none";
    // updateExam();
    updateTime = function () {
        // 调试模式起始时间
        now < start - 36E5 ? now = new Date(start - 36E5) : null;
        // 调试模式截止时间
        // “用加号会直接连接字符串，所以这里得减去负数，太魔幻了”
        if (now > end - -36E5) { change(type); now = new Date("2021-04-01"); }
        // 调试模式速度设置
        now.setSeconds(now.getSeconds() + 10);
        // now.setMinutes(now.getMinutes() + 5);
        output("clock", getClock(now));
        updateExam();
    };
    setInterval(updateTime, 20);
}
