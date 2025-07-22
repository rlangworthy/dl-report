import * as Consts from './dl-scheduling-constants'

export const parseGrade = (a: string): number => {
            if(a === 'K'){
                return 0
            }
            if(a === 'PK'){
                return -1
            }
            return parseInt(a)
        }

//takes a list of serach values and finds all of those included in a whole set
const getOverlap = (searchValues: string[], wholeSet: string[]): number => {
    return searchValues.filter(value => wholeSet.includes(value)).length
}

export const getTeacherCoreSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherCore, headers)
}

export const getTeacherCoreInclusionSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherCoreInclusion, headers)
}

export const getTeacherCoreSepSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherCoreSep, headers)
}

export const getTeacherAdditionalSpan = (headers: string[]):number => {
    return getOverlap(Consts.teacherAdditional, headers) + getOverlap(Consts.teacherRLS, headers)
}

export const getAideCoreInclusionSpan = (headers: string[]):number => {
    return getOverlap(Consts.aideCoreInclusion, headers)
}

export const getAideCoreSeparateSpan = (headers: string[]):number => {
    return getOverlap(Consts.aideCoreSeparate, headers)
}

export const getAideAdditionalSpan = (headers: string[]):number => {
    return getOverlap(Consts.aideAdditional, headers)
}

export const getAideHolisticsInclusionSpan = (headers: string[]): number => {
    return getOverlap(Consts.aideHolisticsInclusion, headers)
}

export const getAideHolisticsSeparateSpan = (headers: string[]): number => {
    return getOverlap(Consts.aideHolisticsSeparate, headers)
}

export const getInfoColumnSpan = (headers: string[]): number => {
    return getOverlap(Consts.infoColumns, headers)
}
