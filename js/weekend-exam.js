/* 
 * 周末考练自动判断功能
 * 用于在周六和周日自动显示高三考练时间
 */

// 周末考练配置
const weekendExamConfig = {
  saturday: {
    enabled: true,
    name: "考练",
    start: "16:10",
    end: "18:00"
  },
  sunday: {
    enabled: true,
    sessions: [
      {
        name: "考练1",
        start: "14:25",
        end: "16:25"
      },
      {
        name: "考练2", 
        start: "16:35",
        end: "18:05"
      }
    ]
  }
};

// 检查是否有其他考试安排
function hasOtherExam() {
  return now < subject.end && 
         subject.name !== "" && 
         subject.name !== "考练" && 
         subject.name !== "考练1" &&
         subject.name !== "考练2" &&
         subject.name !== "⏱️";
}

// 设置周末考练
function setWeekendExam() {
  const isSaturday = today.day === 6; // 0是周日，6是周六
  const isSunday = today.day === 0;
  
  // 如果有其他考试安排，则不设置考练
  if (hasOtherExam()) {
    console.log("检测到有其他考试安排，跳过周末考练设置");
    return false;
  }
  
  // 周六考练
  if (isSaturday && weekendExamConfig.saturday.enabled) {
    const config = weekendExamConfig.saturday;
    $(config.name, today.date, config.start, config.end);
    console.log(`设置周六考练: ${config.name} ${config.start}-${config.end}`);
    return true;
  }
  
  // 周日下午考练（两场）
  if (isSunday && weekendExamConfig.sunday.enabled) {
    weekendExamConfig.sunday.sessions.forEach(session => {
      $(session.name, today.date, session.start, session.end);
      console.log(`设置周日考练: ${session.name} ${session.start}-${session.end}`);
    });
    return true;
  }
  
  return false;
}

// 重写高三日常的schedule方法，26届
function overrideSeniorSchedule() {
  if (exams[26] && exams[26].schedule) {
    const originalSchedule = exams[26].schedule;
    
    exams[26].schedule = function() {
      // 先尝试设置周末考练
      const weekendExamSet = setWeekendExam();
      
      // 如果设置了周末考练，就不再设置正常课程
      if (weekendExamSet) {
        return;
      }
      
      // 否则执行原来的课程安排
      return originalSchedule.call(this);
    };
    
    console.log("周末考练功能已启用");
  }
}

// 确保在正确的时间初始化
function initWeekendExam() {
  // 等待exam.js完全加载
  if (typeof exams === 'undefined' || !exams[26]) {
    setTimeout(initWeekendExam, 100);
    return;
  }
  
  overrideSeniorSchedule();
  
  // 如果当前已经是高三日常模式，强制刷新一次日程
  if (subject.current == 26) {
    exams[26].schedule();
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWeekendExam);
} else {
  initWeekendExam();
}
