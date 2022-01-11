/* 
 * 消息气泡
 */
// 页面基本元素
var eleForewarn = document.getElementById("forewarn"),
  eleForewarntime = document.getElementById("forewarntime"),
  eleMsg = document.getElementById("msg"),
  eleMsgcontent = document.getElementById("msgcontent");

// 发送气泡通知
var msgInterval;
function send(msg) {
  eleMsg.style.display = "flex";
  eleMsgcontent.innerHTML = msg;
  clearInterval(msgInterval);
  msgInterval = setInterval(function () { eleMsg.style.display = ""; }, 30000);
  return msg;
}
// 关闭通知气泡
// eleForewarn.onclick = 
eleMsg.onclick = function () { this.style.display = ""; };
// 希沃屏保预警，2021-09屏保已经更换内容且被信息中心关闭
function updateForewarn() {
  forewarntime -= 1;
  eleForewarntime.innerHTML = "在" + forewarntime + "分钟后";
  if (forewarntime < 0) {
    eleForewarn.style.backgroundColor = "rgba(255,255,255,.2)";
    eleForewarntime.innerHTML = "已经";
  } else if (forewarntime < 10) {
    eleForewarn.style.display = "flex";
    eleForewarn.style.backgroundColor = "#f52";
  } else {
    eleForewarn.style.display = "";
  }
}
