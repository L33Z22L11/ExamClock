/* 
 * 消息气泡
 */
// 页面基本元素
var eleMsg = document.getElementById("msg");
eleMsg.style.display = "none";
// 发送气泡通知
function send(msg) {
  eleMsg.style.display = "";
  document.getElementById("msgcontent").innerHTML = msg;
  clearInterval(send.interval);
  send.interval = setInterval(function () { eleMsg.style.display = "none"; }, 30000);
  return msg;
}
eleMsg.onclick = function () { this.style.display = "none"; };
