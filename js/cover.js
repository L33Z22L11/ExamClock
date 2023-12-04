// 过渡动画
let eleCover = document.getElementById("cover");

function playCover(msg) {
  // document.getElementById("covermsg").innerHTML = msg;
  // eleCoverbar.style.width = "100%"; 
  eleCover.style.display = "flex";
  setTimeout(function () { eleCover.style.opacity = ""; }, 0);
  setTimeout(function () { eleCover.style.opacity = "0"; }, 2000);
  setTimeout(function () { eleCover.style.display = ""; }, 2500);
  return msg;
}