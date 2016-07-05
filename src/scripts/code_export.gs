function processExport()
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

        var resultid = 0;
        var sendid = 0;
        for (var j = 0; j != ITEMS.length; ++j)
        {
            if (ITEMS[j] == "Result")
            {
                resultid = j;
                sendid = resultid + 1;
                break;
            }
        }

        // Check Latest Result Update

        var checkpoint = SHEET.getRange(SHEET.getLastRow(), sendid + 1).getValue();
        if ((checkpoint) || (SHEET.getLastRow() == 1))
            continue; // Go to next sheet

        SHEET_EXPORT = openSheet(DB_EXPORT, titles[i]);

        var start = 0;
        for (var k = 1; k != field.length; ++k)
        {
            if (!field[k][sendid])
            {
                start = k; // Find last update
                break;
            }
        }

        // Update export file
        for (var k = start; k != field.length; ++k)
        {
            if (!field[k][resultid])
                continue;

            // Get Verification Result Number
            if (field[k][resultid] == 1)
            {
                var stmp = [];
                stmp.push(0); // Number Default

                for (var m = 0; m != resultid - 1; ++m)
                    stmp.push(field[k][m])

                stmp.push(date);

                SHEET_EXPORT.appendRow(stmp);
            }
            SHEET.getRange(k + 1, sendid + 1).setValue(true);
        }
    }
}
