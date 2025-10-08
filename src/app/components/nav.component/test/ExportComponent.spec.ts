import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ExportComponent } from "../ExportComponent";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AssessmentDTO } from "../../../dto/AssessmentDTO";
import { MeasurementDTO } from "../../../dto/MeasurementDTO";
import { FindingDTO } from "../../../dto/FindingDTO";
import { CorrectionDTO } from "../../../dto/CorrectionDTO";

describe("ExportComponent", () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;
  let dialog: HTMLDialogElement;

  const mockFinding: FindingDTO = {
    normId : 1,
    findingId: 1,
    text : "text",
    risk: 10
  };

  const mockCorrection: CorrectionDTO = {
    correctionComment : "comment",
    newRisk : 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ExportComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;

    // Create fake dialog in DOM
    dialog = document.createElement("dialog");
    dialog.id = "exportDialog";
    document.body.appendChild(dialog);

    fixture.detectChanges();
  });

  afterEach(() => {
    dialog.remove();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with default values", () => {
    const formValue = component.exportFormGroup.value;
    expect(formValue.startDate).toBe("1970-01-01");
    expect(formValue.endDate).toBe(new Date(Date.now()).toISOString().slice(0, 10));
  });

it("should open dialog and set form date", () => {
    const mockAssessment: AssessmentDTO = {
        applicationId : "id1",
        applicationName : "name",
      measurements: [],
      lastModified: 1620000000
    };

  const showModalSpy = spyOn(HTMLDialogElement.prototype, "showModal").and.callThrough();

  component.open(mockAssessment);

  expect(component.assessment).toEqual(mockAssessment);

  const patchedDate = component.exportFormGroup.value.startDate;
  expect(patchedDate).toBe("2021-05-03");

  expect(showModalSpy).toHaveBeenCalled();
});


  it("should filter measurements correctly by timestamp", () => {
    const m1: MeasurementDTO = {
      explanation: "Old",
      finding: mockFinding,
      correction: mockCorrection,
      creationDate: 1620001000
    };
    const m2: MeasurementDTO = {
      explanation: "Inside",
      finding: mockFinding,
      correction: mockCorrection,
      creationDate: 1620002000
    };
    const m3: MeasurementDTO = {
      explanation: "New",
      finding: mockFinding,
      correction: mockCorrection,
      creationDate: 1620003000
    };

    component.assessment = {
        applicationId : "id1",
        applicationName : "name",
      measurements: [m1, m2, m3],
      lastModified: 1620000000
    };

    const result = component.getMeasurementsBetweenDates(1620001500, 1620002500);
    expect(result).toEqual([m2]);
  });

  it("should export filtered assessment and trigger download", async () => {
    const measurement1: MeasurementDTO = {
      explanation: "Exported",
      finding: mockFinding,
      correction: mockCorrection,
      creationDate: 1620000000
    };

    const measurement2: MeasurementDTO = {
      explanation: "Excluded",
      finding: mockFinding,
      correction: mockCorrection,
      creationDate: 1720000000 // out of range
    };

    const assessment: AssessmentDTO = {
        applicationId : "id1",
        applicationName : "name",
      measurements: [measurement1, measurement2],
      lastModified: 1620000000
    };

    component.assessment = assessment;

    component.exportFormGroup.setValue({
      startDate: "2021-05-03",
      endDate: "2021-05-03"
    });

    spyOn(document.body, "appendChild").and.callThrough();
    spyOn(document.body, "removeChild").and.callThrough();
    const createObjectURLSpy = spyOn(window.URL, "createObjectURL").and.returnValue("blob:url");
    const revokeObjectURLSpy = spyOn(window.URL, "revokeObjectURL");

    await component.exportAssessment();

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });
});
