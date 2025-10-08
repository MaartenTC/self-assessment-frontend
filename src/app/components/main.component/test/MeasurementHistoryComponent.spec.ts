import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MeasurementHistoryComponent } from '../MeasurementHistoryComponent';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { AssessmentService } from '../../../service/AssessmentService';
import { MeasurementDTO } from '../../../dto/MeasurementDTO';

describe('MeasurementHistoryComponent', () => {
  let component: MeasurementHistoryComponent;
  let fixture: ComponentFixture<MeasurementHistoryComponent>;
  let assessmentService : AssessmentService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AssessmentService]
    }).compileComponents();
    assessmentService= TestBed.inject(AssessmentService)
    fixture = TestBed.createComponent(MeasurementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // render template
  });

  const mockMeasurement: MeasurementDTO = {
    explanation: 'Test explanation',
    finding: {
      findingId : 1,
      normId: 2,
      text: 'Test finding',
      risk: 20
    },
    correction: {
      correctionComment: 'Correction reason',
      newRisk: 10
    },
    creationDate: 1724511994
  };

  describe('loadMeasurementHistory', () => {
    it('should fetch and display measurement info on success', fakeAsync(() => {
      spyOn(assessmentService, 'fetchLatestMeasurement').and.returnValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockMeasurement)
        } as Response)
      );

      component.loadMeasurementHistory('appId1', 2);
      tick();

      fixture.detectChanges();

      expect(component.measurement).toEqual(mockMeasurement);
      expect(component.showInfo).toBeTrue();
      expect(component.responseStatus).toBe(200);

      const explanationEl = fixture.nativeElement.querySelector('#explanation');
      expect(explanationEl.textContent).toContain('Test explanation');
    }));

    it('should not display info if response is not ok', fakeAsync(() => {
      spyOn(assessmentService, 'fetchLatestMeasurement').and.returnValue(
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({})
        } as Response)
      );

      component.loadMeasurementHistory('appId1', 2);
      tick();
      fixture.detectChanges();

      expect(component.showInfo).toBeFalse();
      expect(component.responseStatus).toBe(404);
    }));

    it('should handle error response', fakeAsync(() => {
      spyOn(assessmentService, 'fetchLatestMeasurement').and.returnValue(Promise.reject('error'));

      component.loadMeasurementHistory('appId1', 2);
      tick();
      fixture.detectChanges();

      expect(component.responseStatus).toBe(500);
    }));
  });

  describe('dialog open/close', () => {
    it('should open dialog element', () => {
      const dialogEl: HTMLDialogElement = fixture.nativeElement.querySelector('#measurementHistoryDialog');
      const showSpy = spyOn(dialogEl, 'showModal');

      component.open();
      expect(showSpy).toHaveBeenCalled();
    });

    it('should close dialog and reset showInfo', () => {
      const dialogEl: HTMLDialogElement = fixture.nativeElement.querySelector('#measurementHistoryDialog');
      const closeSpy = spyOn(dialogEl, 'close');

      component.showInfo = true;
      component.close();

      expect(closeSpy).toHaveBeenCalled();
      expect(component.showInfo).toBeFalse();
    });

    it('should log error if dialog not found (open)', () => {
      spyOn(document, 'getElementById').and.returnValue(null);
      const consoleSpy = spyOn(console, 'error');

      component.open();
      expect(consoleSpy).toHaveBeenCalledWith('Dialog element not found');
    });

    it('should log error if dialog not found (close)', () => {
      spyOn(document, 'getElementById').and.returnValue(null);
      const consoleSpy = spyOn(console, 'error');

      component.close();
      expect(consoleSpy).toHaveBeenCalledWith('Dialog element not found');
    });
  });
});
