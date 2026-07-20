# 1564 Rally v3.1 Room Test

新增第三分頁：Sync Room · 同步房間

已包含：
- 建立者自訂房號、密碼、房長 ID
- 玩家以房號、密碼、玩家 ID 加入
- 房內即時人數與成員 ID
- 房長開始、暫停、重設同步倒數
- 房長踢出玩家
- 最後一人主動離開時刪除房間
- 繁體中文與英文雙語

## 安裝
1. 上傳 index.html 覆蓋 GitHub 的 test/index.html。
2. 將 database.rules.json 全部內容貼到 Firebase Realtime Database → Rules。
3. 按 Publish。
4. 開啟 https://tu761125.github.io/1564-rally/test/?v=310

建議用一般瀏覽器建立房間，再用無痕分頁加入測試。
