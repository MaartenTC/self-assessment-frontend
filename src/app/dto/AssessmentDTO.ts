import { MeasurementDTO } from "./MeasurementDTO";

export interface AssessmentDTO {
        applicationId : string;
        applicationName : string;
        lastModified : number;
        measurements : Array<MeasurementDTO>;
}
