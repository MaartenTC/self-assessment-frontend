import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  NewAssessmentDialogComponent } from '../NewAssessmentDialogComponent'; 

describe('NewAssessmentDialogComponent', () => {
  let component: NewAssessmentDialogComponent;
  let fixture: ComponentFixture<NewAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAssessmentDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});