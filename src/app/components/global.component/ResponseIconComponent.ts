import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import {SpinnerComponent} from './SpinnerComponent';

@Component({
  selector: "response-icon-component",
  template: `
    <div [class.hidden]="hidden">
      @if (show400) {
        <div class="icon-container">
          <img src="search_icon.png" alt="not found icon"/>
          <p>Not found</p>
        </div>
      } @else if (show500) {
        <div class="icon-container">
          <img src="500_icon.png" alt="internal server error icon"/>
          <p>Something went wrong...</p>
        </div>
      } @else {
        <div class="icon-container">
          <spinner></spinner>
        </div>
      }
    </div>
  `,
  styles: `
    .icon-container {
      text-align: center;
    }

    img {
      height: 200px;
      width: auto;
    }

    .hidden {
      display: none;
    }


  `,
  imports: [
    SpinnerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ResponseIconComponent {
    show400: boolean = false;
    show500: boolean = false;
    hidden : boolean = false;

    @Input() set status(value: number) {
    this.show400 = false;
    this.show500 = false;
    this.hidden = false;
    if (value >= 400 && value < 500) {
        this.show400 = true;
    } else if (value >= 500 && value < 600) {
        this.show500 = true;
    } else if (value >= 200 && value < 300) {
        this.hidden = true;
    }

    }
}
