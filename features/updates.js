import { select } from "../utils/dom.js";

export function loadLastCommitTime(element, repo) {
  fetch(`https://ungh.cc/repos/${repo}`)
    .then((response) => response.json())
    .then(({ repo }) => {
      select(element).text(`${new Date(repo.updatedAt).toLocaleString()}`);
    })
    .catch((error) => {
      select(element).text("(获取失败)");
      select(element).attr("title", error);
    });
}
