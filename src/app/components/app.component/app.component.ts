import { Component, CUSTOM_ELEMENTS_SCHEMA, inject  } from '@angular/core';
import { AssessmentOverviewComponent } from '../nav.component/AssessmentOverview';
import { ApplicationInfo } from '../aside.component/ApplicationInfoComponent';
import { HeaderComponent } from '../header.component/HeaderComponent';
import { environment } from '../../../../environment';
import { AssessmentDTO } from '../../dto/AssessmentDTO';
import { MainComponent } from '../main.component/MainComponent';
import { AssessmentService } from '../../service/AssessmentService';

@Component({
  selector: 'app-root',
  imports: [MainComponent, AssessmentOverviewComponent, HeaderComponent, ApplicationInfo],
  template: `
  <div id="app-container">
    <header>
      <header-placeholder (secretUnlocked)="handleSecret()"></header-placeholder>
    </header>
    <nav-component (assessmentSelected)="handleAssessmentSelected($event)"/>
    @if (applicationSelected) {
      <main-component [currentApplicationId]="currentApplicationId"/>
      <application-info-component [currentApplicationId]="currentApplicationId" (componentActiveEvent)="handleComponentActiveEvent($event)"/>
    }
  </div>`,
  styleUrl: 'app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'my-app';
  currentApplicationId : string = '';
  applicationSelected : boolean = false;
  assessmentService : AssessmentService = inject(AssessmentService);

  ngOnInit() : void {
      this.assessmentService.fetchCSRFToken().then(response => response.json()).then(response => {
        environment.csrfToken = response.token ?? '';
      })
  }
  handleAssessmentSelected(assessment: AssessmentDTO): void {
    this.currentApplicationId = assessment.applicationId;
    this.applicationSelected = true;
  }

  handleComponentActiveEvent(active : boolean): void {
    const container = document.getElementById('app-container');
    if (container) {
      container.style.gridTemplateColumns = active ? '1fr 5fr 1.5fr' : '1fr 5fr 0.1fr';
    }
    }
  handleSecret(): void {
      let greenStyleTag: HTMLStyleElement;
        greenStyleTag = document.createElement('style');
        greenStyleTag.innerText = `
        button{
        color: transparent;
        background: linear-gradient(
          90deg,
          red,
          orange,
          yellow,
          green,
          blue,
          indigo,
          violet,
          red
        );
        background-size: 400% 400%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow-flash 2s linear infinite;
        }
        @keyframes rainbow-flash {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }`;
        document.head.appendChild(greenStyleTag);
    }
}
