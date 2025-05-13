import * as Consts from './dl-scheduling-constants'



//takes a list of serach values and finds all of those included in a whole set
const getOverlap = (searchValues: string[], wholeSet: string[]): number => {
    return searchValues.filter(value => wholeSet.includes(value)).length
}

export const getTeacherCoreSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherCore, headers)
}

export const getTeacherCoreGenEdSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherCoreGenEd, headers)
}

export const getTeacherCoreSepSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherCoreSep, headers)
}

export const getTeacherAdditionalSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherAdditional, headers) + getOverlap(Consts.teacherRLS, headers)
}

export const getAideCoreGenEdSpan = (headers: string[]):number => {
    return getOverlap(Consts.aideCoreGenEd, headers)
}

export const getAideCoreSeperateSpan = (headers: string[]):number => {
    return getOverlap(Consts.aideCoreSeperate, headers)
}

export const getAideAdditionalSpan = (headers: string[]):number => {
    return getOverlap(Consts.aideAdditional, headers)
}

export const getAideHolisticsSpan = (headers: string[]): number => {
    return getOverlap(Consts.aideHolistics, headers)
}

export const getInfoColumnSpan = (headers: string[]): number => {
    return getOverlap(Consts.infoColumns, headers)
}
