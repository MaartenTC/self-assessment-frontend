import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from '../MainComponent';
import { NormsetComponent } from '../NormsetComponent';
import { MeasurementComponent } from '../MeasurementComponent';
import { MeasurementHistoryComponent } from '../MeasurementHistoryComponent';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NormDTO } from '../../../dto/NormDTO';
import { FindingDTO } from '../../../dto/FindingDTO';
import { AssessmentType } from '../../../enums/AssessmentType';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [MainComponent, NormsetComponent, MeasurementComponent, MeasurementHistoryComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;

    component.currentApplicationId = 'id1';

    component.normsetComponent = {
      fetchNormset: jasmine.createSpy('fetchNormset'),
    } as any;

    component.measurementComponent = {
      startMeasurement: jasmine.createSpy('startMeasurement'),
    } as any;

    component.measurementHistoryComponent = {
      loadMeasurementHistory: jasmine.createSpy('loadMeasurementHistory'),
      open: jasmine.createSpy('open'),
    } as any;

    fixture.detectChanges();
  });

  it('should call fetchNormset in ngAfterViewInit', () => {
    spyOn(component.normsetComponent, 'fetchNormset');
    component.ngAfterViewInit();
    expect(component.normsetComponent.fetchNormset).toHaveBeenCalledWith('id1');
  });

  it('should call fetchNormset in ngOnChanges if normsetComponent exists', () => {
    spyOn(component.normsetComponent, 'fetchNormset');
    component.ngOnChanges();
    expect(component.normsetComponent.fetchNormset).toHaveBeenCalledWith('id1');
  });
it('start measurement instructs child component', () => {
    const mockFindingDTO: FindingDTO = {
      findingId : 1,
      normId: 1,
      text: 'Sample finding text',
      risk: 3,
    };

    const mockNormDTO: NormDTO = {
      normId: 1,
      name: 'Sample Norm Name',
      explanation: 'This is a sample explanation.',
      link: 'http://example.com/norm1',
      categories: ['category1', 'category2'],
      assessmentType: AssessmentType.HEAVY,
      findings: [mockFindingDTO],
      lastModified: Date.now(),
    };

  spyOn(component.measurementComponent, 'startMeasurement');

  component.startMeasurement(mockNormDTO, mockFindingDTO);

  expect(component.measurementComponent.startMeasurement)
    .toHaveBeenCalledWith(mockNormDTO, mockFindingDTO, component.currentApplicationId);
});
  it('should reload normset', () => {
    spyOn(component.normsetComponent, "fetchNormset");
    component.reloadNormset();
    expect(component.normsetComponent.fetchNormset).toHaveBeenCalledWith('id1');
  });
  it('should load and open measurement history dialog', () => {
    const normId = 2;
    spyOn(component.measurementHistoryComponent, 'loadMeasurementHistory');
    spyOn(component.measurementHistoryComponent, 'open');
    component.openLatestMeasurementDialog(normId);
    expect(component.measurementHistoryComponent.loadMeasurementHistory)
      .toHaveBeenCalledWith("id1", normId);
    expect(component.measurementHistoryComponent.open).toHaveBeenCalled();
  });
});
