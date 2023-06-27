import {AsyncPipe, DatePipe, NgFor, NgIf, TitleCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {Activity} from 'app/modules/admin/pages/activities/activities.types';
import {DateTime} from 'luxon';
import {Observable} from 'rxjs';
import {UsersService} from "../../../../core/services/users.service";
import {AuthenticationService} from "../../../../core/services/authentication.service";

@Component({
    selector: 'activity',
    templateUrl: './activities.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, NgFor, MatIconModule, RouterLink, AsyncPipe, TitleCasePipe, DatePipe],
})
export class ActivitiesComponent implements OnInit {
    activities: any[] = [];

    constructor(private usersService: UsersService,
                private authenticationService: AuthenticationService,
                private _changeDetectorRef: ChangeDetectorRef,
                private router: Router

    ) {
        this.usersService.getCustomerActivities(this.authenticationService.currentUserValue.id).subscribe(res=>{
            this.activities=res
            console.log(this.activities.length)
        })
    }
    ngOnInit(): void {
        this.usersService.getCustomerActivities(this.authenticationService.currentUserValue.id).subscribe(res=>{
            this.activities=res
            console.log(this.activities)
            this._changeDetectorRef.detectChanges()
        })
    }

    navigateToCompetitionWaitingList(competitionId: number) {
        this.router.navigate(['/apps/competitions', competitionId], { fragment: 'WaitingList' });
    }
    navigateToCompetitionCondidats(competitionId: number) {
        this.router.navigate(['/apps/competitions', competitionId], { fragment: 'Team' });
    }

    navigateToCompetitionWinners(competitionId: number) {
        this.router.navigate(['/apps/competitions', competitionId], { fragment: 'Winners' });
    }


    /**
     * Returns whether the given dates are different days
     *
     * @param current
     * @param compare
     */
    isSameDay(current: string, compare: string): boolean {
        return DateTime.fromISO(current).hasSame(DateTime.fromISO(compare), 'day');
    }

    /**
     * Get the relative format of the given date
     *
     * @param date
     */
    getRelativeFormat(date: string): string {
        return DateTime.fromISO(date).toRelativeCalendar();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
