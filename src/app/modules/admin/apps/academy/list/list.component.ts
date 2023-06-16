import { CdkScrollable } from '@angular/cdk/scrolling';
import { I18nPluralPipe, NgClass, NgFor, NgIf, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../core/services/competition.service";
import {Competition} from "../../../../../core/models/competiton";

@Component({
    selector       : 'academy-list',
    templateUrl    : './list.component.html',
    styleUrls: ['./list.component.sass'],

    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatIconModule,CdkScrollable, MatFormFieldModule, MatSelectModule, MatOptionModule, NgFor, MatIconModule, MatInputModule, MatSlideToggleModule, NgIf, NgClass, MatTooltipModule, MatProgressBarModule, MatButtonModule, RouterLink, FuseFindByKeyPipe, PercentPipe, I18nPluralPipe],
})
export class AcademyListComponent implements OnInit, OnDestroy
{
    hideCompleted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    competitions: Competition[] = [];
    status = '';
    code_type = '';
    title = '';

    codeTypes: { value: string, label: string }[] = [
        { value: 'openacc', label: 'OpenACC' },
        { value: 'openmp', label: 'OpenMP' },
        { value: 'mpi', label: 'MPI' },
        { value: 'c_cpp', label: 'C/C++' }
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private competitionService: CompetitionService,
        private route: ActivatedRoute,

        private changeDetectorRef: ChangeDetectorRef
    )
    {
    }
    ngOnInit(): void
    {

        this.getAllApprovedCompetitions()

    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllApprovedCompetitions() {
        this.competitionService.getAllApprovedCompetitions().subscribe(
            (data) => {
                console.log(data)
                this.competitions=data
                this.changeDetectorRef.detectChanges();

            },
            (error) => {
                console.log('Error getting approved courses:', error);
            }
        );

    }
    getAllApprovedNotCompletedCompetitions() {
        this.competitionService.getAllApprovedNotCompletedCompetitions().subscribe(
            (data) => {
                console.log(data)
                this.competitions=data
                this.changeDetectorRef.detectChanges();

            },
            (error) => {
                console.log('Error getting approved not completed courses:', error);
            }
        );

    }

    getFilteredCompetitions() {
        this.competitionService.getFilteredCompetitions(this.status, this.title, this.code_type)
            .subscribe(response => {
                this.competitions = response;
                this.changeDetectorRef.detectChanges();
                console.log(this.competitions);
            });
    }

    onSearch(query: string) {

        this.title = query;
        this.getFilteredCompetitions()
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    onCodeTypeSelect(selectedCodeType: string) {
        this.code_type = selectedCodeType;
        if (selectedCodeType == 'all'){
            this.getAllApprovedCompetitions()
        }
        else {
            this.changeDetectorRef.detectChanges();
            this.getFilteredCompetitions();
        }

    }

    toggleCompleted(change: MatSlideToggleChange): void {
        this.hideCompleted$.next(change.checked);
        if (change.checked) {
            this.getAllApprovedNotCompletedCompetitions();
        } else {
            this.getAllApprovedCompetitions();
        }
        this.changeDetectorRef.detectChanges();
    }

    // getProgressValue(competition: Competition): number {
    //     if (competition.status === 'Running') {
    //         const startDate = new Date(competition.starting_date).getTime();
    //         const winnerDate = new Date(competition.winner_announcement_date).getTime();
    //         const currentDate = new Date().getTime();
    //         const totalDuration = winnerDate - startDate;
    //         const elapsedDuration = currentDate - startDate;
    //         console.log('startDate',competition.starting_date)
    //         console.log('winnerDate',winnerDate)
    //         console.log('currentDate',currentDate)
    //         console.log('totalDuration',totalDuration)
    //         console.log('elapsedDuration',elapsedDuration)
    //         console.log('(elapsedDuration / totalDuration) * 100',(elapsedDuration / totalDuration) * 100)
    //         return (elapsedDuration / totalDuration) * 100;
    //     }
    //     return 0;
    // }
    getProgressValue(competition: Competition): number {
        if (competition.status === 'Running') {
            const startDate = new Date(competition.starting_date).getTime();
            const winnerDate = new Date(competition.winner_announcement_date).getTime();
            const currentDate = new Date().getTime();
            const totalDuration = winnerDate - startDate;
            const elapsedDuration = Math.max(currentDate - startDate, 0);
            return (elapsedDuration / totalDuration) * 100;
        }
        return 0;
    }
    getProgressTooltip(competition: Competition): string {
        if (competition.status === 'Running') {
            const startDate = new Date(competition.starting_date).getTime();
            const winnerDate = new Date(competition.winner_announcement_date).getTime();
            const currentDate = new Date().getTime();
            const totalDuration = winnerDate - startDate;
            const elapsedDuration = Math.max(currentDate - startDate, 0);
            const progressPercentage = ((elapsedDuration / totalDuration) * 100).toFixed(2);
            return `Progress: ${progressPercentage}%`;
        }
        return 'Progress: Not Applicable';
    }


}
