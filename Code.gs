// Reference Wokwi Project: https://wokwi.com/projects/390101282644204545
// Reference YouTube video: https://www.youtube.com/watch?v=u7TYu61l0t4
// Source code: https://drive.google.com/file/d/1650fl6l9afs2_QvLtxjDkTIP77LD9SM7/view
// Web App URL: https://script.google.com/macros/s/AKfycbyh3U4Ot9Yo26UjdX4z3HBwSK7D9kHXf3ajyovZWEkHlf7o02ZS61XCgeiTxXxefK0eOA/exec
// DON'T USE PNJ ACCOUNT, USE PERSONAL EMAIL ACCOUNT INSTEAD!.

// Remove unrelated characters.
function stripQuotes( value )
{
  return value.replace(/^["']|['"]$/g, "");
}

// HTTP GET Request to receive data from 2 ESP32 nodes.
function doGet(e)
{
  Logger.log(JSON.stringify(e));
  let result = "";
  if (!e || e.parameter == 'undefined')
  {
    result = 'No Parameters';
  }
  else
  {
    result = 'Ok';
    const SHEET_ID = '1gCYPZxckDK4Dhkb8G7LFAgqAv52jlYyzWHo3YGx7u04';  // CHANGE THIS WITH YOUR GOOGLE SHEETS ID.
    const SHEET_NAME = 'Ammonia';                                     // CHANGE THIS WITH YOUR SHEET NAME.

    let sheetOpen = SpreadsheetApp.openById(SHEET_ID);
    Logger.log("Spreadsheet Opened: " + sheetOpen.getName());

    let sheetTarget = sheetOpen.getSheetByName(SHEET_NAME);
    if (!sheetTarget)
    {
      Logger.log("Sheet not found: " + SHEET_NAME);
      return ContentService.createTextOutput("Error: Sheet not found.");
    }

    let newRow = sheetTarget.getLastRow()+1;

    // Initiate data for specific row and column.
    let rowDataLog = [];
    let dataForA7; // Current date and time.
    let dataForB7; // PPM value of sensor 1.
    let dataForC7; // PPM value of sensor 2.
    let dataForD7; // Average PPM values.
    let dataForE7; // Status sent sensor data.

    let currentDate = Utilities.formatDate(new Date(), "Asia/Jakarta", 'dd/MM/YYYY');
    let currentTime = Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:MM:ss");
    let currentDateAndTime = String(currentDate + " " + currentTime);
    rowDataLog[0] = currentDateAndTime;
    dataForA7 = currentDateAndTime;

    let actionValue = '';
    for (let param in e.parameter)
    {
      Logger.log("In for loop, param=" + param);
      let value = stripQuotes(e.parameter[param]);
      Logger.log(param + ":" + e.parameter[param]);
      switch(param)
      {
        case 'action':
          actionValue = value;
          break;

        case 'ppm1':
          rowDataLog[1] = value;
          dataForB7 = value;
          result += ', PPM from Node 1 written on column B';
          break;
        
        case 'ppm2':
          rowDataLog[2] = value;
          dataForC7 = value;
          result += ', PPM from Node 2 written on column C';
          break;

        default:
          result += ", unsupported parameter";
      }
    }

    // Conditions for writing data received from ESP32 to Google Sheets.
    if (actionValue == 'write')
    {
      // Divide PPM value 1 and PPM value 2 to get the average.
      dataForD7 = (dataForB7 + dataForC7) / 2;

      // Add text success after write data to Sheet.
      dataForE7 = "Success";

      // Writes data to the "DHT11 Sensor Data Logger" section.
      Logger.log(JSON.stringify(rowDataLog));
      let newRangeDataLog = sheetTarget.getRange(newRow, 1, 1, rowDataLog.length);
      newRangeDataLog.setValues([rowDataLog]);
      
      // Write the data to the "Latest DHT11 Sensor Data" section.
      let RangeDataLatest = sheetTarget.getRange('A7:E7');
      RangeDataLatest.setValues([[dataForA7, dataForB7, dataForC7, dataForD7, dataForE7]]);

      return ContentService.createTextOutput(result);
    }
    
    // Conditions for sending data to ESP32 when ESP32 reads data from Google Sheets.
    if (actionValue == 'read')
    {
      // Use the line of code below if you want ESP32 to read data from columns I3 to O3 (Date,Time,Sensor Reading Status,Temperature,Humidity,Switch 1, Switch 2).
      // let statusSendData = sheetTarget.getRange('I3:O3').getDisplayValues();
      
      // Use the line of code below if you want ESP32 to read data from columns K3 to O3 (Sensor Reading Status,Temperature,Humidity,Switch 1, Switch 2).
      let statusSendData = sheetTarget.getRange('E7').getValues();
      return ContentService.createTextOutput(statusSendData);
    }
  }
}