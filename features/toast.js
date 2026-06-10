import { select } from "../utils/dom.js";

const TOAST_HIDE_DELAY = 30_000;
let toastTimer = null;

const messageToast = select("#message-toast").element;
select("#message-toast").hide();

export function showToast(msg) {
  select("#message-toast").show();
  select("#message-content").html(msg);
  clearInterval(toastTimer);
  toastTimer = setInterval(() => select("#message-toast").hide(), TOAST_HIDE_DELAY);
  return msg;
}

messageToast.addEventListener("click", () => select(messageToast).hide());
