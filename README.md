# NTU Election Registration Site (ntu-vote-register)
Developed for [Election &amp; Recalling Execution Community, NTU Students Association](https://vote.ntustudents.org/)  
Designed by [Hao-Yung Chan (katrina376)](https://github.com/katrina376/), 2016 Spring Semester  
Upgraded to v2.x, 2016 Fall Semester  
Based on [Google Apps Script](https://developers.google.com/apps-script/)  
Released under [MIT License](https://github.com/katrina376/ntu-vote-register/blob/master/LICENSE.md)

由[國立臺灣大學學生會選舉罷免執行委員會](https://vote.ntustudents.org/) 104-2 委員 [Hao-Yung (Katrina) Chan](https://github.com/katrina376/) 開發，於 104 學年度第二學期第一次使用，並於 105 學年度第一學期進行改版。使用 [Google Apps Script](https://developers.google.com/apps-script/) 建置。本專案採用 [MIT 授權](https://github.com/katrina376/ntu-vote-register/blob/master/LICENSE.md)。

## Install
必須在 Google Drive 上使用 GAS 專案檔運行。暫時沒時間寫匯出成 GAS 專案的工具。目前的解法是自己開 GAS 專案，然後把 `src/` 中的檔案（不分資料夾）一個一個複製貼上。請注意不要寫錯副檔名。

## Source Code Description
### `scripts/config.gs`
存放參數的檔案，以下為需要設定的參數名稱：
+ `DB_ID` : 作為原始資料庫的 Spreadsheet id
+ `DB_EXPORT_ID` : 完成審核後，匯出的資料庫的 Spreadsheet id
+ `TOC_NAME` : 資料庫目錄標題
+ `ELECTION_TITLE` : 選舉名稱
+ `LOGO_SRC` : 選委會 logo 的檔案網址

#### `scripts/app.gs`
主程式。

#### `scripts/verificate.gs`
使用排程設定，每 5 分鐘執行一次，將新寫入資料庫的登記資料匯出成審核文件。  

#### `scripts/export.gs`
使用排程設定，每 5 分鐘執行一次，將完成審核的登記資料匯入另一個資料庫（ DB_EXPORT_ID ）。

#### `views/form_[typename].html`
不同的選舉表單，後面字串對應資料庫中不同選舉的分類。會呼叫以下檔案，匯入其他標籤：
+ `views/page_header.html` : `<!DOCTYPE><head></head><body>` + header content  
+ `views/page_footer.html` : footer content + `</body>`
+ `styles/pure.html` : [pure.css](http://purecss.io) (called in `page_header.html`)  
+ `scripts/script.html` : javascript file (called in `page_header.html`)  
+ `styles/style.html` : css file (called in `page_header.html`)  

#### `views/expire.html`
於登記期限之後，取代登記表單顯示的畫面。
