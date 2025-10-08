import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HeaderComponent } from "../HeaderComponent";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({imports: [HeaderComponent]})
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should unlock secret when clicked 100 times", () => {
    const secretEvent = spyOn(component.secretUnlocked, 'emit');
    for (let i = 0; i < 100; i++) {
      component.updateCounter();
    }
    expect(secretEvent).toHaveBeenCalled();
  });
});