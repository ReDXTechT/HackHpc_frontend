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
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {Competition} from "../../../../../core/models/competiton";
import {CompetitionService} from "../../../../../core/services/competition.service";

@Component({
    selector       : 'edit-overview',
    templateUrl    : './test-competition.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [NgIf, MatButtonModule, MatIconModule, FormsModule, TextFieldModule, NgFor, MatCheckboxModule, NgClass, MatRippleModule, MatMenuModule, MatDialogModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatSelectModule, MatRadioModule],
})
export class TestCompetition implements OnInit
{
    competition: Competition;
    updateFrom: UntypedFormGroup
    amis : any[]
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { competition: any },
        private competitionService: CompetitionService,
        private _matDialogRef: MatDialogRef<TestCompetition>,
        private _formBuilder: UntypedFormBuilder,
    )
    {
        this.competition=this._data.competition
    }

    ngOnInit(): void
    {
        console.log(this._data.competition.ami)
        this.getAmis()

        this.updateFrom = this._formBuilder.group({
            instance_type: [this.competition.instance_type, Validators.required],
            ami: [this.competition.ami, Validators.required],
        });

    }
    getAmis(){
            this.competitionService.getamis().subscribe(res=>{
                this.amis=res
                console.log(res)
            })
    }

    updateCompetition(): void
    {
        // Retrieve the updated competition data from the form
        const testCompetition = {
            instance_type: this.updateFrom.value.instance_type,
            ami: this.updateFrom.value.ami,

        };
        // Pass the updated competition data back to the parent component
        this._matDialogRef.close(testCompetition);
    }
    close(){
        this._matDialogRef.close()
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
