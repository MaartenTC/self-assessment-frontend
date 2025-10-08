import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from '@angular/core';
import { MeasurementDTO } from '../../dto/MeasurementDTO';
import { ResponseIconComponent } from '../global.component/ResponseIconComponent';
import { AssessmentService } from "../../service/AssessmentService"
import { TimestampAsDateStringPipe } from '../../pipes/TimestampAsDatePipe';

@Component({
    selector: 'measurement-history',
    template: `
        <dialog id="measurementHistoryDialog">
            <h2>Latest Measurement</h2>
            @if(showInfo) {
                <div class="measurement-details">
                    @if(measurement.creationDate != null){
                        <small>
                            Creation Date: {{ measurement.creationDate | TimestampAsDateStringPipe}}
                        </small>
                    }
                    <table>
                        <tr>
                            <th>Explanation</th>
                            <td id="explanation">{{ measurement.explanation }}</td>
                        </tr>
                        <tr>
                            <th>Finding</th>
                            <td>{{ measurement.finding.text }}</td>
                        </tr>
                        <tr>
                            <th>Risk</th>
                            <td>{{ measurement.finding.risk }}</td>
                        </tr>
                        @if(measurement.correction) {
                        <tr>
                            <th>Correction</th>
                            <td>{{ measurement.correction.correctionComment }}</td>
                        </tr>
                        <tr>
                            <th>New Risk</th>
                            <td>{{ measurement.correction.newRisk }}</td>
                        </tr>
                        }
                        </table>
                </div>
            }
            <response-icon-component [status]="responseStatus"></response-icon-component>
            <button class="close-button" (click)="close()">Close</button>
        </dialog>
    `,
    styleUrls: ["../../../styles.css"],
    styles: `
        th {
            text-align: left;
            vertical-align: top;
        }
        td {
            overflow-wrap: anywhere;
            white-space: normal;
            border-bottom: 1px solid gray;
        }
        table {
            max-width: 80vw;
            border: 1px solid gray;
            border-radius: 5px;
            padding: 5px;
            table-layout: fixed;
            word-wrap: break-word;
        }
        dialog {
            max-width: 50vw;
        }
        
    `,
    imports: [ResponseIconComponent, TimestampAsDateStringPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MeasurementHistoryComponent {
    @ViewChild(ResponseIconComponent) responseIconComponent!: ResponseIconComponent;
    showInfo: boolean = false;
    responseStatus : number = 500;
    assessmentService : AssessmentService = inject(AssessmentService);
    measurement : MeasurementDTO = {
            explanation : "",
            finding : {
                findingId : 0,
                normId: 0,
                text: '',
                risk: 0
            },
            correction : null,
            creationDate: 0
    };
    loadMeasurementHistory(applicationId : string, normId : number): void {
        this.responseStatus = 0;
        this.assessmentService.fetchLatestMeasurement(applicationId, normId).then((response) => {
            this.responseStatus = response.status;
            if (response.ok){
                response.json().then((data: MeasurementDTO) => {
                this.measurement = data;
                this.showInfo = true;
                })}
            this.responseStatus = response.status;
            }).catch(() => {
                this.responseStatus = 500;
            });
        }

    open() : void {
    const dialog = document.getElementById("measurementHistoryDialog") as HTMLDialogElement;
    if (dialog) {
        dialog.showModal();
    } else {
        console.error("Dialog element not found");
    }
}
    close() : void {
    this.showInfo = false;
    const dialog = document.getElementById("measurementHistoryDialog") as HTMLDialogElement;
    if (dialog) {
        dialog.close();
    } else {
        console.error("Dialog element not found");
    }
    }
}