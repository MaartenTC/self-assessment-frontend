import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormGroup } from "@angular/forms";
import {ApplicationType} from "../../enums/ApplicationType"
import { LifecyclePhase } from "../../enums/LifecyclePhase";
import { DeploymentType } from "../../enums/DeploymentType";
import { ProgrammingLanguage } from "../../enums/ProgrammingLanguage";
import { ApplicationDTO } from "../../dto/ApplicationDTO";
import {environment} from "../../../../environment";
import { ApplicationFormComponent } from "../global.component/applicationForm";

@Component({
    selector: "new-assessment-dialog",
    template: `
    <dialog id="newAssessmentDialog">
        <div id="dialog-header">
            <h2>New Assessment</h2>
            <button class="close-button" (click)="close()" type="button">Close</button>
        </div>
        <application-form (submit)="submit()"></application-form>
    </dialog>
    `,
    styleUrls: ["../../../styles.css"],
    styles: `
        #newAssessmentDialog {
          border-radius: 10px;
          border : 1px solid #323F4B
        }
    `,
    imports: [FormsModule, ReactiveFormsModule, ApplicationFormComponent]
})
export class NewAssessmentDialogComponent {
    @Output() assessmentCreated = new EventEmitter<ApplicationDTO>();
    @ViewChild(ApplicationFormComponent) formComponent!: ApplicationFormComponent;
    applicationForm!: FormGroup;

    ngAfterViewInit() : void {
        this.applicationForm = this.formComponent.applicationFormGroup;
    }

    open() : void {
        /**
         * open a modal dialog window with a form to create a new assessment
         */
        const dialog = document.getElementById("newAssessmentDialog") as HTMLDialogElement;
        if (dialog) {
            dialog.showModal();
        } else {
            console.error("Dialog element not found");
        }
    }
    close() : void {
        /**
         * what do you think this does?
         */
        const dialog = document.getElementById("newAssessmentDialog") as HTMLDialogElement;
        if (dialog) {
            dialog.close();
        } else {
            console.error("Dialog element not found");
        }
    }
    submit(){
        /**
         * create an ApplicationDTO using the form data and send it to the backend
         */
        console.log("submit called");
        const applicationDTO : ApplicationDTO = {
            applicationId: this.applicationForm.value.applicationId,
            name: this.applicationForm.value.name,
            systemSize: this.applicationForm.value.systemSize,
            type: this.applicationForm.value.type as ApplicationType,
            lifecyclePhase: this.applicationForm.value.lifecyclePhase as LifecyclePhase,
            language: this.applicationForm.value.language as ProgrammingLanguage,
            deploymentType: this.applicationForm.value.deploymentType as DeploymentType
        }
        fetch(`${environment.baseUrl}/assessment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": environment.csrfToken
            },
            credentials: "include",
            body: JSON.stringify(applicationDTO)
        }).then(response => {
            if (response.ok) {
                this.assessmentCreated.emit(applicationDTO);
                this.formComponent.showSuccess();
            } else {
                this.formComponent.showFailed();
            }
        }).catch(error => {
            this.formComponent.showFailed();
            console.error("Error creating assessment:", error);
        });
    }
}
