/* VARIABLES */
var toc;
var tid;

/* FUNCTIONS */
/////////////// GETS
function doGet(e) {
  toc = rangelist(DB_ID, TOC_NAME);

  tid = (e.parameter.id) ? e.parameter.id : 1;
  tid = (tid in toc) ? tid : 1;

  var current = new Date();
  if (current > toc[tid]["Expire"].getValue()) {
    return HtmlService.createTemplateFromFile('expire')
                      .evaluate()
                      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                      .setTitle(ELECTION_TITLE + " " + getDeclareTitle() + "選舉登記 - 臺大學生會選委會")
                      .addMetaTag('viewport', 'width=device-width, initial-scale=1, user-scalable=yes');
  } else {
    return HtmlService.createTemplateFromFile('form_' + toc[tid]["Type"].getValue())
                      .evaluate()
                      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                      .setTitle(ELECTION_TITLE + " " + getDeclareTitle() + "選舉登記 - 臺大學生會選委會")
                      .addMetaTag('viewport', 'width=device-width, initial-scale=1, user-scalable=yes');;
  }
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function getElectionConfigRangelist(id) {
  return;
}

function getElectionTitle() {
  return ELECTION_TITLE;
}

function getLogoSrc() {
  return LOGO_SRC;
}

function getDeclareTitle() {
  return toc[tid]["Title"].getValue();
}

function getTid() {
  return tid;
}

function setBGColor() {
  return toc[tid]["BGColor"].getBackgrounds();
}

function getSeats() {
  return toc[tid]["Seats"].getValue();
}

function getQualification() {
  return toc[tid]["Qualification"].getValue();
}

function getPresentations() {
  var arr = '';

  if (toc[tid]["Presentations"].getValue()) {
    arr = toc[tid]["Presentations"].getValue().split(';\n');
    for (var i = 0; i != arr.length; ++i) {
      arr[i] = arr[i].split(',');
    }
  }

  return arr;
}

function getWarnings() {
  var arr = '';

  if (toc[tid]["Warnings"].getValue()) {
    arr = toc[tid]["Warnings"].getValue().split(';\n');
  }

  return arr;
}

/////////////// DOES

function processForm(f) {
  var timestamp = new Date();

  var tid = f.tid;
  var toc = rangelist(DB_ID, TOC_NAME);

  var title = toc[tid]['Title'].getValue();
  var has_presentations = toc[tid]['Presentations'].getValue();

  var dir_id = {
    'Enrollment'  : toc[tid]['Enrollment'].getValue(),
    'Photo'       : toc[tid]['Photo'].getValue(),
    'Verification': toc[tid]['Verification'].getValue(),
  }

  var file_template_id = toc[tid]['Template'].getValue();

  var sheet = openSheet(DB_ID, title);
  var items = sheet.getRange("1:1").getValues()[0];

  var file_verification = DriveApp.getFileById(file_template_id).makeCopy(f.Key, openDir(dir_id["Verification"]));
  file_verification.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var docname = f.Key;
  var row = [];

  for (var i = 0; i != items.length; ++i) {
    if (!items[i]) continue;
    if (!eval("f." + items[i])) continue;

    /* Consider Joint Cases */
    var pname = (items[i].split('_').length > 1) ? (items[i].split('_')[0] + '_') : '';
    var itemname = (items[i].split('_').length > 1) ? items[i].split('_')[1] : items[i];

    if (itemname === 'Name') {
      docname += ('_' + eval("f." + items[i]));
    }

    if (eval("f." + items[i])) {
      if ((itemname === 'Enrollment') || (itemname === 'Photo')) {
        var dir = openDir(dir_id[itemname]);
        var file = dir.createFile(eval("f." + items[i]));

        file.setName(eval("f.Key + '_" + pname + "' + f." + pname + "Name"));

        row.push('https://drive.google.com/open?id=' + file.getId());
      } else if (itemname === 'Phone') {
        var phone = '';
        var raw = eval("f." + items[i] + ".toString().split('')");

        for (var d in raw) {
          if ((phone.length === 0) && (raw[d] !== "0")) phone += '0';
          if ((phone.length === 4) && (raw[d] !== '-')) phone += '-';
          if ((phone.length === 8) && (raw[d] !== '-')) phone += '-';
          phone += raw[d];
        }

        row.push(phone);
      } else if (itemname === 'Presentation') {
        var str = '';
        if (has_presentations) {
          if (eval("f." + items[i] + ".length") > 1) {
            for (var j = 1; j != eval("f." + items[i] + ".length"); ++j) {
              str += (eval("f." + items[i] + "[" + j + "]") + ",");
            }
          } else {
            str = 'x';
          }
          row.push(str);
        }
      } else {
        row.push(eval("f." + items[i]));
      }
    }
  }

  row.push(timestamp);
  row.push('https://drive.google.com/open?id=' + file_verification.getId());
  row.push(false);

  file_verification.setName(docname);
  sheet.appendRow(row);
}
