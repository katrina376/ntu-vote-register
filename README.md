# ntu-vote-register
Developed for Election &amp; Recalling Execution Community, NTU Students Association  
Designed by Hao-Yung Chan, 2016 Spring Semester  
Developed using GAS(Google Apps Script)  

code.gs : 主程式，可以改參數來抓不同的資料庫
+ SITESRC -- 網站網址
+ SPREADSHEETID -- 資料庫id
+ SPREADSHEETID_EXPORT -- 完成審核後匯出的資料庫id
+ TOCNAME -- 資料庫目錄標題
+ ELECTION -- 選舉名稱

form_OOOO.html : 不同的選舉表單，後面字串對應資料庫中不同選舉的分類。會呼叫以下檔案，匯入其他標籤。  

page_header.html: <!DOCTYPE><head></head><body> + header content  
page_footer.html: footer content + </body>  
pure.html : pure.css (called in page_header.html)  
script.html : js file (called in page_header.html)  
style.html : css file (called in page_header.html)  
