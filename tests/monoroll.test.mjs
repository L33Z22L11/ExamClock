import test from "node:test";
import assert from "node:assert/strict";
import { collections, images, pickImage } from "../monoroll.js";
import { galleryCollections } from "../config/gallery.js";

test("公共模块无需 DOM，完整保留源数据和图片地址", () => {
  assert.equal(typeof document, "undefined");
  assert.deepEqual(Object.keys(collections), Object.keys(galleryCollections));
  let count = 0;
  for (const [collection, entries] of Object.entries(galleryCollections)) {
    assert.equal(collections[collection].length, entries.length);
    entries.forEach(([author, name, shortURL], index) => {
      assert.deepEqual(collections[collection][index], {
        collection, author, name, url: `https://ooo.0x0.ooo/202${shortURL}.jpg`,
      });
      count++;
    });
  }
  assert.equal(images.length, count);
});

test("全库和批次随机覆盖边界，未知批次明确报错", (t) => {
  t.mock.method(Math, "random", () => 0);
  assert.equal(pickImage(), images[0]);
  for (const name of Object.keys(collections)) assert.equal(pickImage(name), collections[name][0]);
  Math.random.mock.mockImplementation(() => 1 - Number.EPSILON);
  assert.equal(pickImage(), images.at(-1));
  for (const name of Object.keys(collections)) assert.equal(pickImage(name), collections[name].at(-1));
  for (const name of ["", "missing", "toString", "__proto__", null]) {
    assert.throws(() => pickImage(name), RangeError);
  }
});
