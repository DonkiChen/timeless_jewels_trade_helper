
// 因为 content script 功能受限，所以通过添加 script 的方式，将主要功能注入到主文档
var s = document.createElement('script');
s.src = chrome.runtime.getURL('scripts/main.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
