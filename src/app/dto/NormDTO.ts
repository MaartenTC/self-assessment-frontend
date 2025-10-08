import { FindingDTO  } from "./FindingDTO"; 
import { AssessmentType } from "../enums/AssessmentType";

export interface NormDTO {
    normId: number;
    name: string;
    explanation: string;
    link: string;
    categories: string[];
    assessmentType: AssessmentType; 
    findings: Array<FindingDTO>;   
    lastModified: number;
}