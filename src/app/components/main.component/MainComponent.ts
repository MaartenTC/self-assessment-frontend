import { Component, Input, ViewChild } from "@angular/core";
import { MeasurementComponent } from "./MeasurementComponent";
import { NormsetComponent } from "./NormsetComponent";
import { MeasurementHistoryComponent } from "./MeasurementHistoryComponent";
import { NormDTO } from "../../dto/NormDTO";
import { FindingDTO } from "../../dto/FindingDTO";

@Component({
    selector: "main-component",
    template: `
        <div class="main-container">
            <normset-component (historyDialogOpen)="openLatestMeasurementDialog($event)" (findingSelected)="startMeasurement($event.norm, $event.finding)"/>
            <measurement-history />
            <measurement-component (measurementMadeEvent)="reloadNormset()" />
        </div>
    `,
    styleUrls: ["../../../styles.css"],
    styles: `
        .main-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas: "normset measurement";
            padding-left: 3%;
            padding-right: 3%;
            width: 100%;
            height:inherit;
        }
        normset-component {
            grid-area: normset;
            height:inherit;
        }
        measurement-component {
            grid-area: measurement;
            height:inherit;
        }

    `,
    imports: [MeasurementComponent, NormsetComponent, MeasurementHistoryComponent]
})
export class MainComponent{
    @Input() currentApplicationId!: string;
    @ViewChild(NormsetComponent) normsetComponent!: NormsetComponent;
    @ViewChild(MeasurementComponent) measurementComponent!: MeasurementComponent;
    @ViewChild(MeasurementHistoryComponent) measurementHistoryComponent!: MeasurementHistoryComponent;

    ngAfterViewInit(): void {
        this.normsetComponent.fetchNormset(this.currentApplicationId);
    }
    ngOnChanges(): void {
        if(this.normsetComponent){
        this.normsetComponent.fetchNormset(this.currentApplicationId);
        }
    }

    startMeasurement(norm: NormDTO, finding: FindingDTO): void {
        this.measurementComponent.startMeasurement(norm, finding, this.currentApplicationId);
    }

    openLatestMeasurementDialog(normId : number): void {
        this.measurementHistoryComponent.loadMeasurementHistory(this.currentApplicationId, normId );
        this.measurementHistoryComponent.open();
    }
    reloadNormset(): void {
        this.normsetComponent.fetchNormset(this.currentApplicationId);

    }


}
