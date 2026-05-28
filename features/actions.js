import { select } from "../utils/dom.js";

/**
 * 渲染考试类型菜单并绑定页面上的声明式操作。
 *
 * @param {Object} options 页面操作配置。
 * @param {Object<string, Object>} options.schedules 考试类型配置表。
 * @param {(type: string) => void} options.switchExam 切换到指定考试类型。
 * @param {() => void} options.createTemporaryExam 打开临时科目流程。
 * @param {() => void} options.createCountdownExam 打开倒计时流程。
 * @param {() => void} options.showRandomBackground 随机切换背景并显示封面。
 * @param {(event: Event) => void} options.clearFilter 清除纪念日黑白滤镜。
 * @param {() => void} options.showRemovedSloganNotice 显示移除功能提示。
 * @param {() => void} options.adjustStart 调整当前科目开始时间。
 * @param {() => void} options.adjustEnd 调整当前科目结束时间。
 * @param {() => void} options.toggleFullscreen 切换全屏。
 */
export function bindPageActions(options) {
  renderExamMenu("#exam-type-list", options.schedules, "main");
  renderExamMenu("#social-exam-list", options.schedules, "social");

  select("[data-exam-type]").all().forEach(item => {
    item.addEventListener("click", () => options.switchExam(item.dataset.examType));
  });

  const handlers = {
    "temporary-exam": options.createTemporaryExam,
    "countdown-exam": options.createCountdownExam,
    "random-background": options.showRandomBackground,
    "clear-filter": options.clearFilter,
    "removed-slogan": options.showRemovedSloganNotice,
    "adjust-start": options.adjustStart,
    "adjust-end": options.adjustEnd,
    fullscreen: options.toggleFullscreen,
  };

  Object.entries(handlers).forEach(([name, handler]) => {
    select(`[data-action="${name}"]`).all().forEach(item => {
      item.addEventListener("click", handler);
    });
  });
}

function renderExamMenu(target, schedules, group) {
  const container = select(target).element;
  if (!container) return;

  const actionEntry = select("[data-action]", container).element;
  Object.entries(schedules).forEach(([type, schedule]) => {
    if (schedule.hidden || (schedule.menu ?? "main") !== group) return;

    const item = document.createElement("a");
    item.dataset.examType = type;
    item.textContent = schedule.displayName ?? schedule.type;
    container.insertBefore(item, actionEntry);
  });
}
