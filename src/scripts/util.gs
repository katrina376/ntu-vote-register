function openSheet(id, sheetname) {
    return SpreadsheetApp.openById(id).getSheetByName(sheetname);
}

function openDir(dirName) {
    return DriveApp.getFolderById(dirName);
}

function rangelist(db, name) {
  var table = openSheet(db, name);
  var items = table.getRange("1:1").getValues();
  var nums = table.getRange("A:A").getValues();

  var res = {};

  for (var row = 1; row < nums.length; ++row) {
    var rowObj = {};
    var num = nums[row][0];

    for (var col = 1; col < items[0].length; ++col) {
      var item = items[0][col];
      rowObj[item] = table.getRange(row+1,col+1);
    }

    res[num] = rowObj;
  }

  return res;
}

function getLen(r) {
  var len = 0;

  for (var k in r) {
    len++;
  }

  return len;
}
