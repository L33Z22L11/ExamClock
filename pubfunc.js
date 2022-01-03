/* 
 * 公用功能
 * 已于2022-01-03自查代码质量
 */
// 页面基本元素
var eleMain = document.getElementById("main");
var eleMenu = document.getElementById("menu");
// var eleForewarn = document.getElementById("forewarn");
var eleMsg = document.getElementById("msg");
var eleCard = document.getElementsByClassName("card")[0];
// 在一位数前补“0”
function fixDigit(num) { num = parseInt(num); return num < 10 ? "0" + num : num; }
// 输入Date对象，返回友好的时间(如"8:00")
function getClock(date) { return date.getHours() + ":" + fixDigit(date.getMinutes()); }
// 以分钟为单位相对调整Date对象的时间
function fixMinutes(date, friendlyname) {
  date.setMinutes(date.getMinutes() + Number(prompt("以分钟为单位增减" + (friendlyname || getClock(date)), -5)));
}
// 发送气泡通知
var msgInterval;
function send(msg) {
  eleMsg.style.display = "flex";
  output("msgcontent", msg);
  clearInterval(msgInterval);
  msgInterval = setInterval(function () { eleMsg.style.display = ""; }, 30000);
  return msg;
}
// 替换DOM元素内容
function output(id, value) { return document.getElementById(id).innerHTML = value; }
// eleMain样式调节
function relStyle(prop, delta, unit, minVal, maxVal) {
  var propVal = eleMain.style[prop].replace(unit, "") * 1 + delta;
  // 保留两位小数，然而toFixed()有精度问题
  propVal = Math.round(Math.min(Math.max(propVal, minVal), maxVal) * 1E2) / 1E2;
  eleMain.style[prop] = propVal + unit;
  output(prop, propVal);
  console.log(send(prop + "增加了" + delta + "，调节为" + propVal));
}
