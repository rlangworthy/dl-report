
import {
    RawStudentSpecialEdInstructionRow,
    RawStudentParaprofessionalMinutesRow,
    } from './file-interfaces'

import {
    final_columns,
    display_info,
    drop_columns
    } from './dl-scheduling-constants'


export const createDLScheduleDoc = 
    (sped: RawStudentSpecialEdInstructionRow[], 
    aide: RawStudentParaprofessionalMinutesRow[]):{[key:string]:string}[] => {
    /*
    Clear unused columns for sped and aide
    Create a boolean for each column defaulting to true
    check each row for vaild input in each true column
    if a valid input exists change column to false
    go through and remove columns
    Takes a key (studentID in this case) to index object to make merging easy later
    */
    const dropUnusedColumns = (array: {[key: string]: string}[], keyCol: string): {[key: string]:{[key: string]: string}} => {
        const usedColumns: {[key:string]: boolean} = {}
        Object.keys(array[0]).forEach(key => {usedColumns[key] = false})
        array.forEach(row => {
            Object.keys(row).forEach(key => {
                if(!usedColumns[key]){
                    if(row[key] !== '0' && row[key] !== '##' && row[key] !== '' && row[key] !== ' '){
                        usedColumns[key] = true
                    }
                }
            })
        })
        const newKeys: string[] = Object.keys(usedColumns).filter(k => usedColumns[k] && !drop_columns.includes(k))
        const newArray: {[key: string]: {[key: string]: string}} = {}
        array.forEach(row => {
            newArray[row[keyCol]] = newKeys.reduce((obj, key) => {
                obj[key] = row[key]
                return obj
            }, {} as {[key: string]: string})
        })
        return newArray
    }

    const filteredSped = dropUnusedColumns(sped.filter(row => row.PDIS !== '--') as {[key: string]:any}[], 'Student ID')
    const filteredAide = dropUnusedColumns(aide.filter(row => row.PDIS !== '--') as {[key: string]:any}[], 'Student ID')

    const joinedMinutes:{[key:string]: string}[] = []
    console.log(filteredSped)
    console.log(filteredAide)
    //create joined sped & aide rows
    Object.keys(filteredSped).forEach(studentID => {
        const combinedStudent: {[key:string]: string}  = {}
        display_info.forEach( key => {
            if(filteredSped[studentID][key]){
                combinedStudent[key] = filteredSped[studentID][key]
            }
        })
        final_columns.forEach(key => {
            if(filteredSped[studentID][key]){
                combinedStudent[key] = filteredSped[studentID][key]
            } else if(filteredAide[studentID] && filteredAide[studentID][key]){
                combinedStudent[key] = filteredAide[studentID][key]
            }
        })
        

        joinedMinutes.push(combinedStudent)
    })
    return joinedMinutes
}