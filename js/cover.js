// 过渡动画
var eleCover = document.getElementById("cover"),
  eleCoverbar = document.getElementById("coverbar");
function playCover(msg) {
  document.getElementById("covermsg").innerHTML = msg;
  eleCoverbar.style.width = "100%";
  eleCover.style.display = "flex";
  setTimeout(function () { eleCover.style.opacity = ""; }, 0);
  setTimeout(function () { eleCoverbar.style.width = "94%"; }, 300);
  setTimeout(function () { eleCoverbar.style.width = "50%"; }, 600);
  setTimeout(function () { eleCoverbar.style.width = "6%"; }, 900);
  setTimeout(function () { eleCoverbar.style.width = ""; }, 1800);
  setTimeout(function () { eleCover.style.opacity = "0"; }, 1800);
  setTimeout(function () { eleCover.style.display = ""; }, 2000);
  return msg;
}