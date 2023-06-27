import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormArray, FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {CompetitionService} from "../../../../../../core/services/competition.service";
import {Competition} from "../../../../../../core/models/competiton";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

@Component({
    selector       : 'AnnounceWinners',
    templateUrl    : './announce-winnerscomponent.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [NgIf, MatButtonModule, MatIconModule, FormsModule, TextFieldModule, NgFor, MatCheckboxModule, NgClass, MatRippleModule, MatMenuModule, MatDialogModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatSelectModule, MatRadioModule],
})
export class AnnounceWinners implements OnInit
{
    competition: Competition;
    winner_announcement: UntypedFormGroup
    competitors: any[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { competition: any },
        private competitionService: CompetitionService,
        private _matDialogRef: MatDialogRef<AnnounceWinners>,
        private _formBuilder: UntypedFormBuilder,
    )
    {
        this.competition=this._data.competition
    }

    ngOnInit(): void
    {

        console.log(this._data)
        this.winner_announcement = this._formBuilder.group({
            achievements: this._formBuilder.array([])

        });
        this.addWinner()

        this.getTeamByCompetitionId(this._data.competition.id)

    }

    get achievements(): FormArray {
        return this.winner_announcement.get('achievements') as FormArray;
    }
    createWinnerGroup(): FormGroup {
        return this._formBuilder.group({
            competitor: ['', Validators.required],
            prize: ['', Validators.required],
            level: ['', Validators.required]
        });
    }

    addWinner(item?: any): void {
        const winnerGroup = this.createWinnerGroup();
        const winners = this.winner_announcement.get('achievements') as FormArray;
        winners.push(winnerGroup);
        this._changeDetectorRef.markForCheck();
    }
    removeWinner(index: number): void {

        const winners = this.winner_announcement.get('achievements') as FormArray;
        winners.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }
    getTeamByCompetitionId(competitionId: number){
        this.competitionService.getTeamByCompetitionId(competitionId).subscribe(res=>{
            console.log(res)
            this.competitors=res
        })
        this._changeDetectorRef.detectChanges()

    }
    winner_annoucement(): void
    {
        console.log(this.winner_announcement.value)
        this._matDialogRef.close(this.winner_announcement.value);
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
