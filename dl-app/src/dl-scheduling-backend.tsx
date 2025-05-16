
import {
    RawStudentSpecialEdInstructionRow,
    RawStudentParaprofessionalMinutesRow,
    } from './file-interfaces'

import {
    finalColumns,
    displayInfo,
    dropColumns,
    DLScheduleOutput
    } from './dl-scheduling-constants'

import { parseGrade } from './formatting-helpers'


    const isNumeric = (str: unknown) => {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }

    export const createDLScheduleDoc = (sped: RawStudentSpecialEdInstructionRow[], 
        aide: RawStudentParaprofessionalMinutesRow[]):DLScheduleOutput => {
        
            /*
        Clear unused columns for sped and aide
        Create a boolean for each column defaulting to true
        check each row for vaild input in each true column
        if a valid input exists change column to false
        go through and remove columns
        Takes a key (studentID in this case) to index object to make merging easy later
        Return list of used keys to simplify final sheet creation
        */
        const dropUnusedColumns = (array: {[key: string]: string}[], keyCol: string): [{[key: string]:{[key: string]: string}}, string[]] => {
            const usedColumns: {[key:string]:boolean} = {}
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
            const newKeys: string[] = Object.keys(usedColumns).filter(k => usedColumns[k] && !dropColumns.includes(k))
            const newArray: {[key: string]: {[key: string]: string}} = {}
            array.forEach(row => {
                newArray[row[keyCol]] = newKeys.reduce((obj, key) => {
                    obj[key] = row[key]
                    return obj
                }, {} as {[key: string]: string})
            })
            return [newArray, newKeys]
        }
    
        const [filteredSped, spedKeys] = dropUnusedColumns(sped.filter(row => row.PDIS !== '--') as {[key: string]:any}[], 'Student ID')
        const [filteredAide, aideKeys] = dropUnusedColumns(aide.filter(row => row.PDIS !== '--') as {[key: string]:any}[], 'Student ID')
    
        const finalUsedColumns = finalColumns.filter(value => spedKeys.includes(value) || aideKeys.includes(value))
        const joinedMinutes:{[key:string]: string}[] = []
        //create joined sped & aide rows, ordered sped keys for student ID's
        
        
    
        Object.keys(filteredSped)
        .sort((a,b) => {
            if(filteredSped[a].Grade !== filteredSped[b].Grade){
                
                return parseGrade(filteredSped[a].Grade) > parseGrade(filteredSped[b].Grade) ? -1:1
            }
            return parseInt(filteredSped[a]['ARS']) < parseInt(filteredSped[b]['ARS']) ? -1:1
        })
        .forEach(studentID => {
            //remove students with no assigned minutes
            // this doc is for scheduling and they have nothing to schedule
            // Could be done earlier for efficiency, shouldn't be an issue
            //FIXME - use total columns to filter, ARS doesnt include 
            if(filteredSped[studentID]['ARS'] === '0' || 
                    filteredSped[studentID]['ARS'] === '##'){
                        return
                    }
            const combinedStudent:{[key:string]: string} = {}
            displayInfo.forEach( key => {
                
                if(filteredSped[studentID][key]){
                    combinedStudent[key] = filteredSped[studentID][key]
                }
                //ELL code remove N/A values
                if(combinedStudent[key] === 'N/A' || 
                    combinedStudent[key] ==='0' || 
                    combinedStudent[key]==='##'){
                    combinedStudent[key] = ''
                }
            })
            finalUsedColumns.forEach(key => {
                if(filteredSped[studentID][key]){
                    combinedStudent[key] = filteredSped[studentID][key]
                }else if((filteredAide[studentID]) && (filteredAide[studentID][key])){
                    combinedStudent[key] = filteredAide[studentID][key]
                } else {
                    combinedStudent[key] = ''
                }
                //remove ## values and 0's for consistency
                if(combinedStudent[key] === '##' ||
                    combinedStudent[key] ==='0' ||
                    combinedStudent[key] === '0.00')
                {
                    combinedStudent[key] = ''
                }
                if(isNumeric(combinedStudent[key])){
                    combinedStudent[key] = (parseInt(combinedStudent[key])/5).toString()
                }
                
            })
            joinedMinutes.push({...combinedStudent})
        })
        
        
        console.log(joinedMinutes)
        return {data: joinedMinutes, gradeCount:getGradeCounts(joinedMinutes)}
    }


    const getGradeCounts = (joinedMinutes: {[key:string]:string}[]): {[key:string]:number} => {
        const grades:{[key:string]:number} = {}
        joinedMinutes.forEach(student => {
            
            if(student["Grade"] !== undefined){
                if(grades[student["Grade"]] == undefined){
                    grades[student["Grade"]] = 0
                }
                grades[student["Grade"]] += 1
            }
        })
        return grades
    }
