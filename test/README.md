# 1564 Rally v3.4.1 Rejoin Countdown Fix

修正第四分頁重新進房後：
- Waiting / Complete 反覆跳動
- 舊計時器仍在更新畫面
- 舊 Firebase listener snapshot 覆蓋新畫面

新增：
- sessionVersion：離開/重進房後，舊 callback 全部失效
- renderVersion：每個 Firebase snapshot 只允許最新一組倒數 timer 更新
- 房長重新加入時，如果舊 running 倒數早已過期，自動恢復 Waiting
- Recover Countdown · 修復倒數
  - 保留玩家
  - 保留行軍時間
  - 保留抵達順序
  - 保留抵達間隔
  - 保留計算後的集結時間
  - 只重置倒數狀態到 Waiting

Firebase Rules 不需要再改（若已經發佈 v3.4.0 的 manualRooms 規則）。

上傳：
1. 用 index.html 覆蓋 GitHub test/index.html
2. 不需要再次修改 Firebase Rules
3. 測試：https://tu761125.github.io/1564-rally/test/?v=341
