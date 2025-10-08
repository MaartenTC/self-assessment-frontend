import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'header-placeholder',
  template: `
      <img src="assessment_logo.png" (click)="updateCounter()">

  `,
  styles: `
      img {
      height: 100%;
      width: auto;
      object-fit: contain;
      }

  `

})
export class HeaderComponent {

    @Output() secretUnlocked = new EventEmitter();
    count : number = 1;
    updateCounter(): void {
      this.count++;
    if(this.count % 100 === 0) {
        this.secretUnlocked.emit();
    }
  }
}
