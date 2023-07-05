import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {ScrumboardBoardsComponent} from "../../admin/apps/scrumboard/boards/boards.component";
import {CdkScrollable} from "@angular/cdk/scrolling";
import {NgFor, NgIf} from "@angular/common";
import {Subject} from "rxjs";
import {DateTime} from "luxon";
import {CompetitionService} from "../../../core/services/competition.service";
import {Competition} from "../../../core/models/competiton";
import {AuthenticationService} from "../../../core/services/authentication.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatSnackBarModule ,MatButtonModule, RouterLink, MatIconModule, ScrumboardBoardsComponent, CdkScrollable, NgFor, RouterLink, MatIconModule, NgIf],
})
export class LandingHomeComponent implements OnInit {
    /**
     * Constructor
     */

    activeCompetitions: Competition[];
    CompetitionsWillStartSoon: Competition[];

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _snackbar: MatSnackBar,
                private router: Router,
                private authenticationService: AuthenticationService,
                private competitionService: CompetitionService,
    ) {

    }

    ngOnInit(): void {

        this.getActivecompetitions()
        this.getComingSooncompetitions()
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

    getComingSooncompetitions() {
        this.competitionService.getAllComingSoonCompetitions().subscribe(res => {
            this.CompetitionsWillStartSoon = res;
            for (let i = 0; i < this.CompetitionsWillStartSoon.length; i++) {
                const competition = this.CompetitionsWillStartSoon[i];
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


    getDaysSinceStart(startingDate: string): number {
        const startDate = new Date(startingDate);
        const today = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference = today.getTime() - startDate.getTime();

        // Convert the time difference to days
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return days;
    }

    addActiveCompetition() {

        if (!this.authenticationService.currentUserValue || this.authenticationService.currentUserValue.role==='Competitor' ) { // replace authService with the actual name of your authentication service
            // User is not logged in
            this._snackbar.open('To be able to create a competition you need to create an account on Hack HPC as a Customer or if you have already an account please sign in.', 'Close', {
                duration: 5000,
            });
            const attemptedUrl = this.router.url;
            this.router.navigate(['/sign-in'], {queryParams: {returnUrl: attemptedUrl}});
        } else {
            const attemptedUrl = this.router.url;
            this.router.navigate(['/apps/competition/add-competition'], {queryParams: {returnUrl: attemptedUrl}});
        }
    }

    formatDateAsRelative(date: string): string {
        return DateTime.fromISO(date).toRelative();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
