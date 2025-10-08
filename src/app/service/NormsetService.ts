import { Injectable } from "@angular/core"
import { environment  } from "../../../environment"
@Injectable({
    providedIn : "root"
})
export class NormsetService {
    async fetchNormset(currentApplicationId : string) : Promise<Response>{
        return fetch(`${environment.baseUrl}/assessment/normset/${currentApplicationId}`)
    }
    
}