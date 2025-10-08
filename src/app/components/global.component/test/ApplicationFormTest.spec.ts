import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import { ApplicationFormComponent } from "../applicationForm";
describe('ApplicationFormComponent', () => {
  let component: ApplicationFormComponent;

  beforeEach(() => {
    component = new ApplicationFormComponent(); 
  });

  it('should set success to true then null in showSuccess()', fakeAsync(() => {
    component.showSuccess();
    expect(component.success).toBeTrue();

    tick(2999);
    expect(component.success).toBeTrue(); 

    tick(1); 
    expect(component.success).toBeNull();
  }));

  it('should set success to false then null in showFailed()', fakeAsync(() => {
    component.showFailed();
    expect(component.success).toBeFalse();

    tick(2999);
    expect(component.success).toBeFalse(); 

    tick(1); 
    expect(component.success).toBeNull();
  }));
});