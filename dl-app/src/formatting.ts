
import * as Helpers from './formatting-helpers'


interface GridRange {
  "sheetId": number,
  "startRowIndex": number,
  "endRowIndex": number,
  "startColumnIndex": number,
  "endColumnIndex": number
}


export const addFormatting = (spreadsheet: gapi.client.sheets.Spreadsheet, headers: string[], nRows: number) => {
   // const spreadsheetId = spreadsheet.spreadsheetId;

    /*
        We need to add three rows to the top of the sheet for headers, merge appropriate columns and bold lines
        freeze top 4 rows
        freeze left two columns

    */
    const spreadsheetId = spreadsheet.spreadsheetId ? spreadsheet.spreadsheetId : ''

    const sheets = spreadsheet.sheets ? spreadsheet.sheets : []

    const sheetID = sheets[0] ? sheets[0].properties ? sheets[0].properties.sheetId ? sheets[0].properties.sheetId : 0 : 0 : 0 

    console.log("sheetId" + sheetID)


    
    const cellMerges = getCellMerges(headers, sheetID, nRows)

    
    const requests: Object[] = [
      {
        "insertDimension": {
          "range": {
            "sheetId": sheetID,
            "dimension": "ROWS",
            "startIndex": 0,
            "endIndex": 3
          },
          "inheritFromBefore": false
        }
      },
      {
        repeatCell: {
          range: {
            sheetId:sheetID,
            startRowIndex: 0,
            endRowIndex: 4
          },
          cell: {
            userEnteredFormat: {
              "horizontalAlignment" : "CENTER",
              "verticalAlignment" : "MIDDLE"
            },
            
          },
          fields: "userEnteredFormat(horizontalAlignment, verticalAlignment)"
        }
      },
      {
        repeatCell: {
          range: {
            sheetId:sheetID,
            startRowIndex: 3,
            endRowIndex: 4
          },
          cell: {
            userEnteredFormat: {
              textRotation: {angle: 90},
            },
            
          },
          fields: "userEnteredFormat(textRotation)"
        }
      },
      {
        "autoResizeDimensions": {
          "dimensions": {
            "sheetId": sheetID,
            "dimension": "COLUMNS",
            "startIndex": 0,
            "endIndex": headers.length
          }
        }
      },
    ]
    //add cell merges to requests
    Array.prototype.push.apply(requests,cellMerges); 

  
    var body:gapi.client.sheets.BatchUpdateSpreadsheetRequest = {requests: requests}
  
    window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: body
    }).then((response) => {
      console.log(`formatting and conditional formatting updated.`);
    });

  }


  const getCellMerges = (headers: string[], sheetID: number, nRows: number): Object[] => {

    /*
    teacher | core | teacher core gened
    teacher | core | teacher core seperate
    teacher | additional | teacher rls
    para | core |aide core gened
    para | core | aide core seperate
    para | aide holistics gened
    aide holistics seperate - FIXME split these later
    aide additional  
    */
   //FIXME aide holistics seperates

    let offset = Helpers.getInfoColumnSpan(headers)+1
    const infoFields = [0, offset]

    offset += Helpers.getTeacherCoreGenEdSpan(headers)
    const teacherCoreGenEd = [infoFields[1], offset]

    offset += Helpers.getTeacherCoreSepSpan(headers)
    const teacherCoreSep = [teacherCoreGenEd[1], offset]

    offset += Helpers.getTeacherAdditionalSpan(headers)
    const teacherRls = [teacherCoreSep[1], offset]

    offset += Helpers.getAideCoreGenEdSpan(headers)
    const aideCoreGened = [teacherRls[1], offset]

    offset += Helpers.getAideCoreSeperateSpan(headers)
    const aideCoreSeperate = [aideCoreGened[1], offset]

    offset += Helpers.getAideHolisticsSpan(headers)
    const aideHolisticsGened = [aideCoreSeperate[1], offset]

    offset += Helpers.getAideAdditionalSpan(headers)
    const aideAdditional = [aideHolisticsGened[1], offset]



    const cellMerges: Object[] = [
      //all teacher fields top row merge + label row 1
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 0, 1, teacherCoreGenEd[0], aideCoreGened[0]), "Teacher"),
      //merge teacher core classes + label, row 2
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 1, 2,teacherCoreGenEd[0], teacherCoreSep[1]), "Core"),

      //merge teacher core gened + label, row 3
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 2, 3, teacherCoreGenEd[0], teacherCoreGenEd[1]), "GenEd"),

      //add left border to first column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, teacherCoreGenEd[0], teacherCoreGenEd[0]+1),
        {"left": {"style": "SOLID_MEDIUM"}}),
      //add right border to last column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, teacherCoreGenEd[1]-1, teacherCoreGenEd[1]),
        {"right":{"style": "SOLID_MEDIUM"}}),

      //merge teacher core sep + label, row 3
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 2, 3,teacherCoreSep[0], teacherCoreSep[1]), "Seperate"),
      
      //add left border to first column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, teacherCoreSep[0], teacherCoreSep[0]+1),
        {"left": {"style": "SOLID_MEDIUM"}}),
      //add right border to last column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, teacherCoreSep[1]-1, teacherCoreSep[1]),
        {"right":{"style": "SOLID_MEDIUM"}}),
        
        
      //all aide fields top row + label row 1
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 0, 1, aideCoreGened[0], aideAdditional[1]), "Paraprofessional"),
      //aide core row 2
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 1, 2,aideCoreGened[0], aideCoreSeperate[1]), "Core"),
      //aide holistics row 2 
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 1, 2,aideHolisticsGened[0], aideHolisticsGened[1]), "Holistics"),
      //aide core gened row 3
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 2, 3,aideCoreGened[0], aideCoreGened[1]), "GenEd"),

      //add left border to first column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideCoreGened[0], aideCoreGened[0]+1),
        {"left":{"style": "SOLID_MEDIUM"}}),
      //add right border to last column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideCoreGened[1]-1, aideCoreGened[1]),
        {"right":{"style": "SOLID_MEDIUM"}}),

      //aide core seperate row 3
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 2, 3,aideCoreSeperate[0], aideCoreSeperate[1]), "Seperate"),

      //add left border to first column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideCoreSeperate[0], aideCoreSeperate[0]+1),
        {"left": {"style": "SOLID_MEDIUM"}}),
      //add right border to last column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideCoreSeperate[1]-1, aideCoreSeperate[1]),
        {"right":{"style": "SOLID_MEDIUM"}}),

      //aide holistic gened row 3
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 2, 3,aideHolisticsGened[0], aideHolisticsGened[1]), "GenEd"),

      //add left border to first column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideHolisticsGened[0], aideHolisticsGened[0]+1),
        {"left": {"style": "SOLID_MEDIUM"}}),
      //add right border to last column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideHolisticsGened[1]-1, aideHolisticsGened[1]),
        {"right": {"style": "SOLID_MEDIUM"}}),

      //aide holistic seperate row 3
      //...createBatchUpdateMergeandAddText(2, aideCoreSeperate[0], aideCoreSeperate[1], sheetID, "Seperate"),

      //aide additionals, rows 2-3
      ...createBatchUpdateHeaderCellFormat(
        makeRange(sheetID, 1, 3,aideAdditional[0], aideAdditional[1]), "Additional"),

      //add left border to first column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideAdditional[0], aideAdditional[0]+1),
        {"left": {"style": "SOLID_MEDIUM"}}),
      //add right border to last column item
      createBatchUpdateCellBoldBordersRequest(
        makeRange(sheetID, 3, nRows+3, aideAdditional[1]-1, aideAdditional[1]),
        {"right": {"style": "SOLID_MEDIUM"}}),
    ]
    return cellMerges
  }

  const makeRange = (id: number, startRow: number ,endRow: number, startCol: number, endCol: number):GridRange => {
    return {
      sheetId:id,
      startColumnIndex:startCol,
      startRowIndex: startRow,
      endColumnIndex: endCol,
      endRowIndex:endRow
    }
  }

  const createBatchUpdateHeaderCellFormat = (range: GridRange, text: string): Object[] => {
    return [
      createBatchUpdateCellMergeRequest(range),
      createBatchUpdateCellTextRequest(range, text),
      createBatchUpdateCellBoldBordersRequest(range)
    ]
  }

  //adds bold borders to all cells in the specified range
  const createBatchUpdateCellBoldBordersRequest = (range: GridRange, style?: Object):Object => {
    
    if (style !== undefined){
      return {
        "updateBorders": {
          "range": {
            ...range
          },
          ...style as any
        },
      }
    }

    return {
      "updateBorders": {
        "range": {
          ...range
        },
        "top": {
          "style": "SOLID_MEDIUM",
        },
        "bottom": {
          "style": "SOLID_MEDIUM",
        },
        "left": {
          "style": "SOLID_MEDIUM",
        },
        "right": {
          "style": "SOLID_MEDIUM",
        },
      },
    }
  }
  //merges cells in a range
  const createBatchUpdateCellMergeRequest = (range: GridRange):Object => {
    return {
      "mergeCells": {
        "range": {
          "sheetId": range.sheetId,
          "startRowIndex": range.startRowIndex,
          "endRowIndex": range.endRowIndex,
          "startColumnIndex": range.startColumnIndex,
          "endColumnIndex": range.endColumnIndex
        },
        "mergeType": "MERGE_ALL"
      }
    }
  }
  //adds text to cell at start
  const createBatchUpdateCellTextRequest = (range: GridRange, text: string): Object => {
    return {
        "updateCells":{
          "rows": [
            {
              "values": [
                {"userEnteredValue" : {"stringValue": text}}
              ]
            }
          ],
          "fields": "userEnteredValue",
          "range": {
            ...range
          },
        }
      }
  }