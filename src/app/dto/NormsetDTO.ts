import { NormDTO } from './NormDTO';
export interface NormsetDTO {
        name : string;
        version : string;
        link : string;
        norms : Array<NormDTO>;
}