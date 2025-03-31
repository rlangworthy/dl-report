

export function createGoogleSheet(data : {[key:string]:string}[]) {

    const columns = Object.keys(data[0])
    const TITLE = "DL Scheduling Aid"

    var request = {
      properties: {
        title: "Chavez DL Scheduling Aid"
      },
      sheets: [
        {
          properties: {
            title: TITLE,
            gridProperties: {
              columnCount: columns.length,
              rowCount: data.length,
              frozenRowCount: 1,
            }
          },
        },      
      ],
    }
  
    window.gapi.client.sheets.spreadsheets.create({resource: request})
      .then((response) => {
        const spreadsheet = response.result
        const sheetID = spreadsheet.spreadsheetId ? spreadsheet.spreadsheetId : ''
        let values = [columns]
        data.forEach(row => {
          values.push(Object.values(row))
        })
        window.gapi.client.sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: sheetID,
          resource: {
            data: [{
              range: TITLE,
              values: values
            }],
            valueInputOption: "USER_ENTERED"
          }
        }).then(() => {
          const url = response.result.spreadsheetUrl
          window.open(url, "_blank")
        })
        
      });
  }
/*
export function formatSheet(sheet: gapi.client.sheets.Spreadsheet){
  const spreadsheetId = sheet.spreadsheetId ? sheet.spreadsheetId : 

  const requests = [
    // add an object for each basic formatting rule

    //add an object for each conditional formatting rule
  ];

  const body = {requests: requests}

  window.gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: body
  }).then((response) => {
    console.log(`formatting and conditional formatting updated.`);
  });
}*/