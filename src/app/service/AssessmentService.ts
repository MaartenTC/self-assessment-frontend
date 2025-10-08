import { Injectable } from "@angular/core"
import { environment } from "../../../environment"
import { ApplicationDTO } from "../dto/ApplicationDTO"
import { NormDTO } from "../dto/NormDTO"
import { UpdateDTO } from "../dto/UpdateDTO"

@Injectable({
    providedIn : "root"
})
export class AssessmentService {

    async updateMeasurements(update: UpdateDTO): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': environment.csrfToken,
            },
            body: JSON.stringify(update),
            credentials: 'include',
        })
    }
    async fetchAssessments(): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment`);
    }

    async fetchLatestMeasurement(applicationId: string, normId: number): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment/measurement/latest/${applicationId}/${normId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': environment.csrfToken
            }
        })
    }
    async fetchLatestRiskByNorms(currentApplicationId: string, norms: Array<NormDTO>): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment/${currentApplicationId}/norms/risk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': environment.csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(norms)
        })
    }
    async fetchApplication(currentApplicationId: string): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment/application/${currentApplicationId}`)

    }
    async fetchCSRFToken(): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment/csrf`, { credentials: 'include' })

    }
    async updateApplicationContext(application: ApplicationDTO): Promise<Response> {
        return fetch(`${environment.baseUrl}/assessment/application`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': environment.csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(application)
        })
    }
    async clearMeasurements(assessmentId: string) {
        return fetch(`${environment.baseUrl}/assessment/${assessmentId}/measurements`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": environment.csrfToken
                },
                credentials: "include"
            }
        )
    }
}