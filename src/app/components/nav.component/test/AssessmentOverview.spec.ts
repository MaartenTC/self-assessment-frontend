import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssessmentOverviewComponent } from '../AssessmentOverview'; 
import { NewAssessmentDialogComponent } from '../NewAssessmentDialogComponent';
import { ApplicationDTO } from '../../../dto/ApplicationDTO'
import { By } from '@angular/platform-browser';
import { environment } from '../../../../../environment';
import { AssessmentDTO } from '../../../dto/AssessmentDTO';
import { FormsModule } from '@angular/forms';

describe('NavPlaceholder', () => {
  let component: AssessmentOverviewComponent;
  let fixture: ComponentFixture<AssessmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentOverviewComponent, NewAssessmentDialogComponent, FormsModule],
    }).compileComponents();
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      status: 200,
      json: () => Promise.resolve([
        { applicationId: '1', applicationName: 'App_One', lastModified: 1752953842 },
        { applicationId: '2', applicationName: 'App_Two', lastModified: 1752953842 }
      ])
    } as Response));
    fixture = TestBed.createComponent(AssessmentOverviewComponent);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load assessments on init', fakeAsync(() => {
    component.reloadAssessments();
    tick();
    expect(component.assessments.length).toBe(2);
    expect(component.assessments[0].applicationName).toBe('App_One');
  }));

  it('should emit assessmentSelected when startAssessment called', () => {
    spyOn(component.assessmentSelected, 'emit');
    const mockAssessment: AssessmentDTO = {
        applicationId: '123', applicationName: 'Test App', lastModified: 1751241906,
        measurements: []
    };
    component.startAssessment(mockAssessment);
    expect(component.assessmentSelected.emit).toHaveBeenCalledWith(mockAssessment);
  });

  it('should open new assessment dialog when button clicked', () => {
    spyOn(component.newAssessmentDialog, 'open');
    const button = fixture.debugElement.query(By.css('button.secondary-button'));
    button.triggerEventHandler('click', null);
    expect(component.newAssessmentDialog.open).toHaveBeenCalled();
  });

  it('should display assessment list items', fakeAsync(() => {
    component.reloadAssessments();
    tick();
    console.log('Assessments:', component.assessments);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('li.assessmentItem'));
    expect(items.length).toBe(2);
    expect(items[0].nativeElement.textContent).toContain('App_One');
  }));

  it('should emit event when assessment item clicked', fakeAsync(() => {
    spyOn(component.assessmentSelected, 'emit');
    component.reloadAssessments();
    tick();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('li.assessmentItem'));
    console.log(items);
    items[0].triggerEventHandler('click', null);
    expect(component.assessmentSelected.emit).toHaveBeenCalled();
  }));
});
