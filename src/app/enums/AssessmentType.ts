export enum AssessmentType{
    LIGHT = "LIGHT",
    MEDIUM = "MEDIUM",
    HEAVY = "HEAVY"

}
export const AssessmentTypeValue: Record<string, number> = {
    [AssessmentType.LIGHT]: 1,
    [AssessmentType.MEDIUM]: 2,
    [AssessmentType.HEAVY]: 3
};