console.groupCollapsed("\n%c  %c考试时钟 ExamClock", "background:url('https://exam.cooo.site/logo_g_64.png') no-repeat;padding:32px;", "font:bold 36px sans-serif;color:#3a9;");
console.log("\n考试时钟“填补了业余与专业之间的空白”。\n项目仓库：https://github.com/L33Z22L11/ExamClock\n野生技协群：894656456\n\n");
console.groupEnd();
/* 
 * 适用于宝鸡中学的考试科目列表
 */
today.entry22 = parseInt((today - new Date(2019, 7, 18)) / 864E5);
today.total22 = parseInt((new Date(2022, 6, 7) - new Date(2019, 7, 18)) / 864E5);
today.correct1 = "第" + today.week + "周周日：第" + (today.week % 3 || 3) + "/3轮" + today.weekday + ["英语?", "语文", "数学?",][today.week % 3] + "自主整理纠错";
today.correct2 = "第" + today.week + "周周日：第" + (today.week % 3 || 3) + "/3轮" + today.weekday + ["化学?/历史?", "物理/地理", "生物?/政治?",][today.week % 3] + "自主整理纠错";
today.refine = "第" + today.week + ["周：双周", "周：单周"][today.week % 2] + today.weekday + ([["英语", "语文", "物理/地理", "数学", "生物/政治", "化学/历史",], ["数学", "英语", "物理/地理", "化学/政治", "语文", "生物/历史",]][today.week % 2][today.day] || "无") + "小题精练";
today.practice = "高三第二学期第" + (today.day < 4 ? today.week * 2 - 20 : today.week * 2 - 19) + "次模拟考练：请在答题卡上写清组别。";
exam[-"2022-05-11"] = function () {
  slogan.$main = "";
  $("晨读1", today.date, "06:55", "07:25");
  $("晨会", today.date, "07:25", "07:30");
  $("晨读2", today.date, "07:30", "08:00");
  $("第1节", today.date, "08:10", "08:55");
  $("综合", today.date, "09:15", "11:45", 0, [today.practice], 15);
  $("第2节", today.date, "14:25", "15:10");
  $("英语", today.date, "15:30", "17:30", 0, [today.practice], 15);
  $("晚训", today.date, "18:40", "19:00", 0, [today.refine], 5);
  $("晚写", today.date, "19:05", "19:15", 0, 0, 5);
  $("晚一", today.date, "19:15", "20:00");
  $("晚二", today.date, "20:10", "20:55");
  $("晚三", today.date, "21:10", "22:20", 0, 0, 7);
  $("晚修", today.date, "22:30", "23:30");
  return "本日临时";
};
exam[-30] = function () {
  slogan.$main = today.cee + "天 奋勇争先";
  subject.$admit = 2;
  // 这种情况就比较复杂了，代码和人有一个能跑就行
  // 特别注意，最后一轮求余后应该是数组第0项
  if (today.day) {
    // 非周日的白天
    if (today.day == 5) $("听力", today.date, "07:05", "07:25");
    $("晨读1", today.date, "06:55", "07:25");
    $("晨会", today.date, "07:25", "07:30");
    $("晨读2", today.date, "07:30", "08:00");
    $("第1节", today.date, "08:10", "08:55");
    $("第2节", today.date, "09:05", "09:50");
    $("课间操", today.date, "09:50", "10:00", "<a href='http://player.bilibili.com/player.html?aid=971208498'><i class='fa-regular fa-circle-play'></i> 点击播放宝中室内健身操</a>");
    $("第3节", today.date, "10:20", "11:05");
    $("第4节", today.date, "11:15", "12:00");
    $("午休", today.date, "12:15", "13:55");
    $("第5节", today.date, "14:10", "14:55");
    $("第6节", today.date, "15:05", "15:50");
    // if (today.day != 6) {};
    $("第7节", today.date, "16:05", "16:50");
    $("自习", today.date, "17:00", "17:45");
  } else {
    // 周日白天
    $("纠错", today.date, "14:10", "17:30", 0, ["第" + today.week + "周" + today.weekday + "自主整理纠错"]);
  }
  if (today.day != 6) {
    // 非周六的晚上
    $("晚训", today.date, "18:25", "18:45", 0, ["第" + today.week + ["周：双周", "周：单周"][today.week % 2] + today.weekday + ([["英语", "语文", "物理/地理", "数学", "生物/政治", "化学/历史",], ["数学", "英语", "物理/地理", "化学/政治", "语文", "生物/历史",]][today.week % 2][today.day] || "无") + "小题精练"], 5);
    $("晚写", today.date, "18:45", "18:55");
    $("晚一", today.date, "18:55", "19:40");
    $("晚二", today.date, "19:50", "20:35");
    $("晚三", today.date, "20:50", "22:00");
    $("晚修", today.date, "22:10", "23:30");
  }
  // return "高三日常";
  return "<span data-sub='可切换到三轮模考'>高三日常</span>";
};
exam[-31] = function () {
  slogan.$sub = ["高三第二学期第三次模拟考练：请在答题卡上写清组别。"];
  $("英语", "2022-04-28", "07:40", "09:40");
  $("数学", "2022-04-28", "10:00", "12:00");
  $("语文", "2022-04-28", "14:15", "16:45");
  $("自习", "2022-04-28", "17:00", "17:45");
  $("综合", "2022-04-28", "18:30", "21:00");
  $("自习", "2022-04-28", "21:15", "22:00");
  return "高三三轮";
};
exam[30] = function () {
  slogan.$main = today.cee22 + "天后 峰顶相会";
  subject.$admit = 2;
  // 这种情况就比较复杂了，代码和人有一个能跑就行
  // 特别注意，最后一轮求余后应该是数组第0项
  if (!today.day) {
    // 周日白天
    $("纠错", today.date, "14:25", "15:55", 0, [today.correct1]);
    $("纠错", today.date, "16:15", "17:45", 0, [today.correct2]);
  }
  // 非周日的白天
  if (today.day == 5) $("听力", today.date, "07:05", "07:25");
  $("晨读1", today.date, "06:55", "07:25");
  $("晨会", today.date, "07:25", "07:30");
  if (today.day != 6) {
    $("晨读2", today.date, "07:30", "08:00");
    $("第1节", today.date, "08:10", "08:55");
  }
  if (today.day % 3 == 1) {
    $("语文", today.date, "09:15", "11:45", 0, [today.practice], 15);
    $("第2节", today.date, "14:25", "15:10");
    $("数学", today.date, "15:30", "17:30", 0, [today.practice], 15);
    $("自习", today.date, "17:30", "18:00");
  } else if (today.day % 3 == 2) {
    $("综合", today.date, "09:15", "11:45", 0, [today.practice], 15);
    $("第2节", today.date, "14:25", "15:10");
    $("英语", today.date, "15:30", "17:30", 0, [today.practice], 15);
  } else if (today.day == 3) {
    $("第2节", today.date, "09:05", "09:50");
    $("第3节", today.date, "10:20", "11:05");
    $("第4节", today.date, "11:15", "12:00");
    $("第5节", today.date, "14:25", "15:10");
    $("第6节", today.date, "15:20", "16:05");
    $("第7节", today.date, "16:20", "17:05", 0, 0, 7);
    $("自习", today.date, "17:15", "18:00");
  } else if (today.day == 6) {
    $("第1节", today.date, "07:30", "08:15");
    $("第2节", today.date, "08:25", "09:10");
    $("第3节", today.date, "09:20", "10:05");
    $("第4节", today.date, "10:20", "11:05");
    $("第5节", today.date, "11:15", "12:00");
    $("第6节", today.date, "14:25", "15:10");
    $("第7节", today.date, "15:20", "16:05");
    $("第8节", today.date, "16:20", "17:05", 0, 0, 7);
    $("第9节", today.date, "17:15", "18:00");
  }
  if (today.day != 6) {
    // 非周六的晚上
    $("晚训", today.date, "18:40", "19:00", 0, [today.refine], 5);
    $("晚写", today.date, "19:05", "19:15", 0, 0, 5);
    $("晚一", today.date, "19:15", "20:00");
    $("晚二", today.date, "20:10", "20:55");
    $("晚三", today.date, "21:10", "22:20", 0, 0, 7);
    $("晚修", today.date, "22:30", "23:30");
  }
  return "高三日常";
};
exam[20] = function () {
  slogan.$main = "距离高考" + today.cee23 + "天";
  subject.$admit = 2;
  $("晨读1", today.date, "07:05", "07:25");
  $("晨会", today.date, "07:25", "07:30");
  $("晨读2", today.date, "07:30", "08:00");
  $("第1节", today.date, "08:10", "08:55");
  $("第2节", today.date, "09:05", "09:50");
  $("第3节", today.date, "10:20", "11:05");
  $("第4节", today.date, "11:15", "12:00");
  $("第5节", today.date, "14:25", "15:10");
  $("第6节", today.date, "15:20", "16:05");
  $("第7节", today.date, "16:20", "17:05", 0, 0, 7);
  $("自习", today.date, "17:15", "18:00");
  $("晚饭", today.date, "18:00", "18:25");
  // $("背诵", today.date, "18:25", "18:55", 0, 0, 5);
  $("晚训", today.date, "18:40", "19:00", 0, ["第" + today.week + ["周：双周", "周：单周"][today.week % 2] + today.weekday + (today.day % 2 ? "英语听力" : "语文视频")], 5);
  $("晚写", today.date, "19:05", "19:15", 0, 0, 5);
  $("晚一", today.date, "19:15", "20:00");
  $("晚二", today.date, "20:10", "20:55");
  $("晚三", today.date, "21:10", "22:20", 0, 0, 7);
  $("晚修", today.date, "22:20", "23:20");
  return "高二日常";
}
exam[21] = function () {
  slogan.$sub = ["高二第二学期期中考试(理科)：请以实际铃声为准。"];
  subject.$admit = 20;
  $("语文", "2022-05-03", "09:30", "12:00");
  $("物理", "2022-05-03", "14:20", "16:00");
  $("生物", "2022-05-03", "16:30", "18:10");
  $("英语", "2022-05-04", "07:50", "09:50");
  $("化学", "2022-05-04", "10:20", "12:00");
  $("数学", "2022-05-04", "14:20", "16:20");
  return "高二理科";
};
exam[22] = function () {
  slogan.$sub = ["高二第二学期期中考试(文科)：请以实际铃声为准。"];
  subject.$admit = 20;
  $("语文", "2022-05-03", "09:30", "12:00");
  $("政治", "2022-05-03", "14:20", "16:00");
  $("地理", "2022-05-03", "16:30", "18:10");
  $("英语", "2022-05-04", "07:50", "09:50");
  $("历史", "2022-05-04", "10:20", "12:00");
  $("数学", "2022-05-04", "14:20", "16:20");
  return "高二文科";
};
exam[11] = function () {
  slogan.$main = "未启用 仅供测试";
  slogan.$sub = ["高一期末暨模块结业考试：请以实际铃声为准。"];
  subject.$admit = 20;
  $("语文", "2022-01-20", "07:50", "09:50");
  $("化学", "2022-01-20", "10:20", "12:00");
  $("物理", "2022-01-20", "14:20", "16:00");
  $("生物", "2022-01-20", "16:30", "18:00");
  $("史地", "2022-01-21", "07:50", "09:50");
  $("英语", "2022-01-21", "10:20", "12:00");
  $("数学", "2022-01-21", "14:00", "15:40");
  $("政治", "2022-01-21", "16:10", "17:10");
  return "高一";
};
