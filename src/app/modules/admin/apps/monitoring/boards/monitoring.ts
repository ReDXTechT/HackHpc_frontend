import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import {AnalyticsComponent} from "../analytics/analytics.component";
import {Competition} from "../../../../../core/models/competiton";
import {CompetitionService} from "../../../../../core/services/competition.service";

@Component({
    selector       : 'scrumboard-boards',
    templateUrl    : './monitoring.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [CdkScrollable, NgFor, RouterLink, MatIconModule, NgIf],
})
export class MonitoringCompetitionsComponent implements OnInit
{
    activeCompetitions: Competition[];

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private competitionService: CompetitionService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
this.getActivecompetitions()
    }

    getActivecompetitions() {
        this.competitionService.getActiveCompetitions().subscribe(res => {
            this.activeCompetitions = res;
            for (let i = 0; i < this.activeCompetitions.length; i++) {
                const competition = this.activeCompetitions[i];
                this.competitionService.getTeamByCompetitionId(competition.id).subscribe(res => {
                    console.log(res);
                    competition.competitors = res;
                    this._changeDetectorRef.detectChanges();
                    console.log(competition.competitors)

                });
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    getDaysSinceStart(startingDate: Date): number {
        const startDate = new Date(startingDate);
        const today = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference = today.getTime() - startDate.getTime();

        // Convert the time difference to days
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return days;
    }
    /**
     * Format the given ISO_8601 date as a relative date
     *
     * @param date
     */
    formatDateAsRelative(date: string): string
    {
        return DateTime.fromISO(date).toRelative();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
