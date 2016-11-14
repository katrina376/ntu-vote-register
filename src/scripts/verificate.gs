function processVerification() {
  var timestamp = new Date();
  var toc = rangelist(DB_ID, TOC_NAME);

  for (var id in toc) {
    var title = toc[id]['Title'].getValue();
    var title_text = title;
    var data = rangelist(DB_ID, title);

    for (var key in data) {
      if (key.length == 0) continue;
      if (data[key]['Update'].getValue()) continue;

      var doc = DocumentApp.openById(data[key]['Verification'].getValue().split("id=")[1]);
      var table = doc.getBody().getTables()[0];

      for (var item in data[key]) {
        var pname = (item.split('_').length > 1) ? (item.split('_')[0] + '_') : '';
        var itemname = (item.split('_').length > 1) ? item.split('_')[1] : item;

        if ((itemname == 'Enrollment') || (itemname == 'Photo')) {
          var file_id = data[key][item].getValue().split("id=")[1];
          var img = DriveApp.getFileById(file_id).getThumbnail();
          if (!img) {
            img = DriveApp.getFileById(file_id).getBlob();
          }

          // Scan Table
          for (var r = 0; r != table.getNumRows(); ++r) {
            var breakout = false;
            for (var c = 0; c != table.getRow(r).getNumCells(); ++c) {
              if (table.getCell(r, c).getChild(0).asText().getText() != ("{{ " + item + " }}")) continue;

              try {
                var insertted = table.getCell(r, c).appendImage(img);
                table.getCell(r, c).replaceText("{{ " + item + " }}", "");

                if (itemname == 'Enrollment') {
                  var h = insertted.getHeight() * 400 / insertted.getWidth();
                  insertted.setHeight(h).setWidth(400);
                } else {
                  var h = insertted.getHeight() * 180 / insertted.getWidth();
                  insertted.setHeight(h).setWidth(180);
                }
              } catch (err) {
                table.getCell(r, c).replaceText("{{ " + item + " }}", "無法顯示預覽。");
              }

              breakout = true;
              break;
            }

            if (breakout) break;
          }
        } else if (itemname == 'Presentation') {
          var text = '';
          if (!data[key][item].getValue()) {
            text = "委辦單位未委託辦理政見發表。";
            continue;
          }

          var list = toc[id]['Presentations'].getValue().split(";\n");
          var check = data[key][item].getValue().split(",");

          for (var n = 0; n != list.length; ++n) {
            var head = '【　】';
            var option = list[n].split(",");
            for (var p = 0; p != check.length; ++p) {
              if (check[p] == option[0])
                head = "【ｖ】";
            }

            text += (head + option[1] + "\n");
          }

          doc.getBody().replaceText("{{ " + item + " }}", text);
        } else if (itemname == 'College')
          title_text += "（" + data[key][item].getValue() + "）";
        else
          doc.getBody().replaceText("{{ " + item + " }}", data[key][item].getValue());
      }

      doc.getBody().replaceText('{{ Election }}', title);
      doc.getBody().replaceText('{{ Qualification }}', toc[id]['Qualification'].getValue());
      doc.saveAndClose();
      data[key]['Update'].setValue(true);
    }
  }
}
