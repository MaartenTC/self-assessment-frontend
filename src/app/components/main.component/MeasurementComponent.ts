import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, inject } from '@angular/core';
import { NormDTO } from '../../dto/NormDTO';
import { FindingDTO } from '../../dto/FindingDTO';
import { environment } from '../../../../environment';
import { UpdateDTO } from '../../dto/UpdateDTO';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CorrectionDTO } from '../../dto/CorrectionDTO';
import { MeasurementDTO } from '../../dto/MeasurementDTO';
import { AssessmentType } from '../../enums/AssessmentType';
import { AssessmentService } from "../../service/AssessmentService"
@Component({
    selector: 'measurement-component',
    template: `
    <div class="measurement-container">
        <div id="finding-heading">
          <h2>Finding</h2>
          <p>{{finding.text}}</p>
        </div>
        <form [formGroup]="measurementForm" id="findingForm" (submit)="submit($event)" [class.invalid-form]="measurementForm.invalid" [class.valid-form]="measurementForm.valid">
            <div id="riskInput">
                <label id="risk-number-label" for="newrisk-slider">Risk</label>
                <p id="risk-number">{{measurementForm.value.newRisk}}</p>
                <input type="range" step="5" formControlName="newRisk" id="newrisk-slider" min={{minRisk}} max={{maxRisk}}>
                <img title="reset" aria-label="reset new risk slider" id="reset-button" type="button" (click)="resetSlider()" src="reset_icon.png">
            </div>
            <label for="explanation">Reason for finding<span class="required-tag">*</span></label>
            <div id="input-fields" class="input-wrapper">
                <span class="textCount" [class.maxxedOut]="isMaxxedOut(measurementForm.value.explanation)">{{getCharacterLimit(measurementForm.value.explanation)}}</span>
                <textarea id="explanation" placeholder="Reason for finding (required)" formControlName="explanation"></textarea>
                @if(measurementForm.value.newRisk != finding.risk){
                  <label for="correction">Reason for new risk</label>
                  <div class="input-wrapper">
                        <span class="textCount" [class.maxxedOut]="isMaxxedOut(measurementForm.value.correction)">{{getCharacterLimit(measurementForm.value.correction)}}</span>
                        <textarea id="correction" placeholder="Reason for new risk" formControlName="correction"></textarea>
                    </div>
                }
            </div>
            <div class="button-wrapper">
                @if(this.showAlert){
                    <p>submitted</p>
                }
                @if(this.showFailedAlert){
                    <p>failed to submit</p>
                }
                <button class="primary-button" [disabled]="!measurementForm.valid">Submit</button>
            </div>
        </form>
        <div id="normInfo">
            <div id="normInfoHeader">
            <h2 title={{norm.name}} id="normTitle" >Norm: {{norm.name}}</h2>
            <p id="normType" [style.border]="measurementBorderColor(norm.assessmentType)">{{norm.assessmentType}}</p>
            </div>
            <small>ID: {{norm.normId}}</small>
            <p>{{norm.categories}}</p>
            <a [href]="norm.link" target="_blank">{{norm.link}}</a>
        </div>
    </div>`,
    styleUrls: ["../../../styles.css",'./MeasurementStyle.css'],
    imports: [FormsModule, ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MeasurementComponent implements OnInit {
    minRisk : number = environment.minRisk;
    maxRisk : number = environment.maxRisk;
    applicationId : string = '';
    norm : NormDTO = { normId: 0, name: '', explanation: '', link: '', findings: [], categories: [], assessmentType: AssessmentType.HEAVY, lastModified: 0 };
    finding : FindingDTO = { findingId : 0, normId : 0,text: '', risk: 0 };
    measurementForm! : FormGroup;
    showAlert : boolean = false;
    showFailedAlert : boolean = false;
    assessmentService : AssessmentService = inject(AssessmentService);
    @Output() measurementMadeEvent = new EventEmitter();

    ngOnInit() : void {
        this.measurementForm = new FormGroup({
            explanation: new FormControl('', [Validators.maxLength(environment.maxTextSize), Validators.required]),
            correction: new FormControl('', [Validators.maxLength(environment.maxTextSize)]),
            newRisk: new FormControl(this.finding.risk, [Validators.min(this.minRisk), Validators.max(this.maxRisk)])
        });
    }
    startMeasurement(norm : NormDTO, finding : FindingDTO, applicationId : string) : void {
        this.applicationId = applicationId;
        this.norm = norm;
        this.finding = finding;

        this.measurementForm.patchValue({
            newRisk: finding.risk,
        });
    }
    resetSlider() : void {
        this.measurementForm.patchValue({
            newRisk: this.finding.risk,
            correction: null
        })
    }
    submit(event : Event) : void {
        /**
         * create a measurement using the form values and submit it inside an UpdateDTO
         */
        event.preventDefault();
        let correction : CorrectionDTO | null = null;
        if(this.measurementForm.value.newRisk != this.finding.risk){
            correction = {
                correctionComment: this.measurementForm.value.correction,
                newRisk: this.measurementForm.value.newRisk,
        }
        }

        const measurement : MeasurementDTO = {
            explanation: this.measurementForm.value.explanation,
            finding: this.finding,
            correction: correction,
            creationDate: Date.now() / 1000
        }
        const update : UpdateDTO = {
            applicationId: this.applicationId,
            measurements: Array<MeasurementDTO>(measurement),
        };
        this.assessmentService.updateMeasurements(update).then((response) => {
            if (!response.ok) {
                this.showFailedAlert = true;
                setTimeout(() => {
                    this.showFailedAlert = false;
                }, 1000);
            }
            else {
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                }, 1000);
                this.resetForm();
                this.measurementMadeEvent.emit(measurement);
                }
            }).catch(() => {
                this.showFailedAlert = true;
                setTimeout(() => {
                    this.showFailedAlert = false;
                }, 1000);});
            }
    resetForm() : void {
        this.measurementForm.reset();
        this.measurementForm.patchValue(
        { newRisk: this.finding.risk });
    }
    isMaxxedOut(text : string | null) : boolean {
        if (!text) {
            return false;
        }
        const textSize : number = text.length;
        return textSize > environment.maxTextSize;
    }
    getCharacterLimit(text : string | null) : number {
        if (!text) {
            return environment.maxTextSize;
        }
        const usedCharacters : number = text.length;
        return environment.maxTextSize - usedCharacters;
    }
    measurementBorderColor(assessmentType: AssessmentType): string {
        let color: string;
        switch (assessmentType) {
            case AssessmentType.HEAVY:
                color = "red";
                break;
            case AssessmentType.LIGHT:
                color = "green";
                break;
            case AssessmentType.MEDIUM:
                color = "orange";
                break;
            default:
                color = "black";
        }
        return `2px solid ${color}`;
    }
}
