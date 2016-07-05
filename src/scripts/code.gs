/* PARAMETERS */
var SITESRC = ''
var SPREADSHEETID = '';
var SPREADSHEETID_EXPORT = '';
var TOCNAME = '';
var ELECTION = '';

/* VARIABLES */
var DB = SpreadsheetApp.openById(SPREADSHEETID);
var DB_EXPORT = SpreadsheetApp.openById(SPREADSHEETID_EXPORT);
var TOC = openSheet(DB, TOCNAME).getDataRange()
var TID = 0;
var TITLE = '';
var TYPE = '';
var DIRID_ENROLLMENT = '';
var DIRID_PHOTO = '';
var DIRID_VERIFICATION = '';
var TEMPLATEID = '';
var BGCOLOR = '';
var SHEET;
var ITEMS;
var PRESENTATIONS;
var SEATS;
var QUALIFICATIONS;

/* FUNCTIONS */
/////////////// GETS

function doGet(e)
{
    TID = (e.parameter.id) ? e.parameter.id : 1;
    TID = ((TID > (TOC.getValues().length - 1)) || (TID < 1)) ? 1 : TID;

    TITLE = TOC.getValues()[TID][1];
    TYPE = TOC.getValues()[TID][2];
    BGCOLOR = TOC.getBackgrounds()[TID][3];
    QUALIFICATIONS = TOC.getValues()[TID][4];
    SEATS = TOC.getValues()[TID][5];
    PRESENTATIONS = TOC.getValues()[TID][6];
    if (PRESENTATIONS)
    {
        var tmp = PRESENTATIONS.split(';\n');
        for (var i = 0; i != tmp.length; ++i)
            tmp[i] = tmp[i].split(',');
        PRESENTATIONS = tmp;
    }

    var now = new Date();

    // Set expire time for different cases
    var expire = new Date(2016, 4, 2, 0, 0, 0, 0);
    if (((TID != 12) && (TID != 14)) && (now >= expire))
        return HtmlService.createTemplateFromFile('expire').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);

    var expire = new Date(2016, 4, 5, 0, 0, 0, 0);
    if ((TID == 12) && (now >= expire))
        return HtmlService.createTemplateFromFile('expire').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);

    var expire = new Date(2016, 4, 6, 0, 0, 0, 0);
    if ((TID == 14) && (now >= expire))
        return HtmlService.createTemplateFromFile('expire').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);

    return HtmlService.createTemplateFromFile('form_' + TYPE).evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename)
{
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function electionTitle()
{
    return ELECTION;
}

function declareTitle()
{
    return TITLE;
}

function siteSrc()
{
    return SITESRC;
}

function getTid()
{
    return TID;
}

function settingBGColor()
{
    return BGCOLOR;
}

function getSeat()
{
    return SEATS;
}

function getQualification()
{
    return QUALIFICATIONS;
}

function presentationList()
{
    return PRESENTATIONS;
}

/////////////// DOES

function openSheet(dbSS, sheetname)
{
    if (dbSS.getSheetByName(sheetname) != null)
        return dbSS.getSheetByName(sheetname);
    else
        return null;
}

function openDir(dirName)
{
    if (DriveApp.getFolderById(dirName) != null)
        return DriveApp.getFolderById(dirName);
    else
        return null;
}

function processForm(fObj)
{
    var timestamp = new Date();

    TID = fObj.tid;

    TITLE = TOC.getValues()[TID][1];
    QUALIFICATIONS = TOC.getValues()[TID][4];
    PRESENTATIONS = TOC.getValues()[TID][6];
    if (PRESENTATIONS)
    {
        var tmp = PRESENTATIONS.split(';');
        for (var i = 0; i != tmp.length; ++i)
            tmp[i] = tmp[i].split(',');
        PRESENTATIONS = tmp;
    }

    DIRID_ENROLLMENT = TOC.getValues()[TID][7];
    DIRID_PHOTO = TOC.getValues()[TID][8];
    DIRID_VERIFICATION = TOC.getValues()[TID][9];
    TEMPLATEID = TOC.getValues()[TID][10];

    SHEET = openSheet(DB, TITLE);
    ITEMS = SHEET.getDataRange().getValues()[0];

    var file_ver = DriveApp.getFileById(TEMPLATEID).makeCopy(fObj.Key, openDir(DIRID_VERIFICATION));
    file_ver.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var docname = fObj.Key;
    var sstmp = [];

    for (var i = 0; i != ITEMS.length; ++i)
    {
        var pname = (ITEMS[i].split('_').length > 1) ? (ITEMS[i].split('_')[0] + '_') : '';
        var itemname = (ITEMS[i].split('_').length > 1) ? ITEMS[i].split('_')[1] : ITEMS[i];

        if (itemname == 'Name')
            docname += ('_' + eval("fObj." + ITEMS[i]));

        if ((eval("fObj." + ITEMS[i])) || (itemname == 'Presentation'))
        {
            if (itemname == 'Enrollment')
            {
                var dir_enr = openDir(DIRID_ENROLLMENT);
                var file_enr = dir_enr.createFile(eval("fObj." + pname + "Enrollment"));
                file_enr.setName(eval("fObj.Key + '_" + pname + "' + fObj." + pname + "Name"));
                sstmp.push('https://drive.google.com/file/d/' + file_enr.getId());
            }
            else if (itemname == 'Photo')
            {
                var dir_pho = openDir(DIRID_PHOTO);
                var file_pho = dir_pho.createFile(eval("fObj." + pname + "Photo"));
                file_pho.setName(eval("fObj.Key + '_" + pname + "' + fObj." + pname + "Name"));
                sstmp.push('https://drive.google.com/file/d/' + file_pho.getId());
            }
            else if (itemname == 'Phone')
            {
                var p = '';
                if (eval("fObj." + ITEMS[i] + ".length") < 11) {
                    var np = eval("fObj." + ITEMS[i]).toString().split("");
                    for (var j = 0; j != np.length; ++j) {
                        p += np[j];
                        if ((j % 3 == 0) && (j > 1) && (j < 8))
                            p += '-';
                    }
                }
                else
                    p = eval("fObj." + ITEMS[i]);

                sstmp.push(p);
            }
            else if (itemname == 'Presentation')
            {
                var sheetstr;

                if (PRESENTATIONS)
                {
                    if (eval("fObj." + ITEMS[i]))
                    {
                        sheetstr = '';
                        for (var j = 0; j != eval("fObj." + ITEMS[i] + ".length"); ++j)
                            sheetstr += (eval("fObj." + ITEMS[i] + "[" + j + "]") + ",");
                    } else
                        sheetstr = 'x';
                }
                else
                    sheetstr = false;

                sstmp.push(sheetstr);
            }
            else
            {
                sstmp.push(eval("fObj." + ITEMS[i]));
            }
        }
    }

    sstmp.push(timestamp);
    sstmp.push('https://docs.google.com/document/d/' + file_ver.getId());
    sstmp.push(false);

    file_ver.setName(docname);
    SHEET.appendRow(sstmp);
}
