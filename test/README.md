# 1564 Rally Timer v2.5 Counter Test

新增：
- Visits · 瀏覽：每次頁面載入加 1
- Online · 在線：目前開啟網站的瀏覽器分頁數

注意：
- 這是瀏覽次數，不是精準獨立人數。
- 同一人重新整理會再增加一次。
- 同一人開兩個分頁，可能算成兩個在線。
- 需要 Firebase Anonymous Authentication 與 Realtime Database。

設定：
1. Firebase 建立專案與 Web App。
2. 啟用 Authentication → Anonymous。
3. 建立 Realtime Database。
4. Rules 貼上 database.rules.json。
5. 把 Firebase 提供的 firebaseConfig 貼進 index.html。
6. 上傳覆蓋 test/index.html。
