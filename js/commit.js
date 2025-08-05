/* 作者：纸鹿/Zhilu (github.com/L33Z22L11)
获取某个 GitHub Repository 的上一次 commit 时间，使用 WTFPL 协议开源。
使用方式参考：
<script src="/path-to-commit.js"
  onload="getLastCommit(document.querySelector('#lastCommit'), 'L33Z22L11/ExamClock')"></script>
 */
function getLastCommit(ele, repo) {
  fetch(`https://ungh.cc/repos/${repo}`)
    .then(response => response.json())
    .then(({ repo }) => {
      ele.textContent = `${new Date(repo.updatedAt).toLocaleString()}`
    })
    .catch(error => {
      ele.textContent = `(获取失败)`
      ele.setAttribute('title', error)
    })
}