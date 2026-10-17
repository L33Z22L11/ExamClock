import { collections, pickImage } from "../monoroll.js";

export let currentBackground = null;
let rotateTimer;

export function chooseBackground(collection) {
  currentBackground = pickImage(collection);
  // 手动切换后重新计时，避免紧接着自动换图。
  clearTimeout(rotateTimer);
  rotateTimer = setTimeout(chooseBackground, 2_000_000);
  document.body.style.backgroundImage = `url("${currentBackground.url}")`;
  const credit = `背景: ${currentBackground.author} - ${currentBackground.name} (${currentBackground.collection})`;
  document.querySelector("#gallery-credit").textContent = credit;
  return credit;
}

export function renderGalleryMenu() {
  const list = document.querySelector("#gallery-batch-list");
  Object.entries(collections).reverse().forEach(([collection, images]) => {
    const link = document.createElement("a");
    link.textContent = `${collection}(${images.length})`;
    link.dataset.action = "random-background";
    link.dataset.collection = collection;
    list.appendChild(link);
  });
}
