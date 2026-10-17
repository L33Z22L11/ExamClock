import { galleryCollections } from "./config/gallery.js";

/** 一卷图库图片：批次、作者、作品名和完整图片地址。 */
export const collections = Object.fromEntries(
  Object.entries(galleryCollections).map(([collection, images]) => [
    collection,
    images.map(([author, name, shortURL]) => ({
      collection,
      author,
      name,
      url: `https://ooo.0x0.ooo/202${shortURL}.jpg`,
    })),
  ]),
);

export const images = Object.values(collections).flat();

/**
 * 均匀随机选取一张图片；省略批次时从全库选取。
 * @param {string} [collection] 批次名称，例如 Nov21。
 * @returns {{collection: string, author: string, name: string, url: string}}
 */
export function pickImage(collection) {
  if (collection !== undefined && !Object.hasOwn(collections, collection)) {
    throw new RangeError(`未知图库批次：${collection}`);
  }
  const candidates = collection === undefined ? images : collections[collection];
  if (!candidates.length) throw new RangeError("图库中没有可用图片");
  return candidates[Math.floor(Math.random() * candidates.length)];
}
