# 1564 Rally v3.1.9 Match Outside

修正內容：

1. 房間小畫面與全畫面倒數，改成和外部 Player Pool 同一套顯示與邏輯：
   - NEXT PLAYER · 下一位
   - 玩家名稱
   - GET READY / OPEN IN / GO! / COMPLETE
   - 大型秒數或 GO! / DONE
   - 目前進度
   - 編號玩家名單
   - current / done 狀態

2. 房長離開後，使用同一台裝置重新加入：
   - 依 Firebase hostUid 自動恢復房長身分
   - 恢復編輯、開始、暫停、重設及踢人權限

3. 移除「完成後反覆寫入 Firebase 狀態」：
   - 不再出現 Waiting · 等待開始 與 Finished · 全部完成來回跳
   - 小畫面與大畫面共用同一個 frame，不會互相覆蓋秒數

## 上傳
1. 將 index.html 覆蓋 GitHub 的 test/index.html。
2. Firebase Rules 不需要修改。
3. 建議先關閉舊頁面，再用新網址建立新房間測試：
https://tu761125.github.io/1564-rally/test/?v=319
