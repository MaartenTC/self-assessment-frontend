import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { AssessmentDTO } from '../../dto/AssessmentDTO';
import { NewAssessmentDialogComponent } from "./NewAssessmentDialogComponent";
import { ResponseIconComponent } from '../global.component/ResponseIconComponent';
import { AssessmentService } from '../../service/AssessmentService';
import { ExportComponent } from "./ExportComponent";

@Component({
  selector: 'nav-component',
  template: `
  <div class="overview-container">
    <div class="overview-content-container">
      <h2>Assessments</h2>
      <ul>
        @if(this.assessments.length > 0) {
        @for(assessment of assessments; track assessment.applicationId) {
          <li class=assessmentItem (click)="startAssessment(assessment)">
            <div id="applicationname-container">
              <p>{{assessment.applicationName}}</p>
              <img title="export" src="download_icon.png" type="button" alt="download button" (click)="openExport(assessment)"/>
            </div>
            <small>last modified:{{timestampAsDate(assessment.lastModified)}}</small>
          </li>
        }
      }
      </ul>
    </div>
    <response-icon-component [status]="responseStatus"></response-icon-component>
    <div>
      <button (click)="openNewAssessmentDialog()" class="secondary-button">New Assessment</button>
    </div>
  </div>
  <export-component />
  <new-assessment-dialog (assessmentCreated)="reloadAssessments()" />
  `,
  styleUrls: ["../../../styles.css"],
  styles: `

    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        padding: 10px;
        border-bottom: 1px solid gray;
        display: flex;
        flex-direction: column;

    }
    li.assessmentItem {
        cursor: pointer;
  }

    li:hover {
        box-shadow: 0 0 0 3px #E0E8F9 inset;
        cursor: pointer;
      }
    li:active {
      box-shadow: 0 0 0 3px #98AEEB inset
    }
    li:hover img {
      display: inline-flex;
    }
    .overview-container {
      border-right: 1px solid gray;
      padding-left: 5%;
      padding-right: 5%;
      overflow-x: hidden;
      background-color: #E4E7EB;
    }
    .overview-content-container {
      background-color: white;
      border-radius: 5px;
      padding: 0 20px 5px 20px;
      margin-bottom: 10px;
      height: 90%;
      overflow-y: scroll;
      margin-top: 20px;
    }
    img{
      display:none;
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 10%;
      border: 2px solid transparent;
      padding: 4px;
    }
    img:hover {
      border-radius: 50%;
      border: 2px solid #19216C;
    }
    img:active {
      background-color: #98AEEB;
    }
    #applicationname-container {
      display: flex;
      align-items: center;
    }
    p {
      width: 90%;
      overflow: hidden;
    }
    h2 {
      text-align: center;
    }
    `
    ,
  imports: [NewAssessmentDialogComponent, ResponseIconComponent, ExportComponent],
})
export class AssessmentOverviewComponent implements OnInit  {
  assessments : Array<AssessmentDTO> = [];
  @Output() assessmentSelected = new EventEmitter<AssessmentDTO>();
  @ViewChild(NewAssessmentDialogComponent) newAssessmentDialog!: NewAssessmentDialogComponent;
  @ViewChild(ResponseIconComponent) responseIcon!: ResponseIconComponent;
  @ViewChild(ExportComponent) exportComponent! : ExportComponent;
  responseStatus : number = 500;
  assessmentService : AssessmentService = inject(AssessmentService);
  ngOnInit() : void {
    this.reloadAssessments();
  }
      timestampAsDate(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleDateString('nl-NL');
    }
  openNewAssessmentDialog() : void {
    this.newAssessmentDialog.open();
  }
reloadAssessments(): void {
  this.responseStatus = 0;


  this.assessmentService.fetchAssessments().then(response => {
    this.responseStatus = response.status;
    response.json().then((data : Array<AssessmentDTO>) => {
      this.assessments = data;
    })
  })
  .catch(() => {
    this.responseStatus = 500;

  });
}
  startAssessment(assessment : AssessmentDTO) : void{
    this.assessmentSelected.emit(assessment);
  }
  openExport(assessment : AssessmentDTO){
    this.exportComponent.open(assessment);
  }
}
