import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotesService } from 'app/modules/admin/apps/notes/notes.service';
import { Label, Note, Task } from 'app/modules/admin/apps/notes/notes.types';
import { debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../../core/services/competition.service";
import {Competition} from "../../../../../../core/models/competiton";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

@Component({
    selector       : 'edit-overview',
    templateUrl    : './edit-overview.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [NgIf, MatButtonModule, MatIconModule, FormsModule, TextFieldModule, NgFor, MatCheckboxModule, NgClass, MatRippleModule, MatMenuModule, MatDialogModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatSelectModule, MatRadioModule],
})
export class EditOverview implements OnInit
{
    competition: Competition;
    updateFrom: UntypedFormGroup
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { competition: any },
        private competitionService: CompetitionService,
        private _matDialogRef: MatDialogRef<EditOverview>,
        private _formBuilder: UntypedFormBuilder,
    )
    {
        this.competition=this._data.competition
    }

    ngOnInit(): void
    {
        console.log(this._data)
        this.updateFrom = this._formBuilder.group({
            title: [this.competition.title, Validators.required],
            git_repo_url: [this.competition.git_repo_url, Validators.required],
            code_type: [this.competition.code_type, Validators.required],
            sponsor: [this.competition.sponsor, Validators.required],
            instance_type: [this.competition.instance_type],
            ami: [this.competition.ami],
            project_description: [this.competition.project_description, Validators.required],
            skills_required: [this.competition.skills_required, Validators.required],
            optimization_guidelines: [this.competition.optimization_guidelines, Validators.required],
            max_competitors: [this.competition.max_competitors, Validators.required],
            winner_announcement_date: [this.competition.winner_announcement_date, Validators.required],
            submission_deadline: [this.competition.submission_deadline, Validators.required],
            starting_date: [this.competition.starting_date, Validators.required],

            processor : [this.competition.target_architecture.processor, Validators.required],
            vcpu  : [this.competition.target_architecture.vcpu, Validators.required],
            cpu_memory  : [this.competition.target_architecture.cpu_memory, Validators.required],
            storage    : [this.competition.target_architecture.storage,Validators.required],
            graphics_card : [this.competition.target_architecture.graphics_card ||''],
            graphics_card_memory : [this.competition.target_architecture.graphics_card_memory ||''],
            parallel_processing_units : [this.competition.target_architecture.parallel_processing_units ||''],
            architectureType: [ this.competition.target_architecture.graphics_card ? 'GPU' : 'CPU', Validators.required],
        });

    }


    updateCompetition(): void
    {
        // Retrieve the updated competition data from the form
        const updatedCompetition = {
            title: this.updateFrom.value.title,
            git_repo_url: this.updateFrom.value.git_repo_url,
            code_type: this.updateFrom.value.code_type,
            sponsor: this.updateFrom.value.sponsor,
            project_description: this.updateFrom.value.project_description,
            skills_required: this.updateFrom.value.skills_required,
            optimization_guidelines: this.updateFrom.value.optimization_guidelines,
            max_competitors: this.updateFrom.value.max_competitors,
            winner_announcement_date: this.updateFrom.value.winner_announcement_date,
            submission_deadline: this.updateFrom.value.submission_deadline,
            starting_date: this.updateFrom.value.starting_date,
            target_architecture: {
                processor: this.updateFrom.value.processor,
                vcpu: this.updateFrom.value.vcpu,
                cpu_memory: this.updateFrom.value.cpu_memory,
                storage: this.updateFrom.value.storage,
                graphics_card:
                    this.updateFrom.value.graphics_card === 'CPU'
                        ? null
                        : this.updateFrom.value.graphics_card,
                graphics_card_memory: this.updateFrom.value.graphics_card_memory || null,
                parallel_processing_units: this.updateFrom.value.parallel_processing_units || null,
            },
        };
        // Pass the updated competition data back to the parent component
        this._matDialogRef.close(updatedCompetition);
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
