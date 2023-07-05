import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../../core/services/competition.service";
import {AuthenticationService} from "../../../../../../core/services/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector       : 'waiting-list',
    templateUrl    : './waiting-list.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 1fr 2fr 1fr; /* Default mobile layout */

                @media (min-width: 640px) { /* sm breakpoint */
                    grid-template-columns: 48px 2fr 2fr 1fr 1fr; /* Showing Condidat and Skills with Score */
                }

                @media (min-width: 768px) { /* md breakpoint */
                    grid-template-columns: 48px 1fr 2fr 1fr 1fr 2fr; /* Showing Email in addition to the above */
                }

                @media (min-width: 1024px) { /* lg breakpoint */
                    grid-template-columns: 48px 1fr 2fr 1fr 2fr 1fr 1fr; /* Same as md but more space */
                }
            }

        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
})
export class WaitingList implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    waitingList: any;


    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProductForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() competitionId: number;
user : any

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private competitionService: CompetitionService,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
        if(this.authenticationService.currentUser){
            this.user = this.authenticationService.currentUserValue
        }
    }

    ngOnInit(): void {
        this.getWaitingListByCompetitionId(this.competitionId)
        console.log(this.waitingList)
    }

    getWaitingListByCompetitionId(competitionId: number){
        this.competitionService.getAllWaitingListByCompetitionId(competitionId).subscribe(res=>{
            console.log(res)
            this.waitingList=res
            this._changeDetectorRef.detectChanges()
        })
    }
    navigateToCompetitionDetailsTab(tab: string) {
        this.router.navigate(['/apps/competitions', this.competitionId], { fragment: tab });
    }
    approveJoinRequest(requestId: any){
        this.competitionService.approveJoinRequest(requestId).subscribe(res=>{
            console.log(res)
            this.getWaitingListByCompetitionId(this.competitionId)
            this.navigateToCompetitionDetailsTab('Team')
        })
        this._changeDetectorRef.detectChanges()

    }
    rejectJoinRequest(requestId: any){
        this.competitionService.rejectJoinRequest(requestId).subscribe(res=>{
            console.log(res)
            this.getWaitingListByCompetitionId(this.competitionId)
            this._changeDetectorRef.detectChanges()
        })
    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            // merge(this._sort.sortChange, this._paginator.page).pipe(
            //     switchMap(() => {
            //         this.closeDetails();
            //         this.isLoading = true;
            //         return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
            //     }),
            //     map(() => {
            //         this.isLoading = false;
            //     }),
            // ).subscribe();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }



    closeDetails(): void {
        // this.selectedProduct = null;
    }

    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }


}
