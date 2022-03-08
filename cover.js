// 过渡动画
var eleCover = document.getElementById("cover"),
  eleCoverbar = document.getElementById("coverbar");
function playCover(msg) {
  document.getElementById("covermsg").innerHTML = msg;
  eleCoverbar.style.width = "100%";
  eleCover.style.display = "flex";
  setTimeout(function () { eleCover.style.opacity = ""; }, 0);
  setTimeout(function () { eleCoverbar.style.width = "94%"; }, 500);
  setTimeout(function () { eleCoverbar.style.width = "50%"; }, 1000);
  setTimeout(function () { eleCoverbar.style.width = "6%"; }, 1500);
  setTimeout(function () { eleCoverbar.style.width = ""; }, 2500);
  setTimeout(function () { eleCover.style.opacity = "0"; }, 3000);
  setTimeout(function () { eleCover.style.display = ""; }, 3500);
}