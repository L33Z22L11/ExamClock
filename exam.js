console.groupCollapsed("\n%c  %c考试时钟 ExamClock", "background:url('https://exam.cooo.site/logo_g_64.png') no-repeat;padding:32px;", "font:bold 36px sans-serif;color:#3a9;");
console.log("\n项目仓库：https://github.com/L33Z22L11/ExamClock\n野生技协群：894656456\n\n");
console.groupEnd();
/* 
 * 适用于宝鸡中学的考试科目列表
 */
today.gone22 = parseInt((Date.now() - new Date(2022, 5, 9)) / 864E5);
today.cee23 = parseInt((new Date(2023, 5, 8) - Date.now()) / 864E5);
today.correct1 = "第" + today.week + "周：第" + (today.week % 3 || 3) + "/3轮" + today.weekday + ["数学", "语文", "物理/地理",][today.week % 3] + "自主整理纠错";
today.correct2 = "第" + today.week + "周：第" + (today.week % 3 || 3) + "/3轮" + today.weekday + ["英语", "生物/政治", "化学/历史",][today.week % 3] + "自主整理纠错";
today.refine = "第" + today.week + ["周：双周", "周：单周"][today.week % 2] + today.weekday + ([["英语", "语文", "物理/地理", "数学", "生物/政治", "化学/历史",], ["数学", "英语", "物理/地理", "化学/政治", "语文", "生物/历史",]][today.week % 2][today.day] || "无") + "小题精练";
today.practice = "高三第二学期第" + (today.day < 4 ? today.week * 2 - 21 : today.week * 2 - 20) + "次模拟考练：请在答题卡上写清组别A/B/C/AB/AC/BC/ABC/D。";
exam["2022-05-14"] = function () {
  slogan.$main = today.cee22 + "天后 峰顶相会";
  // $("晨读1", today.date, "06:55", "07:25");
  // $("晨会", today.date, "07:25", "07:30");
  // $("晨读2", today.date, "07:30", "08:00");
  // $("第1节", today.date, "08:10", "08:55");
  // $("第2节", today.date, "09:05", "09:50");
  // $("室内操", today.date, "09:50", "10:05", "<a href='https://mp.weixin.qq.com/s/61Voi3s4tFtAup2-eOg1Lg'><i class='fa-regular fa-circle-play'></i> 点击播放高清室内操", ["《鳌拜鳌拜鳌拜拜》(原曲《Batte Forte》)《夜空中最亮的星》《虫儿飞》"]);
  // $("第3节", today.date, "10:20", "11:05");
  // $("第4节", today.date, "11:15", "12:00");
  // $("第5节", today.date, "14:25", "15:10");
  // $("第6节", today.date, "15:20", "16:05");
  // $("第7节", today.date, "16:20", "17:05", null, null, 7);
  // $("自习", today.date, "17:15", "18:00");
  $("纠错", today.date, "16:15", "17:45", null, ["第13周周日自主整理纠错"]);
  $("晚训", today.date, "18:40", "19:00", null, ["第13周：单周周五生物/历史小题精练"], 5);
  $("晚写", today.date, "19:05", "19:15", null, null, 5);
  $("晚一", today.date, "19:15", "20:00");
  $("晚二", today.date, "20:10", "20:55");
  $("晚三", today.date, "21:10", "22:20", null, null, 7);
  $("晚修", today.date, "22:30", "23:30");
  return today.date + "临时";
};
exam[30] = function () {
  slogan.$main = "出舱" + today.gone22 + "天 感觉良好";
  return "高三走了。";
  subject.$admit = 2;
  // 这种情况就比较复杂了，代码和人有一个能跑就行
  // 特别注意，最后一轮求余后应该是数组第0项
  if (!today.day) {
    // 周日白天
    $("纠错", today.date, "14:25", "15:55", null, [today.correct1]);
    $("纠错", today.date, "16:15", "17:45", null, [today.correct2]);
  }
  // 非周日的白天
  if (today.day == 5) $("听力", today.date, "07:05", "07:25");
  $("晨读1", today.date, "06:55", "07:25");
  $("晨会", today.date, "07:25", "07:30");
  if (today.date == "2022-06-02") {
    $("语文", today.date, "09:00", "11:30", "沉着冷静&emsp;诚信考试", ["高三第二学期关门考试：考试时钟仅供参考，请以广播通知为准。"], 20);
    $("数学", today.date, "15:00", "17:00", "沉着冷静&emsp;诚信考试", ["高三第二学期关门考试：考试时钟仅供参考，请以广播通知为准。"], 20);
  }
  if (today.date == "2022-06-03") {
    $("综合", today.date, "09:00", "11:30", "沉着冷静&emsp;诚信考试", ["高三第二学期关门考试：考试时钟仅供参考，请以广播通知为准。"], 20);
    $("英语", today.date, "15:00", "17:00", "沉着冷静&emsp;诚信考试", ["高三第二学期关门考试：考试时钟仅供参考，请以广播通知为准。"], 20);
  }
  if (today.day != 6) {
    $("晨读2", today.date, "07:30", "08:00");
    $("第1节", today.date, "08:10", "08:55");
  }
  if (today.day == 6) {
    $("第1节", today.date, "07:30", "08:15");
    $("第2节", today.date, "08:25", "09:10");
    $("第3节", today.date, "09:20", "10:05");
    $("第4节", today.date, "10:20", "11:05");
    $("第5节", today.date, "11:15", "12:00");
    $("第6节", today.date, "14:25", "15:10");
    $("第7节", today.date, "15:20", "16:05");
    $("第8节", today.date, "16:20", "17:05", null, null, 7);
    $("第9节", today.date, "17:15", "18:00");
  } else {
    $("第2节", today.date, "09:05", "09:50");
    $("室内操", today.date, "09:50", "10:05", "<a href='https://mp.weixin.qq.com/s/61Voi3s4tFtAup2-eOg1Lg'><i class='fa-regular fa-circle-play'></i> 点击播放高清室内操", ["《鳌拜鳌拜鳌拜拜》(原曲《Batte Forte》)《夜空中最亮的星》《虫儿飞》"]);
    $("第3节", today.date, "10:20", "11:05");
    $("第4节", today.date, "11:15", "12:00");
    $("第5节", today.date, "14:25", "15:10");
    $("第6节", today.date, "15:20", "16:05");
    $("第7节", today.date, "16:20", "17:05", null, null, 7);
    $("自习", today.date, "17:15", "18:00");
  }
  if (today.day != 6) {
    // 非周六的晚上
    // $("晚训", today.date, "18:40", "19:00", null, [today.refine], 5);
    // $("晚写", today.date, "19:05", "19:15", null, null, 5);
    $("听力", today.date, "18:55", "19:15");
    $("晚一", today.date, "19:15", "20:00");
    $("晚二", today.date, "20:10", "20:55");
    $("晚三", today.date, "21:10", "22:20");
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
  $("课间操", today.date, "09:50", "10:05", "<a href='https://mp.weixin.qq.com/s/61Voi3s4tFtAup2-eOg1Lg'><i class='fa-regular fa-circle-play'></i> 点击播放高清室内操", ["《鳌拜鳌拜鳌拜拜》(原曲《Batte Forte》)《夜空中最亮的星》《虫儿飞》"]);
  $("第3节", today.date, "10:20", "11:05");
  $("第4节", today.date, "11:15", "12:00");
  $("第5节", today.date, "14:25", "15:10");
  $("第6节", today.date, "15:20", "16:05");
  $("第7节", today.date, "16:20", "17:05", null, null, 7);
  $("自习", today.date, "17:15", "18:00");
  $("晚饭", today.date, "18:00", "18:25");
  // $("背诵", today.date, "18:25", "18:55", null, null, 5);
  $("晚训", today.date, "18:40", "19:00", null, ["第" + today.week + ["周：双周", "周：单周"][today.week % 2] + today.weekday + (today.day % 2 ? "英语听力" : "语文视频")], 5);
  $("晚写", today.date, "19:05", "19:15", null, null, 5);
  $("晚一", today.date, "19:15", "20:00");
  $("晚二", today.date, "20:10", "20:55");
  $("晚三", today.date, "21:10", "22:20", null, null, 7);
  $("晚修", today.date, "22:20", "23:20");
  return "高二日常";
}
exam[21] = function () {
  slogan.$sub = ["高二第二学期阶段二考试(理科)：请以实际铃声为准。"];
  subject.$admit = 20;
  $("英语", "2022-06-01", "14:20", "16:20");
  $("化学", "2022-06-01", "16:50", "18:20");
  $("语文", "2022-06-02", "07:40", "10:10");
  $("物理", "2022-06-02", "10:40", "12:10");
  $("数学", "2022-06-02", "14:20", "16:20");
  $("生物", "2022-06-02", "16:50", "18:20");
  return "高二理科";
};
exam[22] = function () {
  slogan.$sub = ["高二第二学期阶段二考试(文科)：请以实际铃声为准。"];
  subject.$admit = 20;
  $("英语", "2022-06-01", "14:20", "16:20");
  $("历史", "2022-06-01", "16:50", "18:20");
  $("语文", "2022-06-02", "07:40", "10:10");
  $("政治", "2022-06-02", "10:40", "12:10");
  $("数学", "2022-06-02", "14:20", "16:20");
  $("地理", "2022-06-02", "16:50", "18:20");
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
