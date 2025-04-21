export const addFormatting = (spreadsheet: gapi.client.sheets.Spreadsheet) => {
   // const spreadsheetId = spreadsheet.spreadsheetId;

    /*
        We need to add three rows to the top of the sheet for headers, merge appropriate columns and bold lines
        freeze top 4 rows
        freeze left two columns

    */
    const spreadsheetId = spreadsheet.spreadsheetId ? spreadsheet.spreadsheetId : ''

    const sheets = spreadsheet.sheets ? spreadsheet.sheets : []

    const sheetID = sheets[0] ? sheets[0].properties ? sheets[0].properties.sheetId ? sheets[0].properties.sheetId : 0 : 0 : 0 

    
    const requests: Object[] = []
  
    var body:gapi.client.sheets.BatchUpdateSpreadsheetRequest = {requests: requests}
  
    window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: body
    }).then((response) => {
      console.log(`formatting and conditional formatting updated.`);
    });

  }