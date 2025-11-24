import { Component, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import {ApplicationType} from "../../enums/ApplicationType"
import { LifecyclePhase } from "../../enums/LifecyclePhase";
import { DeploymentType } from "../../enums/DeploymentType";
import { ProgrammingLanguage } from "../../enums/ProgrammingLanguage";
import { ApplicationDTO } from "../../dto/ApplicationDTO";

@Component({
    selector: "application-form",
    template: `
        <form direction="column" [formGroup]="applicationFormGroup">
            <label for="applicationId" title="required">Application ID*</label>
            <input type="text" id="applicationId" formControlName="applicationId" required/>
            <br>
            <label for="applicationName" title="required">Application Name*</label>
            <input type="text" id="applicationName" formControlName="name" required/>
            <br>
            <label for="systemSize">System Size</label>
            <input [class.invalid]="applicationFormGroup.get('systemSize')?.invalid" type="number" id="systemSize" formControlName="systemSize" min=0/>
            <br>
            <label for="applicationType">Application Type:</label>
            <select id="applicationType" formControlName="type">
                <option></option>
                @for(applicationType of applicationTypes; track $index){
                    <option value={{applicationType.valueOf()}}>{{applicationType.toLocaleLowerCase()}}</option>
                }
            </select>
            <br>
            <label for="lifecyclePhase">Lifecycle Phase:</label>
            <select id="lifecyclePhase" formControlName="lifecyclePhase">
                <option></option>
                @for(lifecyclePhase of lifecyclePhases; track $index){
                    <option value={{lifecyclePhase.valueOf()}}>{{lifecyclePhase.toLocaleLowerCase()}}</option>
                }
            </select>
            <br>
            <label for="programmingLanguage">Programming Language:</label>
            <select id="programmingLanguage" formControlName="language">
                <option></option>
                @for(programmingLanguage of programmingLanguages; track $index) {
                    <option value={{programmingLanguage.valueOf()}}>{{programmingLanguage.toLocaleLowerCase()}}</option>
                }
            </select>
            <br>
            <label for="deploymentType">Deployment Type:</label>
            <select id="deploymentType" formControlName="deploymentType">
                <option></option>
                @for(deploymentType of deploymentTypes; track $index) {
                    <option value={{deploymentType.valueOf()}}>{{deploymentType.toLocaleLowerCase()}}</option>
                }
            </select>
            <br>
            <div class="button-wrapper">
                    @if(this.success){
                        <p type="success">submitted</p>
                    }
                    @if(!this.success && this.success !== null){
                        <p type="error">failed to submit</p>
                    }
                <button class="secondary-button">Submit</button>
            </div>
        </form>
    `,
    styleUrls: ["../../../styles.css"],
    styles: `
    .secondary-button {
      height: 30px;
      width: 70px;
      border-radius: 5px;
    }
    input:invalid {
        outline : 2px solid red;
        outline-offset: 2px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        border: 1px solid #323F4B;
        border-radius: 5px;
        background-color: white;
    }
    .invalid-form{
    border : 1px solid red;
    }
    input:disabled {
        cursor : not-allowed;
    }
    `,
    imports: [FormsModule, ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ApplicationFormComponent {
    @Output() assessmentCreated = new EventEmitter<ApplicationDTO>();
    success : boolean | null = null;
    applicationTypes : Array<string> = Object.keys(ApplicationType);
    lifecyclePhases : Array<string> = Object.keys(LifecyclePhase);
    programmingLanguages : Array<string> = Object.keys(ProgrammingLanguage);
    deploymentTypes : Array<string> = Object.keys(DeploymentType);

    applicationFormGroup = new FormGroup({
        applicationId: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        systemSize: new FormControl(0,[Validators.min(0)]),
        type: new FormControl(),
        lifecyclePhase: new FormControl(),
        language: new FormControl(),
        deploymentType: new FormControl()
    })
    disableNotAllowedFields() : void {
        this.applicationFormGroup.get('applicationId')?.disable();
        this.applicationFormGroup.get('name')?.disable();
    }
    showSuccess() : void {
        this.success = true;
        setTimeout(() => {
            this.success = null;
        }, 3000);
    }
    showFailed() : void {
        this.success = false;
        setTimeout(() => {
            this.success = null;
        }, 3000);
    }
}
