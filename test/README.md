# 1564 Rally v3.1.2 Room Fix

修正：
- 房間 Firebase 改用獨立命名 App，避免與瀏覽計數器衝突。
- 所有房間按鈕改用穩定的 addEventListener 綁定。
- 按鈕加入 type=button，避免手機瀏覽器誤送出或重新載入。
- 房間分頁載入成功時顯示：
  Room system ready · 房間系統已就緒
- 啟動失敗會直接顯示錯誤。

## 上傳
1. 將 index.html 覆蓋 GitHub 的 test/index.html。
2. 原本已發布 v3.1 rooms 規則的話，不必再改規則。
3. 開啟：
https://tu761125.github.io/1564-rally/test/?v=312
