// 过渡动画
let eleCover = document.getElementById("cover");
let eleCoverTitle = document.getElementById("coverTitle");
let eleCoverAuthor = document.getElementById("coverAuthor");
let eleCoverOrigin = document.getElementById("coverOrigin");
let eleCoverImage = document.getElementById("coverImage");
let eleCoverTips = document.getElementById("coverTips");
let eleBgHook = document.getElementById("bgHook");

let coverTips = [
  "来学习！咕！咕！咕咕咕！",
  "新版本请多多关照！发现bug请拨打：QQ2399052066",
  "关注纸鹿本鹿谢谢喵～",
  "野生技协会一直陪伴着你。。只要你需要技术协助的话！",
  "希望野生技协能帮助你们到天长地久，抱抱",
  "7.0啦，大家都长大啦ww",
  "我觉得生发剂不一定有用，得植发",
  "诶…防脱洗发水用完了…",
  "猜猜你要重新加载多少次才能再看到这条tip￣︶￣",
  "这是一条属于7.0版本的Tips！",
  "print(\"Hello tips7.0\");",
  "来猜猜看这边有几个有用的信息呢~",
  "你知道吗？其实tips全都是废话（确信",
  "啊！要给你看什么Tip好呢…(翻",
  "上次看到这条Tip还是在上次",
];

function playCover(msg) {
  try {
    eleBgHook.innerHTML = bg.cur.name;
    eleCover.style.backgroundImage = `url(${bg.cur.url})`;
    eleCoverImage.style.backgroundImage = `url(${bg.cur.url})`;
    let curExam = exams[subject.current];
    eleCoverTitle.innerHTML = curExam.type;
    eleCoverAuthor.innerHTML = curExam.author;
    eleCoverOrigin.innerHTML = curExam.origin;
  } catch { }
  eleCoverTips.innerHTML = msg || coverTips[~~(Math.random() * coverTips.length)]
  eleCover.style.display = "flex";
  setTimeout(function () { eleCover.style.opacity = ""; }, 0);
  setTimeout(function () { eleCover.style.opacity = "0"; }, 2000);
  setTimeout(function () { eleCover.style.display = ""; }, 2500);
  return msg;
}