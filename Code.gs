// Reference Wokwi Project: https://wokwi.com/projects/390101282644204545
// Reference YouTube video: https://www.youtube.com/watch?v=u7TYu61l0t4
// Source code: https://drive.google.com/file/d/1650fl6l9afs2_QvLtxjDkTIP77LD9SM7/view
// Web App URL: https://script.google.com/macros/s/AKfycbz5I_b054Vq1oJZR1t_F763j0Fb5ta1u_upure5fQeGuSkskIKw-5YxAvQ4Fft-SI1A/exec
// DON'T USE PNJ ACCOUNT, USE PERSONAL EMAIL ACCOUNT INSTEAD!.

// Constants for Google Sheet ID and Sheet Name.
const SHEET_ID = '10ahD_GUE2ebamJ2kfBSvB5ndD5VfSDZ6henEgFErZkQ';  // CHANGE THIS WITH YOUR GOOGLE SHEETS ID.
const SHEET_NAME = 'Ammonia'; // CHANGE THIS WITH YOUR SHEET NAME.

// Remove unrelated characters.
function stripQuotes(value)
{
  return value.replace(/^["']|["']$/g, "");
}

// HTTP GET Request to receive data from 2 ESP32 nodes.
function doGet(e)
{
  Logger.log(JSON.stringify(e));
  let result = '';
  
  if (e.parameter == 'undefined')
  {
    result = 'Error: No parameters are passed!';
    return ContentService.createTextOutput("Error: No parameters are passed!");
  }
  else
  {
    const sheetOpen = SpreadsheetApp.openById(SHEET_ID);
    const sheetTarget = sheetOpen.getSheetByName(SHEET_NAME);

    if (!sheetTarget)
    {
      Logger.log("Sheet not found: " + SHEET_NAME);
      return ContentService.createTextOutput("Error: Sheet not found!.");
    }

    // Get the last rows.
    let newRow = sheetTarget.getLastRow() + 1;

    // Initiate the rows.
    let rowDataLog = [];
    let dataForA7;
    let dataForB7 = 0;
    let dataForC7 = 0;
    let dataForD7;
    let dataForE7;

    // Fill the dataForA7 with currentDateAndTime.
    let currentDateAndTime = Utilities.formatDate(new Date(), "Asia/Jakarta", 'dd/MM/YYYY HH:mm:ss');
    rowDataLog[0] = currentDateAndTime;
    dataForA7 = currentDateAndTime;

    // Initalize action param.
    let action = '';
    for (let param in e.parameter)
    {
      Logger.log('In for loop, param=' + param);
      var value = stripQuotes(e.parameter[param]);
      Logger.log(param + ':' + e.parameter[param]);
      switch (param) {
        case 'action':
          action = value;
          break;

        case 'ppm1':
          rowDataLog[1] = value;
          dataForB7 = parseFloat(value);
          result += 'Success: PPM1 value written on column B';
          break;

        case 'ppm2':
          rowDataLog[2] = value;
          dataForC7 = parseFloat(value);
          result += ', PPM2 value written on column C';
          break;

        default:
          result += ", unsupported parameter";
      }

      // Calculate average for D7
      rowDataLog[3] = (parseFloat(dataForB7) + parseFloat(dataForC7)) / 2;
      dataForD7 = (parseFloat(dataForB7) + parseFloat(dataForC7)) / 2;
      
      // Determine status for E7
      rowDataLog[4] = (parseFloat(dataForB7) > 0 && parseFloat(dataForC7) > 0) ? "Success" : "Incomplete";
      dataForE7 = (parseFloat(dataForB7) > 0 && parseFloat(dataForC7) > 0) ? "Success" : "Incomplete";

    }

    if (action == 'write')
    {
      Logger.log(JSON.stringify(rowDataLog));
      let newRangeDataLog = sheetTarget.getRange(newRow, 1, 1, rowDataLog.length);
      newRangeDataLog.setValues([rowDataLog]);

      // RangeDataLatest = sheetTarget.getRange('A7:E7');
      // RangeDataLatest.setValues([[dataForA7, dataForB7, dataForC7, dataForD7, dataForE7]]);

      return ContentService.createTextOutput(result);
    }
    
    if (action == 'read')
    {
      let statusSendData = sheetTarget.getRange('E7').getValues();
      return ContentService.createTextOutput(statusSendData);
    }

    return ContentService.createTextOutput('Invalid action');
  }
}
