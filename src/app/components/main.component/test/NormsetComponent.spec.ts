import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NormsetComponent } from '../NormsetComponent';  // adjust path if needed
import { MeasurementComponent } from '../MeasurementComponent';
import { FormsModule } from '@angular/forms';
import { AssessmentType } from '../../../enums/AssessmentType';
import { NormsetService } from '../../../service/NormsetService';
import { AssessmentService } from '../../../service/AssessmentService';
import { NormDTO } from '../../../dto/NormDTO';
import { inject } from '@angular/core';

describe('NormsetComponent', () => {
  let component: NormsetComponent;
  let fixture: ComponentFixture<NormsetComponent>;
  let assessmentService: AssessmentService;
  let normsetService: NormsetService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormsetComponent,MeasurementComponent, FormsModule],
      providers: [AssessmentService, NormsetService]
    }).compileComponents();
    assessmentService = TestBed.inject(AssessmentService);
    normsetService = TestBed.inject(NormsetService);
    fixture = TestBed.createComponent(NormsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle norm expansion correctly', () => {
    const normId = 1;
    expect(component.isExpanded(normId)).toBeFalse();
    component.toggleNormExpansion(normId);
    expect(component.isExpanded(normId)).toBeTrue();
    component.toggleNormExpansion(normId);
    expect(component.isExpanded(normId)).toBeFalse();
  });

  it('should return correct icon for norm expansion', () => {
    const normId = 2;
    expect(component.getIcon(normId)).toBe('▶');
    component.toggleNormExpansion(normId);
    expect(component.getIcon(normId)).toBe('▼');
  });

  it('should compare categories correctly', () => {
    expect(component.compareCategories(['a', 'b'], ['b', 'c'])).toBeTrue();
    expect(component.compareCategories(['x', 'y'], ['z'])).toBeFalse();
  });

  it('should calculate risk color as rgb string', () => {
    expect(component.riskColor(0)).toContain('rgb(');
    expect(component.riskColor(50)).toContain('rgb(');
    expect(component.riskColor(100)).toContain('rgb(');
  });

  it('should update active filters and filterState properly', () => {
    component.activeAssessmentType = AssessmentType.MEDIUM;
    component.filterState = {};
    component.updateActiveFilters();
    expect(Object.values(component.filterState).some(val => val === true)).toBeTrue();
  });

  it('should toggle all filters and update toggle text', () => {
    component.allSelected = true;
    component.filterState = { "id1": true, "id2": true };
    component.toggleText = "Deselect All";
    component.toggleAllFilters();
    expect(component.allSelected).toBeFalse();
    expect(component.toggleText).toBe("Select All");
  });
  it('should load filters from normset', () => {
  component.normset = {
    name: 'TestSet',
    version: '1.0',
    link: '',
    norms: [
      {
        normId: 1,
        name: 'Norm A',
        explanation: '',
        link: '',
        categories: ['CatA', 'CatB'],
        assessmentType: AssessmentType.LIGHT,
        findings: [],
        lastModified: 1
      },
      {
        normId: 2,
        name: 'Norm B',
        explanation: '',
        link: '',
        categories: ['CatB', 'CatC'],
        assessmentType: AssessmentType.HEAVY,
        findings: [],
        lastModified: 2
      }
    ]
  };

  component.loadFilters();

  expect(component.assessmentTypes).toEqual([
    AssessmentType.LIGHT,
    AssessmentType.MEDIUM,
    AssessmentType.HEAVY
  ]);

  expect(component.categories).toEqual(['CatA', 'CatB', 'CatC']);

  [...component.assessmentTypes, ...component.categories].forEach(item => {
    expect(component.filterState[item]).toBeTrue();
  });

  expect(component.allSelected).toBeTrue();
  expect(component.toggleText).toBe('Deselect All');

  expect(component.activeFilters).toContain('CatA');
  expect(component.activeFilters).toContain('CatB');
  expect(component.activeFilters).toContain('CatC');
});
it('should fetch normset and populate latest risks', fakeAsync(() => {
    const mockNorms : Array<NormDTO> = [
      {
        normId: 1,
        name: 'Norm 1',
        explanation: 'Explanation',
        link: 'link',
        categories: ['CatA'],
        assessmentType: AssessmentType.LIGHT,
        findings: [],
        lastModified: 10
      }
    ];

    const mockNormset = {
      name: 'Test Normset',
      version: '1.0',
      link: 'http://test.com',
      norms: mockNorms
    };

    const mockRiskMap = {
      1: 55
    };

    spyOn(normsetService, 'fetchNormset').and.returnValue(
      Promise.resolve({
        text: () => Promise.resolve(JSON.stringify(mockNormset))
      } as Response)
    );

    spyOn(assessmentService, 'fetchLatestRiskByNorms').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockRiskMap)
      } as Response)
    );

    const loadFiltersSpy = spyOn(component, 'loadFilters');

    component.fetchNormset('appId123');
    tick(); 

    expect(normsetService.fetchNormset).toHaveBeenCalledWith('appId123');
    expect(component.normset.name).toBe('Test Normset');
    expect(component.normset.norms.length).toBe(1);
    expect(component.normset.norms[0].normId).toBe(1);
    expect(loadFiltersSpy).toHaveBeenCalled();
    expect(assessmentService.fetchLatestRiskByNorms).toHaveBeenCalledWith('appId123', mockNorms);
    expect(component.latestRiskByNormId.get(1)).toBe(55);
  }));
});
