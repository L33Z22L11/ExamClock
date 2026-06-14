/*
 * 图库背景切换：读取纯配置，拼出图片地址，并渲染批次菜单。
 */
import { galleryCollections } from "../config/gallery.js";
import { select } from "../utils/dom.js";

const rotateInterval = 2_000_000;
const imageHost = "https://ooo.0x0.ooo";

const allGalleryItems = Object.entries(galleryCollections).flatMap(([collectionName, imageInfos]) =>
  imageInfos.map((imageInfo) => createGalleryItem(collectionName, imageInfo))
);

export let currentBackground = null;
let rotateTimer = null;

export function chooseBackground(collectionName) {
  currentBackground = pickBackground(collectionName);
  // 重新设置换壁纸定时器，避免手动切换后立刻自动跳走。
  clearInterval(rotateTimer);
  rotateTimer = setInterval(chooseBackground, rotateInterval);
  document.body.style.backgroundImage = `url(${currentBackground.url})`;
  return select("#gallery-credit").html(
    `背景: ${currentBackground.author} - ${currentBackground.name} (${currentBackground.collectionName})`,
  );
}

export function renderGalleryMenu(onSelect) {
  const collectionList = select("#gallery-batch-list").element;
  const collectionNames = Object.keys(galleryCollections).reverse();
  collectionNames.forEach((collectionName) => {
    const link = document.createElement("a");
    link.innerText = `${collectionName}(${galleryCollections[collectionName].length})`;
    link.addEventListener("click", () => onSelect(chooseBackground(collectionName)));
    collectionList.appendChild(link);
  });
}

function pickBackground(collectionName) {
  if (collectionName in galleryCollections) {
    return createGalleryItem(collectionName, pickOne(galleryCollections[collectionName]));
  }
  return pickOne(allGalleryItems);
}

function createGalleryItem(collectionName, imageInfo) {
  const [author, name, shortURL] = imageInfo;
  return { collectionName, author, name, url: `${imageHost}/202${shortURL}.jpg` };
}

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

chooseBackground(Object.keys(galleryCollections).at(-1));
