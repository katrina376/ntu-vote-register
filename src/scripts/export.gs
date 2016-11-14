function processExport() {
  var timestamp = new Date();
  var toc = rangelist(DB_ID, TOC_NAME);

  for (var id in toc) {
    var title = toc[id]['Title'].getValue();
    var title_text = title;
    var data = rangelist(DB_ID, title);

    var export_sheet = openSheet(DB_EXPORT_ID, title);
    var items = export_sheet.getRange("1:1").getValues()[0];

    for (var key in data) {
      if (key.length == 0) continue;
      if (data[key]['Export'].getValue()) continue;

      if (data[key]['Result'].getValue()) {
        var row = [];
        row.push(0);
        row.push(key);

        for (var i = 0; i != items.length; ++i){
          if (data[key][items[i]])
            row.push(data[key][items[i]].getValue());
        }
        row.push(timestamp);

        export_sheet.appendRow(row);
        data[key]['Export'].setValue(true);
      }
    }
  }
}
