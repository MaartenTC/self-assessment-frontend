import { FindingDTO } from './FindingDTO';
import { CorrectionDTO } from './CorrectionDTO';

export interface MeasurementDTO {
        explanation : string,
        finding : FindingDTO ,
        correction : CorrectionDTO | null,
        creationDate: number // timestamp in seconds
}