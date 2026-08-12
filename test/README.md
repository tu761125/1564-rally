# 1564 Rally v3.4.0 — March + Arrival Order Test

第四分頁改為完整自訂集結規劃：

- 每位玩家輸入行軍時間（分鐘＋秒）
- 房長用 ↑ / ↓ 調整「想要的抵達順序」
- 每位玩家可設定與上一位的抵達間隔 0–120 秒
- 第一個實際開集結的人前面可設定預備秒數 0–120 秒
- 系統自動反推每位玩家應該在第幾秒開集結
- 實際開集結順序可能與抵達順序不同，這是正常的
- 小畫面與全畫面倒數顯示「下一位該開集結的人」
- 複製清單同時列出開集結順序與抵達順序

計算原理：
desired arrival offset = 累加抵達間隔
raw rally start = arrival offset - march time
所有人的 rally start 一起平移，讓最早一位在「預備秒數」後開集結

範例：
預備 3 秒
A 行軍 50 秒，抵達第1
B 行軍 30 秒，晚 A 10 秒抵達
C 行軍 40 秒，晚 B 5 秒抵達

網站會自動算出各自應該何時開集結，並保證最後抵達順序仍為 A → B → C。

安裝：
1. 直接使用本版，不需要先上 v3.3.0 / v3.3.1。
2. 覆蓋 GitHub 的 test/index.html。
3. 將 database.rules.json 貼到 Firebase Realtime Database → Rules 並發布。
4. 開啟：
https://tu761125.github.io/1564-rally/test/?v=340
