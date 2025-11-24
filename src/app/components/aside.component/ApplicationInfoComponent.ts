import { Component, EventEmitter, inject, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { ApplicationDTO } from '../../dto/ApplicationDTO';
import { ApplicationFormComponent } from "../global.component/applicationForm";
import { FormGroup } from '@angular/forms';
import { ApplicationType } from '../../enums/ApplicationType';
import { LifecyclePhase } from '../../enums/LifecyclePhase';
import { ProgrammingLanguage } from '../../enums/ProgrammingLanguage';
import { DeploymentType } from '../../enums/DeploymentType';
import { AssessmentService } from '../../service/AssessmentService';

@Component({
  selector: 'application-info-component',
  template: `
    <div class="application-info-container">
        <button class="toggleButton" (click)="toggleActive()" aria-label="toggle application context visibility">{{icon}}</button>
        <div class="collapsible-container" [class.hidden]="!isVisible">
          <h2>Assessment Context</h2>
          <application-form (submit)="updateApplicationContext()"></application-form>
        </div>
    </div>
  `,

  styles: `
    h2 {
      text-align: center;
    }
  .application-info-container {
    float: right;
    border-left: 1px solid #323F4B;
    height: 100vh;
    width: 100%;
    display : flex;
    background-color: #E4E7EB;
  }
  .toggleButton {
    cursor: pointer;
    background-color: white;
    border-color: #DE911D;
    margin: 5px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    min-width: 30px;
  }
  .collapsible-container {
    width: 100%;
    padding-right: 5%;
    overflow-x: hidden;
  }
  .collapsible-container.hidden {
    width : 0;
    height : 0;
  }
  `,
  imports: [ApplicationFormComponent]

})
export class ApplicationInfo implements OnChanges{
  /**
   * gebruik het applicationId dat is meegekomen met de geselecteerde assessment om de ApplicationDTO op te halen
   */
  isVisible : boolean = true;
  active : boolean = true;
  icon : string = '▲';
  @Input() currentApplicationId : string = '';
  @ViewChild(ApplicationFormComponent) applicationFormComponent!: ApplicationFormComponent;
  @Output() componentActiveEvent = new EventEmitter<boolean>();
  assessmentService : AssessmentService = inject(AssessmentService);
  application : ApplicationDTO ={
    applicationId: 'placeholder',
    name: 'placeholder',
    type: null,
    lifecyclePhase: null,
    systemSize: null,
    deploymentType: null,
    language: null
  }

  ngOnChanges(): void {
      this.assessmentService.fetchApplication(this.currentApplicationId)
      .then( response => response.json())
      .then( (application : ApplicationDTO) => {
          this.application = application;
          this.loadForm(this.application);
      })
  }
  toggleActive() : void {
    this.active = !this.active;
    if (this.active) {
      this.icon = '▲';
      setTimeout(() => {this.isVisible = true},500);
    }
    else {
      this.icon = '▼';
      this.isVisible = false;
    }
    this.componentActiveEvent.emit(this.active);
  }
  loadForm(application : ApplicationDTO) : void {
    this.applicationFormComponent.applicationFormGroup.patchValue({
      applicationId: application.applicationId,
      name: application.name,
      type: application.type,
      lifecyclePhase: application.lifecyclePhase,
      systemSize: application.systemSize,
      deploymentType: application.deploymentType,
      language: application.language
    });
    this.applicationFormComponent.disableNotAllowedFields();

  }

  updateApplicationContext() : void {
    const formGroup : FormGroup = this.applicationFormComponent.applicationFormGroup;
    const applicationDTO : ApplicationDTO = {
      applicationId: formGroup.getRawValue().applicationId,
      name: formGroup.getRawValue().name,
      systemSize: formGroup.getRawValue().systemSize,
      type: formGroup.getRawValue().type as ApplicationType,
      lifecyclePhase: formGroup.getRawValue().lifecyclePhase as LifecyclePhase,
      language: formGroup.getRawValue().language as ProgrammingLanguage,
      deploymentType: formGroup.getRawValue().deploymentType as DeploymentType
    }
    this.assessmentService.updateApplicationContext(applicationDTO).then(response => {
            if (response.ok) {
                this.applicationFormComponent.showSuccess();
            } else {
                this.applicationFormComponent.showFailed();
            }
    }).catch(() => {
      console.log("catch block called")
      this.applicationFormComponent.showFailed()});

  }
}
