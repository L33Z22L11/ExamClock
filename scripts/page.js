
let toastTimer;
const messageToast = document.querySelector("#message-toast");
const fullscreenButton = document.querySelector("#fullscreen-button");
messageToast.style.display = "none";
messageToast.addEventListener("click", () => { messageToast.style.display = "none"; });

export function renderExamMenu(target, exams, group) {
  const container = document.querySelector(target);
  const actionEntry = container.querySelector("[data-action]");
  Object.entries(exams).forEach(([type, schedule]) => {
    if (schedule.hidden || (schedule.menu ?? "main") !== group) return;
    const item = document.createElement("a");
    item.dataset.examType = type;
    item.textContent = schedule.displayName ?? schedule.type;
    container.insertBefore(item, actionEntry);
  });
}

export function showToast(message) {
  messageToast.style.display = "";
  document.querySelector("#message-content").innerHTML = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { messageToast.style.display = "none"; }, 30_000);
  return message;
}

export async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch (error) {
    showToast("操作失败，请手动最大化窗口或全屏。<span class='dim'>建议使用 Chrome/Edge/Firefox 浏览器。</span>");
    console.warn(error);
  }
}

// Esc 和浏览器菜单也能退出全屏，以实际状态更新按钮。
document.addEventListener("fullscreenchange", () => {
  const active = Boolean(document.fullscreenElement);
  fullscreenButton.className = `fa-solid fa-${active ? "compress" : "expand"}`;
  fullscreenButton.dataset.sub = active ? "退出" : "全屏";
});

export async function loadLastCommitTime(element, repo) {
  try {
    const response = await fetch(`https://ungh.cc/repos/${repo}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    element.textContent = new Date(data.repo.updatedAt).toLocaleString();
  } catch (error) {
    element.textContent = "(获取失败)";
    element.title = String(error);
  }
}

export async function logProjectInfo() {
  let logoStyle = "";
  try {
    const response = await fetch(new URL("../favicon.ico", import.meta.url));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = new Blob([await response.arrayBuffer()], { type: "image/x-icon" });
    const logo = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    // Chromium 控制台的 CSS 图片只允许 data: URL，复用站点图标后再转换。
    logoStyle = `background: url("${logo}") left center / 22px 22px no-repeat; padding-left: 30px;`;
  } catch (error) {
    console.debug("控制台 Logo 加载失败，保留文字横幅。", error);
  }
  const version = document.querySelector("#app-version").textContent;
  // 图标作为同一段标题的背景，避免两个 %c 文本片段的基线与内边距错位。
  console.groupCollapsed(`%c考试时钟 ExamClock V ${version}`, `font:bold 18px/1.5 sans-serif;color:#3a9;${logoStyle}`);
  console.log("项目仓库：https://github.com/L33Z22L11/ExamClock\n野生技协群：894656456");
  console.groupEnd();
}
