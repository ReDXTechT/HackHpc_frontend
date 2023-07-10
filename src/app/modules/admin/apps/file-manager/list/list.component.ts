import {DatePipe, NgFor, NgIf} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

import { Subject, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../core/services/competition.service";
import {SubmissionsService} from "../../../../../core/services/submissions.service";
import {UsersService} from "../../../../../core/services/users.service";

@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatSidenavModule, RouterOutlet, NgIf, RouterLink, NgFor, MatButtonModule, MatIconModule, MatTooltipModule, DatePipe],
})
export class FileManagerListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    activeCompetitions: any[];
    terminatedCompetitions: any[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    condidats : any[]
    submissions : any[]
    competitions = ''
    candidat : any
    competitionId: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private competitionService: CompetitionService,
        private submissionsService: SubmissionsService,
        private usersService: UsersService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    )
    {
    }

    ngOnInit(): void
    {
        this.getactiveCompetitions()
        this._activatedRoute.params.subscribe(params => {
            this.competitionId = params['folderId'];
            if( this.competitionId){
                this.competitions= 'candidats'
                console.log( this.competitionId)
                this.getTeamByCompetitionId( this.competitionId)
                this._changeDetectorRef.detectChanges()
                console.log(this.competitions)

            }
        });
        this._activatedRoute.params.subscribe(params => {
            const competitorId = params['fileId'];
            const competitionId = params['compId'];

            if(competitorId){
                this.usersService.getCompetitorDetailsById(competitorId).subscribe(res=>{
                    this.candidat = res
                    this._changeDetectorRef.detectChanges()
                })
                this.competitions= 'submissions'
                this.getsubmissionsByCompetitor(competitorId,competitionId)
                this._changeDetectorRef.detectChanges()

            }
        });

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) =>
            {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    getTeamByCompetitionId(competitionId: string){
        this.competitionService.getTeamByCompetitionId(competitionId).subscribe(res=>{
            console.log(res)
            this.condidats=res
            this._changeDetectorRef.detectChanges()
        })
        this._changeDetectorRef.detectChanges()

    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    getactiveCompetitions(){
        this.competitionService.getActiveCompetitions().subscribe(res=>{
            console.log(res)
            this.activeCompetitions = res
            this._changeDetectorRef.detectChanges()
        })
    }
    getterminatedCompetitions(){
        this.competitionService.getTerminatedCompetitions().subscribe(res=>{
            console.log(res)
            this.terminatedCompetitions = res
            this._changeDetectorRef.detectChanges()
        })
    }

    getsubmissionsByCompetitor(competitorId:any,competitionId:any){
        this.submissionsService.getsubmissionsByCompetitiorId(competitorId,competitionId).subscribe(res=>{
            console.log(res)
            this.submissions = res

            this._changeDetectorRef.detectChanges()
        })
    }
    getLowestExecutionTime(): string {
        let lowestTime = Number.MAX_VALUE;
        let lowestTimeSubmission: any = null;

        for (const submission of this.submissions) {
            const executionTime = parseFloat(submission.execution_runtime);

            if (executionTime < lowestTime) {
                lowestTime = executionTime;
                lowestTimeSubmission = submission;
            }
        }

        return lowestTimeSubmission ? lowestTimeSubmission.execution_runtime : '';
    }

}
