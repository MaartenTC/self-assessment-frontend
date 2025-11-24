import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";
import { AssessmentDTO } from "../../dto/AssessmentDTO";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MeasurementDTO } from "../../dto/MeasurementDTO";
@Component({
    selector : "export-component",
    template : `
    <dialog id="exportDialog">
        <form [formGroup]="exportFormGroup" (submit)="exportAssessment()">
            <h2>Download Assessment</h2>
            <label for="date">start date</label>
            <input type="date" name="start_date" formControlName="startDate">
            <label for="date">end date</label>
            <input type="date" name="end_date" formControlName="endDate">
            <button class="primary-button" title="export">Download</button>
        </form>
        <button class="close-button" (click)="close()">close</button>
    </dialog>
    `
    ,
    imports: [FormsModule, ReactiveFormsModule],
    styleUrls: ["../../../styles.css"],
    styles : `
    form {
        display : flex;
        flex-direction : column;
        align-items : center;
    }

    input {
        border: 1px solid #323F4B;
        margin : 5px;
        border-radius: 5px;
        padding: 2px;
    }
    `
})
export class ExportComponent{
    assessment! : AssessmentDTO;
    exportFormGroup = new FormGroup({
        startDate : new FormControl("1970-01-01", Validators.required),
        endDate : new FormControl(new Date(Date.now()).toISOString().slice(0, 10), Validators.required)
    });

    async exportAssessment(): Promise<void> {
    // https://stackoverflow.com/questions/52182851/how-to-download-file-with-blob-function-using-angular-5
    let startDate : Date = new Date(this.exportFormGroup.value.startDate ?? "1970-01-01");
    let endDate : Date = new Date(this.exportFormGroup.value.endDate ?? new Date(Date.now()).toISOString().slice(0, 10));
    endDate.setHours(23, 59, 59, 999) // otherwise measurements on the enddate are not included
    const recentMeasurements : Array<MeasurementDTO> = this.getMeasurementsBetweenDates((startDate.getTime() / 1000)
        , (endDate.getTime() / 1000));
    let assessmentClone : AssessmentDTO= structuredClone(this.assessment);
    assessmentClone.measurements = recentMeasurements
    const assessmentJson = JSON.stringify(assessmentClone);
    const blob = new Blob([assessmentJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_${startDate.toLocaleDateString()}_to_${endDate.toLocaleDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    }

    getMeasurementsBetweenDates(startDate : number, endDate : number) : Array<MeasurementDTO>{
        /**
         * @Param startDate : timestamp in seconds
         * @Param endDate : timestamp in seconds
         * @Return measurements between given timestamps : Array<MeasurementDTO>
         */
        let betweenMeasurements: Array<MeasurementDTO> = [];
        for(let measurement of this.assessment.measurements){
            if(measurement.creationDate >= startDate && measurement.creationDate <= endDate){
                betweenMeasurements.push(measurement);
            }
        }
        return betweenMeasurements;
    }
    open(assessment : AssessmentDTO){
    this.assessment = assessment;
    this.exportFormGroup.patchValue({
        startDate : new Date(assessment.lastModified * 1000).toISOString().slice(0, 10)
    })
    const dialog = document.getElementById("exportDialog") as HTMLDialogElement;
    if (dialog) {
        dialog.showModal();
    } else {
        console.error("Dialog element not found");
    }}
    close() : void {
    const dialog = document.getElementById("exportDialog") as HTMLDialogElement;
    if (dialog) {
        dialog.close();
    } else {
        console.error("Dialog element not found");
    }
    }
}
