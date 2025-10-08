import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { AssessmentDTO } from '../../../dto/AssessmentDTO';
import { AssessmentService } from '../../../service/AssessmentService';
import { environment } from '../../../../../environment';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let assessmentService : AssessmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [AssessmentService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    assessmentService = TestBed.inject(AssessmentService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no selected application', () => {
    expect(component.currentApplicationId).toBe('');
    expect(component.applicationSelected).toBeFalse();
  });

  it('should update application state when an assessment is selected', () => {
    const mockAssessment: AssessmentDTO = { applicationId: 'id1' } as AssessmentDTO;
    component.handleAssessmentSelected(mockAssessment);

    expect(component.currentApplicationId).toBe('id1');
    expect(component.applicationSelected).toBeTrue();
  });
    it('should inject rainbow animation style on handleSecret call', () => {
    const originalStyleCount = document.head.querySelectorAll('style').length;

    component.handleSecret();

    const allStyles = document.head.querySelectorAll('style');
    const newStyleCount = allStyles.length;

    expect(newStyleCount).toBeGreaterThan(originalStyleCount);

    const lastStyle = allStyles[allStyles.length - 1];
    expect(lastStyle.textContent).toContain('@keyframes rainbow-flash');
    expect(lastStyle.textContent).toContain('linear-gradient');
  });
it('should modify layout columns when component is active', () => {
  const container: HTMLDivElement = fixture.nativeElement.querySelector('#app-container');
  expect(container).toBeTruthy();

  component.handleComponentActiveEvent(true);
  fixture.detectChanges();

  expect(container.style.gridTemplateColumns).toBe('1fr 5fr 1.5fr');

  component.handleComponentActiveEvent(false);
  fixture.detectChanges();

  expect(container.style.gridTemplateColumns).toBe('1fr 5fr 0.1fr');
});
  it('should fetch CSRF token and assign it to environment', fakeAsync(() => {
    const mockToken = 'mock-csrf-token';

    spyOn(assessmentService, "fetchCSRFToken").and.returnValue(Promise.resolve({
        json: () => Promise.resolve({ token: mockToken })} as Response));
    component.ngOnInit();
    tick();
    expect(assessmentService.fetchCSRFToken).toHaveBeenCalled();
    expect(environment.csrfToken).toBe(mockToken);
  }));

});
