function onOpen() {
  SpreadsheetApp.getUi().createMenu("Material Manager")
    .addItem("Open Sidebar", "showSidebar")
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Material Issue Manager")
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("Index");
}


// Get unique material names from column C
function getMaterialList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getRange('C2:C' + sheet.getLastRow()).getValues();
  const materials = [...new Set(data.flat().filter(item => item))];
  return materials;
}

// Update quantity in G and date in H
function updateQuantity(materialName, addedQty) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const names = sheet.getRange('C2:C' + sheet.getLastRow()).getValues();
  const qtys = sheet.getRange('G2:G' + sheet.getLastRow()).getValues();

  for (let i = 0; i < names.length; i++) {
    if (names[i][0] === materialName) {
      let currentQty = parseFloat(qtys[i][0]) || 0;
      let newQty = currentQty + parseFloat(addedQty);
      sheet.getRange(i + 2, 7).setValue(newQty);        // Column G
      sheet.getRange(i + 2, 8).setValue(new Date());    // Column H
      return `✅ "${materialName}" updated. New quantity: ${newQty}`;
    }
  }
  return `❌ Material "${materialName}" not found.`;
}

// Create downloadable XLSX file from spreadsheet
function generateExcelDownloadLink() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const blob = ss.getBlob().getAs("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const file = DriveApp.createFile(blob).setName("Material_Stock.xlsx");
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}
