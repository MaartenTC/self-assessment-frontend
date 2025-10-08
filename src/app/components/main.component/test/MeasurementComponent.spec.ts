import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeasurementComponent } from '../MeasurementComponent';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { environment } from '../../../../../environment';
import { NormDTO } from '../../../dto/NormDTO';
import { FindingDTO } from '../../../dto/FindingDTO';
import { AssessmentType } from '../../../enums/AssessmentType';
import { AssessmentService } from '../../../service/AssessmentService';
import { inject } from '@angular/core';

describe('MeasurementComponent', () => {
    let component: MeasurementComponent;
    let fixture: ComponentFixture<MeasurementComponent>;
    let assessmentService : AssessmentService;
    beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeasurementComponent, FormsModule, ReactiveFormsModule],
    providers : [AssessmentService]
    }).compileComponents();
    assessmentService = TestBed.inject(AssessmentService);
    fixture = TestBed.createComponent(MeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize measurementForm with correct controls', () => {
        expect(component.measurementForm.contains('explanation')).toBeTrue();
        expect(component.measurementForm.contains('correction')).toBeTrue();
        expect(component.measurementForm.contains('newRisk')).toBeTrue();
    });

    it('resetSlider() should reset newRisk and correction', () => {
        component.finding.risk = 10;
        component.measurementForm.patchValue({ newRisk: 50, correction: 'some text' });
        component.resetSlider();
        expect(component.measurementForm.value.newRisk).toBe(10);
        expect(component.measurementForm.value.correction).toBe(null);
    });

    it('isMaxxedOut() should return true when text length exceeds maxTextSize', () => {
        const longText = 'a'.repeat(environment.maxTextSize + 1);
        expect(component.isMaxxedOut(longText)).toBeTrue();
    });

    it('isMaxxedOut() should return false for null or short text', () => {
        expect(component.isMaxxedOut(null)).toBeFalse();
        expect(component.isMaxxedOut('short')).toBeFalse();
    });

    it('getCharacterLimit() should return correct remaining characters', () => {
        const text = 'abc';
        expect(component.getCharacterLimit(text)).toBe(environment.maxTextSize - 3);
    });

    it('getCharacterLimit() should return maxTextSize if text is null', () => {
        expect(component.getCharacterLimit(null)).toBe(environment.maxTextSize);
    });

    it('submit() should emit measurementMadeEvent', (done) => {
    const norm : NormDTO = { normId: 1, name: 'testName', explanation: '', link: '', findings: [], categories: [], assessmentType: AssessmentType.HEAVY, lastModified: 1751241906 };
    const finding : FindingDTO = { findingId : 2, normId : 1,text: 'testText', risk: 0 };
    component.finding = finding;
    component.norm = norm;
    component.applicationId = 'app1';

    component.measurementForm.patchValue({
    explanation: 'Reason',
    correction: 'Correction',
    newRisk: 15
    });

    component.measurementMadeEvent.subscribe((measurement) => {
    expect(measurement.explanation).toBe('Reason');
    done();
    });

    const fakeEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(null, {status: 200})));

    component.submit(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });
    
  it('should return red border for HEAVY assessment type', () => {
    const border = component.measurementBorderColor(AssessmentType.HEAVY);
    expect(border).toBe('2px solid red');
  });

  it('should return green border for LIGHT assessment type', () => {
    const border = component.measurementBorderColor(AssessmentType.LIGHT);
    expect(border).toBe('2px solid green');
  });

  it('should return orange border for MEDIUM assessment type', () => {
    const border = component.measurementBorderColor(AssessmentType.MEDIUM);
    expect(border).toBe('2px solid orange');
  });

  it('should return black border for unknown assessment type', () => {
    const border = component.measurementBorderColor('UNKNOWN' as AssessmentType);
    expect(border).toBe('2px solid black');
  });
    it('should handle failed response correctly (response.ok = false)', fakeAsync(() => {
    const mockResponse = { ok: false };

    spyOn(assessmentService, 'updateMeasurements').and.returnValue(Promise.resolve(mockResponse as Response));

    component.measurementForm.setValue({
      explanation: 'Some explanation',
      correction: '',
      newRisk: 30
    });

    const fakeEvent = new Event('submit');
    component.submit(fakeEvent);
    tick();

    expect(component.showFailedAlert).toBeTrue();
    expect(component.showAlert).toBeFalse();
  }));
    it('should handle successful response correctly (response.ok = true)', fakeAsync(() => {
        const mockResponse = { ok: true };
    
        spyOn(assessmentService, 'updateMeasurements').and.returnValue(Promise.resolve(mockResponse as Response));
    
        component.measurementForm.setValue({
        explanation: 'Some explanation',
        correction: '',
        newRisk: 30
        });
    
        const fakeEvent = new Event('submit');
        component.submit(fakeEvent);
        tick();
    
        expect(component.showAlert).toBeTrue();
        expect(component.showFailedAlert).toBeFalse();
    }));
    it("should show failed alert on error", fakeAsync(() => {
        spyOn(assessmentService, 'updateMeasurements').and.returnValue(Promise.reject('Network error'));

        component.measurementForm.setValue({
            explanation: 'Some explanation',
            correction: '',
            newRisk: 30
        });

        const fakeEvent = new Event('submit');
        component.submit(fakeEvent);
        tick();

        expect(component.showFailedAlert).toBeTrue();
        expect(component.showAlert).toBeFalse();
    }));
});