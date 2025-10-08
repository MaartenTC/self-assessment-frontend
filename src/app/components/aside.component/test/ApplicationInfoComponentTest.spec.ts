import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApplicationInfo } from '../ApplicationInfoComponent';
import { ApplicationFormComponent } from '../../global.component/applicationForm';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationType } from '../../../enums/ApplicationType';
import { LifecyclePhase } from '../../../enums/LifecyclePhase';
import { ProgrammingLanguage } from '../../../enums/ProgrammingLanguage';
import { DeploymentType } from '../../../enums/DeploymentType';
import { ApplicationDTO } from '../../../dto/ApplicationDTO';
import { environment } from '../../../../../environment';
import { AssessmentService } from '../../../service/AssessmentService';
import { AssessmentDTO } from '../../../dto/AssessmentDTO';
import { inject } from '@angular/core';

describe('ApplicationInfo', () => {
  let component: ApplicationInfo;
  let fixture: ComponentFixture<ApplicationInfo>;
  let assessmentService : AssessmentService;
    const mockFormValues = {
        applicationId: 'testID',
        name: 'testName',
        systemSize: 42,
        type: ApplicationType.API_ONLY,
        lifecyclePhase: LifecyclePhase.DEVELOPMENT,
        language: ProgrammingLanguage.TYPESCRIPT,
        deploymentType: DeploymentType.ON_PREMISE
    };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationInfo, ApplicationFormComponent, FormsModule, ReactiveFormsModule],
      providers: [AssessmentService]
    }).compileComponents();
    assessmentService = TestBed.inject(AssessmentService);
    fixture = TestBed.createComponent(ApplicationInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default active state true and icon "▲"', () => {
        expect(component.active).toBeTrue();
        expect(component.icon).toBe('▲');
    });

    it('toggleActive() should toggle active and icon', () => {
        component.toggleActive();
        expect(component.active).toBeFalse();
        expect(component.icon).toBe('▼'); 

        component.toggleActive();
        expect(component.active).toBeTrue();
        expect(component.icon).toBe('▲');
    });

    it("should have an applicationFormComponent", () => {
        expect(component.applicationFormComponent).toBeTruthy();
    });

    it('should send updated application info on updateApplicationContext call', () => {


    const fakeFormGroup = {
        getRawValue: () => mockFormValues
    } as FormGroup;

    component.applicationFormComponent = {
        applicationFormGroup: fakeFormGroup
    } as ApplicationFormComponent;

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response()));
    component.updateApplicationContext();

    expect(fetchSpy).toHaveBeenCalledWith(
        `${environment.baseUrl}/assessment/application`,
        jasmine.objectContaining({
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': environment.csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(mockFormValues as ApplicationDTO)
        })
    );
    });
    it("should set applicationFormComponent's form values on loadForm call", () => {
        const mockApplication: ApplicationDTO = mockFormValues as ApplicationDTO;
        spyOn(component.applicationFormComponent.applicationFormGroup, 'patchValue');
        component.loadForm(mockApplication);
        expect(component.applicationFormComponent.applicationFormGroup.patchValue).toHaveBeenCalledWith({
            applicationId: mockApplication.applicationId,
            name: mockApplication.name,
            type: mockApplication.type,
            lifecyclePhase: mockApplication.lifecyclePhase,
            systemSize: mockApplication.systemSize,
            deploymentType: mockApplication.deploymentType,
            language: mockApplication.language
        });
    });
    it("should load assessments when applicationId is set", fakeAsync(() => {
        const mockApplication: ApplicationDTO = mockFormValues as ApplicationDTO;
        spyOn(component, 'loadForm');
        const fetch = spyOn(assessmentService, 'fetchApplication').and.returnValue(Promise.resolve({
            json: () => Promise.resolve(mockApplication)} as Response));
        component.ngOnChanges();
        tick();
        fixture.detectChanges();
        expect(fetch).toHaveBeenCalled();
        expect(component.application).toEqual(mockApplication);
        expect(component.loadForm).toHaveBeenCalledWith(mockApplication);
    }));
    it("should call failed when updating fails", ()=>{
        spyOn(component.applicationFormComponent, "showFailed");
        spyOn(assessmentService, "updateApplicationContext").and.returnValue(Promise.reject(new Error("Update failed")));
        component.updateApplicationContext();
        expect(component.applicationFormComponent.showFailed).toHaveBeenCalled;
    })
});
