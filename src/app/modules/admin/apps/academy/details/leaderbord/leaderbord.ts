import {AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
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
import {SubmissionsService} from "../../../../../../core/services/submissions.service";

@Component({
    selector       : 'leaderbord',
    templateUrl    : './leaderbord.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
    providers :[DatePipe]
})
export class Leaderbord implements OnInit, OnDestroy {
    pagination = {
        length: 0,
        page: 0,
        size: 5  // or whatever your default page size is
    };

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    leaderBoard: any;
    name =''
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProductForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() competitionId: number;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private submissionsService: SubmissionsService,
        private _formBuilder: UntypedFormBuilder,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit(): void {
        console.log("eeeeeeeeeeeeeeeeee")

        this.getLeaderBoard(this.competitionId)
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getLeaderBoard(competitionId: any) {
        this.submissionsService.getLeaderBoard(competitionId).subscribe(res => {
            this.leaderBoard = res.map(result => {
                const output = result.best_submission.pipeline_output;
                const diffIndex = output.indexOf('Difference');
                result.best_submission.formatted_output = output.substring(diffIndex) + ', execution time : ' + result.best_submission.execution_runtime;
                result.best_submission.formatted_date = this.datePipe.transform(result.best_submission.submitted_at, 'dd/MM/yyyy, HH:mm');
                return result;
            });
            this.pagination.length = res.length;

            this._changeDetectorRef.detectChanges();
        });
    }

    getFilteredCandidatsLeaderBoard(competitionId: any, name :any) {
        this.submissionsService.getFilteredCandidatsOnLeaderBoard(competitionId,name).subscribe(res => {
            console.log(res)
            this.leaderBoard = res.map(result => {
                const output = result.best_submission.pipeline_output;
                const diffIndex = output.indexOf('Difference');
                result.best_submission.formatted_output = output.substring(diffIndex) + ', execution time : ' + result.best_submission.execution_runtime;
                result.best_submission.formatted_date = this.datePipe.transform(result.best_submission.submitted_at, 'dd/MM/yyyy, HH:mm');
                return result;
            });
            this.pagination.length = res.length;

            this._changeDetectorRef.detectChanges();
        });
    }
    handlePageEvent(event) {
        this.pagination.page = event.pageIndex;
        this.pagination.size = event.pageSize;

        // Here you would usually make another HTTP request to get the new data based on the new pagination
        // But since the whole data is already fetched in the frontend in your case, you can just update the displayed data
        this.leaderBoard = this.leaderBoard.slice(this.pagination.page * this.pagination.size, (this.pagination.page + 1) * this.pagination.size);
    }

    onSearch(competitionId :any ,query: string) {

        this.name = query;
        this.getFilteredCandidatsLeaderBoard(competitionId,this.name)
    }

}
