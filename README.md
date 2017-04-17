# NTU Election Registration Site (ntu-vote-register)
Developed for [Election &amp; Recalling Execution Community, NTU Students Association](https://vote.ntustudents.org/)  
Designed by [Hao-Yung Chan (katrina376)](https://github.com/katrina376/), 2016 Spring Semester  
Upgraded to v2.x, 2016 Fall Semester  
Upgraded to v3.x, 2017 Spring Semester
Powered by [Google Apps Script](https://developers.google.com/apps-script/)  
Released under [MIT License](https://github.com/katrina376/ntu-vote-register/blob/master/LICENSE)

由[國立臺灣大學學生會選舉罷免執行委員會](https://vote.ntustudents.org/) 104-2 委員 [Hao-Yung (Katrina) Chan](https://github.com/katrina376/) 開發，於 104 學年度第二學期第一次使用，並於 105 學年度第一學期改版至 v2.x，第二學期改版至 v3.x。使用 [Google Apps Script](https://developers.google.com/apps-script/) 建置。本專案採用 [MIT 授權](https://github.com/katrina376/ntu-vote-register/blob/master/LICENSE)。

## Update Log of v3.x
1. 將審核文件輸出功能移至另一個專案進行。
2. 新增 105-2 學生會暨自治組織聯合選舉的所有表單，包含：
  * 學生會會長
  * 學生代表
  * 其他選舉項目（單人）
  * 其他選舉項目（聯名登記）

## Install
必須在 Google Drive 上使用 GAS 專案檔運行。暫時沒時間寫匯出成 GAS 專案的工具。目前的解法是自己開 GAS 專案，然後把 `src/` 中的檔案（不分資料夾）一個一個複製貼上。請注意不要寫錯副檔名。

## Source Code Description
#### `scripts/config.gs`
存放參數的檔案，以下為需要設定的參數名稱：
+ `DB_ID` : 作為資料庫的 Spreadsheet id
+ `VERIFY_APP` : 審核系統，原始碼參見 [ntu-vote-verify](https://github.com/ntu-vote-verify)
+ `TOC_NAME` : 資料庫目錄標題
+ `ELECTION_TITLE` : 選舉名稱
+ `LOGO_SRC` : 選委會 logo 的檔案網址

#### `scripts/app.gs`
主程式。

#### `views/form_[typename].html`
不同的選舉表單，後面字串對應資料庫中不同選舉的分類。會呼叫以下檔案，匯入其他標籤：
+ `views/page_header.html` : `<!DOCTYPE><head></head><body>` + header content  
+ `views/page_footer.html` : footer content + `</body>`
+ `styles/pure.html` : [pure.css](http://purecss.io) (called in `page_header.html`)  
+ `scripts/script.html` : javascript file (called in `page_header.html`)  
+ `styles/style.html` : css file (called in `page_header.html`)  

#### `views/expire.html`
於登記期限之後，取代登記表單顯示的畫面。
