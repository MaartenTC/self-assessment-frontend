import {
  Component,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  Output,
  EventEmitter,
  inject,
  HostListener
} from "@angular/core";
import { NormsetDTO } from "../../dto/NormsetDTO";
import { NormDTO } from "../../dto/NormDTO";
import { FindingDTO } from "../../dto/FindingDTO";
import { AssessmentType, AssessmentTypeValue } from "../../enums/AssessmentType";
import { FormsModule } from "@angular/forms";
import { AssessmentService } from "../../service/AssessmentService";
import { NormsetService } from "../../service/NormsetService";
import { TimestampAsDateStringPipe } from "../../pipes/TimestampAsDatePipe";

@Injectable({ providedIn: 'root' })
@Component({
  selector: "normset-component",
  template: `
    <div class="container">
      <div id="normsetContainerDiv">
        <div id="normsetHeader">
          <div>
            <h2>{{ normset.name }}</h2>
            <p>Version: {{ normset.version }}</p>
            <p>Link: <a [href]="normset.link" target="_blank">{{ normset.link }}</a></p>
          </div>
        </div>

        <div id="normListDiv">
          <div id="filterContainer">
            <div>
              <img alt="filter normset" id="filterButton" type="button" src="filter_icon.png" (click)="setFilterActive()" [class.active]="filterActive">
              <div id="filterContent" [class.active]="filterActive">
                <select name="assessmentType" id="assessmentTypeSelect" [(ngModel)]="activeAssessmentType">
                @for (assessmentType of assessmentTypes; track $index) {
                  <option value={{assessmentType}} (click)="updateActiveFilters()">{{ assessmentType.toLowerCase() }}</option>
                }
                </select>
                <hr>
                @for (category of categories; track $index) {
                  <label>
                    <input type="checkbox"
                           class="checkbox"
                           [(ngModel)]="filterState[category]"
                           (ngModelChange)="updateActiveFilters()">
                    {{ category.toLowerCase() }}
                  </label>
                }
                <button class="primary-button" id="resetFilters" (click)="toggleAllFilters()">{{toggleText}}</button>
              </div>
            </div>
          </div>
          <ul>
            @for (norm of normset.norms; track norm.normId) {
              @if (activeFilters.includes(norm.assessmentType) && compareCategories(norm.categories, activeFilters)) {
                <li id="normListItem" [class.expanded]="isExpanded(norm.normId)">
                  <div id="normListItemContainer" [class.expanded]="isExpanded(norm.normId)">
                    <div id="normInfoHeaderContainer">
                      <span id="normInfoHeader">
                        <h3>{{ norm.name }}</h3>
                        <div id="normInfoHeaderButtons">
                          <img id="historyButton" type="button" src="history_icon.png" alt="measurement history" (click)="historyDialogOpen.emit(norm.normId)" />
                          <button class="toggleButton" (click)="toggleNormExpansion(norm.normId)">{{getIcon(norm.normId)}}</button>
                        </div>
                      </span>
                        @if(norm.lastModified != null) {
                          <small>last measurement: {{norm.lastModified | TimestampAsDateStringPipe}}</small>
                        }
                        @else{
                            <small>last measurement: never</small>
                        }
                        @if(latestRiskByNormId.get(norm.normId) != null) {
                            <small style="display: block">latest risk: {{latestRiskByNormId.get(norm.normId)}}</small>
                        }
                    </div>
                    <p id="norm-explanation">{{ norm.explanation }}</p>
                    <table>
                      <tr class="normFindingRow">
                        <th>Finding</th>
                        <th class="riskHead">Risk</th>
                      </tr>
                      @for (finding of norm.findings; track $index) {
                        <tr (click)="findingSelected.emit({norm, finding})" class="normFindingRow">
                          <td class="findingText">{{ finding.text }}</td>
                          <td class="findingRisk" [style.background]="riskColor(finding.risk)">{{ finding.risk }}</td>
                        </tr>
                      }
                    </table>
                  </div>
                </li>
              }
            }
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../../styles.css","./NormsetStyle.css"],
  imports: [FormsModule, TimestampAsDateStringPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NormsetComponent {
    @Output() historyDialogOpen : EventEmitter<number> = new EventEmitter<number>();
    @Output() findingSelected : EventEmitter<{"norm" : NormDTO, "finding" : FindingDTO}> = new EventEmitter<{"norm" : NormDTO, "finding" : FindingDTO}>();
    assessmentTypes: Array<string> = [];
    categories: Array<string> = [];
    activeFilters: Array<string> = [];
    activeAssessmentType: AssessmentType = AssessmentType.HEAVY;
    filterState: { [key: string]: boolean } = {};
    allSelected!: boolean;
    toggleText! : string;
    filterActive: boolean = false;
    expandedNorms: { [normId: number]: boolean } = {};
    latestRiskByNormId: Map<number, number | null> = new Map();
    normset: NormsetDTO = {
        name: "naam",
        version: "",
        link: "",
        norms: []
    };
    assessmentService = inject(AssessmentService);
    normsetService = inject(NormsetService);

    fetchNormset(currentApplicationId : string): void {
        this.normsetService.fetchNormset(currentApplicationId).then(response => response.text())
        .then(responseText => {
            this.normset = JSON.parse(responseText);
            this.normset.norms = this.sortNormsetByLastModified(this.normset.norms)
            this.loadFilters();
            this.assessmentService.fetchLatestRiskByNorms(currentApplicationId, this.normset.norms).then(response => response.json())
            .then((riskMap: Map<number, number | null>) => {
                this.latestRiskByNormId.clear();
                Object.entries(riskMap).forEach(([normId, risk]) => {
                    this.latestRiskByNormId.set(+normId, risk)
                });
            });
        });

    }
    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
      if (!this.filterActive) return;
      const target = event.target as HTMLElement;
      const filterContainer = document.getElementById('filterContainer');

      if (filterContainer && !filterContainer.contains(target)) {
        this.filterActive = false;
      }
    }

    toggleNormExpansion(normId : number): void {
        /**
         * Toggle the expansion state of the norm with the given normId
         */
        this.expandedNorms[normId] = !this.expandedNorms[normId];
    }
    isExpanded(normId: number): boolean {
        /**
         * Check if the norm with the given normId is expanded
         */
        return this.expandedNorms[normId] || false;
    }
    getIcon(normId: number): string {
        return this.expandedNorms[normId] ? '▼' : '▶';
    }

    loadFilters(): void {
      /**
       * Load the assessment types and categories from the normset into the filterbutton
       */
        this.assessmentTypes = Object.values(AssessmentType);
        this.assessmentTypes.sort((type1, type2) => AssessmentTypeValue[type1] - AssessmentTypeValue[type2]); // assure that the assessment types go from light to heavy
        for (let norm of this.normset.norms) {
        norm.categories.forEach(category => {
            const cat : string = category;
            if (!this.categories.includes(cat)) {
              this.categories.push(cat);
            }
        });
        }
        [...this.assessmentTypes, ...this.categories].forEach(item => {
        this.filterState[item] = true;
        });
        this.updateActiveFilters();
        this.allSelected = true;
        this.toggleText = "Deselect All";
    }
    updateActiveFilters(): void {
        Object.keys(AssessmentTypeValue).forEach(type => {
          if (AssessmentTypeValue[type] <= AssessmentTypeValue[this.activeAssessmentType]) {
              this.filterState[type] = true;
          }
          else {
              this.filterState[type] = false;
          }
        })

        this.activeFilters = Object.entries(this.filterState)
        .filter(([_, checked]) => checked)
        .map(([key, _]) => key);
    }

    toggleAllFilters(): void {
        this.allSelected = !this.allSelected;
        this.toggleText = this.allSelected ? "Deselect All" : "Select All";
        Object.keys(this.filterState).forEach(key => {
        this.filterState[key] = this.allSelected;
        });
        this.updateActiveFilters();
    }
    setFilterActive(): void {
      this.filterActive = !this.filterActive;
    }
    compareCategories(list1: string[], list2: string[]): boolean {
        return list1.some(item => list2.includes(item));
    }
    riskColor(risk: number): string {
        // https://chatgpt.com/c/684316f5-9830-800b-bb07-8a34ee7e867a
        const normalizedRisk = Math.min(Math.max(risk, 0), 100) / 100;
        const green = { r: 0, g: 255, b: 0 };
        const yellow = { r: 255, g: 255, b: 0 };
        const red = { r: 255, g: 0, b: 0 };
        let r, g, b;

        if (normalizedRisk <= 0.5) {
        const ratio = normalizedRisk / 0.5;
        r = Math.round(green.r + ratio * (yellow.r - green.r));
        g = Math.round(green.g + ratio * (yellow.g - green.g));
        b = Math.round(green.b + ratio * (yellow.b - green.b));
        } else {
        const ratio = (normalizedRisk - 0.5) / 0.5;
        r = Math.round(yellow.r + ratio * (red.r - yellow.r));
        g = Math.round(yellow.g + ratio * (red.g - yellow.g));
        b = Math.round(yellow.b + ratio * (red.b - yellow.b));
        }

        return `rgb(${r}, ${g}, ${b}, 0.5)`;
    }
    sortNormsetByLastModified(norms: Array<NormDTO>): Array<NormDTO> {
      return norms.sort((norm1, norm2) => {
        return norm1.lastModified - norm2.lastModified;
      })
    }
}
