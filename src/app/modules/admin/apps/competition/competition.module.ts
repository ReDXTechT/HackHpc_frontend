import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatStepperModule} from "@angular/material/stepper";
import {MatOptionModule} from "@angular/material/core";
import {AddCompetition} from "./add-competition/add-competition.component";
import {CompetitionRoutes} from "./competition.routes";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ReportComponent} from "./report/report.component";
import {ChangeBgDirective} from "../academy/details/quizz_passing/change-bg.directives";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
    declarations: [
        AddCompetition,
        ReportComponent,
        ChangeBgDirective
    ],
    imports: [
        CommonModule,
        CompetitionRoutes,
        MatIconModule,
        FormsModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSnackBarModule,
        MatTooltipModule,

    ],
    providers: [DatePipe],
    exports: [
        ChangeBgDirective
    ]
})
export class CompetitionModule {}
