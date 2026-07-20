# 1564 Rally v3.1.8 Server Time Fix

修正房間同步倒數亂跳：

- 不再使用各手機自己的 Date.now() 作為共同時間。
- 開始時間改用 Firebase serverTimestamp。
- 所有裝置使用 Firebase serverTimeOffset 校正。
- 防止裝置時間差造成倒數增加、倒退或提前完成。
- 全部玩家出發後，房間狀態自動變成 Finished。
- 沒有集結名單時顯示 Waiting · 等待設定。

## 上傳
1. 將 index.html 覆蓋 GitHub 的 test/index.html。
2. Firebase Rules 不需要修改。
3. 建議先離開舊房間，再建立一個新房間測試。
4. 開啟：
https://tu761125.github.io/1564-rally/test/?v=318
