# 1564 Rally v3.1.5 Empty Room Fix

修正：
- 若房號存在但房內成員為 0，建立者可自動清除舊空房並重新建立。
- 有成員存在時才會顯示「房號已存在」。
- 保留房間玩家池與同步倒數功能。

## 上傳
1. 將 index.html 覆蓋 GitHub 的 test/index.html。
2. Firebase Rules 不需要修改。
3. 開啟：
https://tu761125.github.io/1564-rally/test/?v=315
