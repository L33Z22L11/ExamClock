/*
 * 图库背景切换
 */
import { galleryCollections } from "../config/gallery.js";
import { select } from "../utils/dom.js";
import { pick } from "../utils/random.js";

const GALLERY_ROTATE_INTERVAL = 2_000_000;
const GALLERY_IMAGE_HOST = "https://ooo.0x0.ooo";

const allGalleryItems = Object.entries(galleryCollections).flatMap(([collectionName, imageInfos]) =>
  imageInfos.map((imageInfo) => createGalleryItem(collectionName, imageInfo))
);

const noop = () => {};
let coverPlayer = noop;
let currentGalleryItem = null;
let rotateTimer = null;

export function setGalleryCoverPlayer(player) {
  coverPlayer = player;
}

export function getCurrentGalleryItem() {
  return currentGalleryItem;
}

export function selectGalleryItem(collectionName) {
  currentGalleryItem = pickGalleryItem(collectionName);
  // 重新设置换壁纸定时器，避免手动切换后立刻自动跳走。
  clearInterval(rotateTimer);
  rotateTimer = setInterval(selectGalleryItem, GALLERY_ROTATE_INTERVAL);
  document.body.style.backgroundImage = `url(${currentGalleryItem.url})`;
  return select("#gallery-credit").html(
    `背景: ${currentGalleryItem.author} - ${currentGalleryItem.name} (${currentGalleryItem.collectionName})`,
  );
}

function pickGalleryItem(collectionName) {
  if (collectionName in galleryCollections) {
    return createGalleryItem(collectionName, pick(galleryCollections[collectionName]));
  }
  return pick(allGalleryItems);
}

function createGalleryItem(collectionName, imageInfo) {
  const [author, name, shortURL] = imageInfo;
  return { collectionName, author, name, url: `${GALLERY_IMAGE_HOST}/202${shortURL}.jpg` };
}

function loadGalleryCollectionList() {
  const collectionList = select("#gallery-batch-list").element;
  const collectionNames = Object.keys(galleryCollections).reverse();
  collectionNames.forEach((collectionName) => {
    const link = document.createElement("a");
    link.innerText = `${collectionName}(${galleryCollections[collectionName].length})`;
    link.addEventListener("click", () => coverPlayer(selectGalleryItem(collectionName)));
    collectionList.appendChild(link);
  });
}

loadGalleryCollectionList();
selectGalleryItem(Object.keys(galleryCollections).at(-1));
