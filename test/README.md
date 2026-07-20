# 1564 Rally v3.2.1 Recovery Fix

新增房長專用按鈕：

Recover Countdown · 修復倒數

用途：
- 房長退出後重新加入，若畫面在「準備／完成」之間跳動，可按此按鈕。
- 停止所有舊倒數計時器。
- 強制將 Firebase 房間狀態改回 Waiting。
- 清除 startedAt。
- 將 remaining 恢復為完整倒數時間。
- 保留玩家名單、分鐘秒數、出發順序及房內成員。
- 修復後房長重新按 Start 即可。

同時新增：
- 每次重新進入房間會先取消舊 Firebase 監聽與舊計時器。
- 使用 renderVersion 防止舊快照繼續更新畫面。

## 上傳
1. 將 index.html 覆蓋 GitHub 的 test/index.html。
2. Firebase Rules 不需要修改。
3. 開啟：
https://tu761125.github.io/1564-rally/test/?v=321
