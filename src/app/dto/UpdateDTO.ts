import { MeasurementDTO} from './MeasurementDTO';

export interface UpdateDTO {
    applicationId: string,
    measurements : Array<MeasurementDTO>;
}