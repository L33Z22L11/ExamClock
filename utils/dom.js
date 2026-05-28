/**
 * @typedef {Object} DomHandle
 * @property {Element|null} element 已解析的 DOM 元素。
 * @property {() => NodeListOf<Element>} all 当 `selector` 是选择器时，返回当前作用域内全部匹配元素。
 * @property {(child: Node) => Node} append 追加子节点。
 * @property {(name: string, value?: string) => string|null} attr 读取或写入属性。
 * @property {(value: string) => string} display 设置 `style.display`。
 * @property {() => void} hide 用 `display: none` 隐藏元素。
 * @property {(value?: string) => string} html 读取或写入 `innerHTML`。
 * @property {() => void} remove 移除元素。
 * @property {() => void} show 清空 `style.display`。
 * @property {(name: string, value?: string) => string} style 读取或写入单个行内样式。
 * @property {(value?: string) => string} text 读取或写入 `textContent`。
 */

/**
 * 项目统一使用的轻量 DOM 门面。
 *
 * 常规场景传 CSS 选择器；事件回调或接口回调里已经拿到元素时，也可以直接传 Element。
 * DOM 读写集中到这里后，业务模块会更容易扫读。
 *
 * @param {string|Element|null} selector CSS 选择器或已解析的元素。
 * @param {ParentNode} [root=document] 查询作用域。
 * @returns {DomHandle}
 */
export function select(selector, root = document) {
  const element = typeof selector === "string" ? root.querySelector(selector) : selector;

  return {
    element,
    all: () => root.querySelectorAll(selector),
    append: (child) => element.appendChild(child),
    attr: (name, value) => {
      if (value === undefined) return element.getAttribute(name);
      element.setAttribute(name, value);
      return value;
    },
    display: (value) => {
      element.style.display = value;
      return value;
    },
    hide: () => {
      element.style.display = "none";
    },
    html: (value) => {
      if (value === undefined) return element.innerHTML;
      element.innerHTML = value;
      return value;
    },
    remove: () => element.remove(),
    show: () => {
      element.style.display = "";
    },
    style: (name, value) => {
      if (value === undefined) return element.style[name];
      element.style[name] = value;
      return value;
    },
    text: (value) => {
      if (value === undefined) return element.textContent;
      element.textContent = value;
      return value;
    },
  };
}
