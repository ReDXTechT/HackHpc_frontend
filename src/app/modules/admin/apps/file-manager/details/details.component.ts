import {DatePipe, NgIf} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { Subject, takeUntil } from 'rxjs';
import {SubmissionsService} from "../../../../../core/services/submissions.service";

@Component({
    selector       : 'file-manager-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatButtonModule, RouterLink, MatIconModule, NgIf, DatePipe],
})
export class FileDetails implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    submission : any
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private submissionsService: SubmissionsService,
        private _activatedRoute: ActivatedRoute,
    )
    {
    }

    ngOnInit(): void
    {
        this._activatedRoute.params.subscribe(params => {
            const submissionId = params['id'];
            console.log(submissionId)
            this.submissionsService.getsubmissionsById(submissionId).subscribe(submission=>{
                this.submission=submission
                console.log(this.submission)
                this._changeDetectorRef.detectChanges()
            })
            // Use the submissionId to fetch the customer details and display them
        });
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._fileManagerListComponent.matDrawer.close();
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
