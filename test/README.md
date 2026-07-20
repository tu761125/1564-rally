# 1564 Rally v3.2.0 Display Fix

修正：
- 房間小畫面改成真正與外部 Player Pool 相同的 HTML 欄位。
- 修正程式更新不存在的舊欄位，造成計算後停止執行。
- 按下 Calculate Selected 後立即顯示：
  - 下一位玩家
  - 準備秒數
  - 目前進度
  - 玩家出發順序
- Firebase 回傳後持續同步小畫面與全畫面。
- 加入防呆，單一顯示元件問題不再讓整個倒數停止。
- 若仍有顯示錯誤，會在房間下方直接顯示錯誤文字。

## 上傳
1. 將 index.html 覆蓋 GitHub 的 test/index.html。
2. Firebase Rules 不需要修改。
3. 關閉舊分頁後開啟：
https://tu761125.github.io/1564-rally/test/?v=320
