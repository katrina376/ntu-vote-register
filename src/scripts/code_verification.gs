/* FUNCTIONS */
function processVerification()
{
    var date = new Date();

    var titles = [];
    var presentations = [];
    var qualifications = [];

    for (var i = 1; i != TOC.getValues().length; ++i)
    {
        titles.push(TOC.getValues()[i][1]);
        presentations.push(TOC.getValues()[i][6]);
        qualifications.push(TOC.getValues()[i][4]);
    }

    // Check Verification Export
    for (var i = 0; i != titles.length; ++i)
    {
        SHEET = openSheet(DB, titles[i]);
        var field = SHEET.getDataRange().getValues();
        ITEMS = field[0];

        var exportid = 0;
        for (var j = 0; j != ITEMS.length; ++j)
        {
            if (ITEMS[j] == "Export")
            {
                exportid = j;
                break;
            }
        }

        // Check Latest Verification Update

        var checkpoint = SHEET.getRange(SHEET.getLastRow(), exportid + 1).getValue();
        if ((checkpoint) || (SHEET.getLastRow() == 1))
            continue; // Go to next sheet

        var start = 0;
        for (var k = 1; k != field.length; ++k)
        {
            if (!field[k][exportid])
            {
                start = k; // Find last update
                break;
            }
        }

        // Update export file
        for (var k = start; k != field.length; ++k)
        {
            var docurl;
            for (var m = 0; m != ITEMS.length; ++m)
            {
                if (ITEMS[m] == 'Verification')
                    docurl = field[k][m] + "/edit";
            }

            var doc = DocumentApp.openByUrl(docurl);
            var table = doc.getBody().getTables()[0];

            TITLE = titles[i];
            for (var m = 0; m != ITEMS.length; ++m)
            {
                var pname = (ITEMS[m].split('_').length > 1) ? (ITEMS[m].split('_')[0] + '_') : '';
                var itemname = (ITEMS[m].split('_').length > 1) ? ITEMS[m].split('_')[1] : ITEMS[m];

                if ((itemname == 'Enrollment') || (itemname == 'Photo'))
                {
                    var fileid = field[k][m].split("/")[field[k][m].split("/").length - 1];
                    var img = DriveApp.getFileById(fileid).getThumbnail();
                    if (!img) {
                        img = DriveApp.getFileById(fileid).getBlob();
                    }

                    // Scan Table
                    for (var r = 0; r != table.getNumRows(); ++r)
                    {
                        var breakout = false;
                        for (var c = 0; c != table.getRow(r).getNumCells(); ++c)
                        {
                            if (table.getCell(r, c).getChild(0).asText().getText() != ("{{ " + ITEMS[m] + " }}")) continue;

                            try
                            {
                                var insertted = table.getCell(r, c).appendImage(img);
                                table.getCell(r, c).replaceText("{{ " + ITEMS[m] + " }}", "");

                                if (itemname == 'Enrollment')
                                {
                                    var h = insertted.getHeight() * 400 / insertted.getWidth();
                                    insertted.setHeight(h).setWidth(400);
                                }
                                else
                                {
                                    var h = insertted.getHeight() * 180 / insertted.getWidth();
                                    insertted.setHeight(h).setWidth(180);
                                }
                            }
                            catch (err)
                            {
                                table.getCell(r, c).replaceText("{{ " + ITEMS[m] + " }}", "無法顯示預覽。");
                            }

                            breakout = true;
                            break;
                        }
                        if (breakout) break;
                    }
                }
                else if (itemname == 'Presentation')
                {
                    var ttmp = '';
                    if (!field[k][m])
                    {
                        ttmp = "委辦單位未委託辦理政見發表。";
                        continue;
                    };

                    var plst = presentations[i].split(";\n");
                    var ctmp = field[k][m].split(",");

                    for (var n = 0; n != plst.length; ++n)
                    {
                        var htmp = '【　】';
                        var ptmp = plst[n].split(",");
                        for (var p = 0; p != ctmp.length; ++p)
                        {
                            if (ctmp[p] == ptmp[0])
                                htmp = "【ｖ】";
                        }

                        ttmp += (htmp + ptmp[1] + " - " + ptmp[2] + "\n");
                    }

                    doc.getBody().replaceText("{{ " + ITEMS[m] + " }}", ttmp);
                }
                else if (itemname == 'College')
                    TITLE += "（" + field[k][m] + "）";
                else
                    doc.getBody().replaceText("{{ " + ITEMS[m] + " }}", field[k][m]);
            }

            doc.getBody().replaceText('{{ Election }}', TITLE);
            doc.getBody().replaceText('{{ Qualification }}', qualifications[i]);
            doc.saveAndClose();

            SHEET.getRange(k + 1, exportid + 1).setValue(true);
        }
    }
    return;
}
