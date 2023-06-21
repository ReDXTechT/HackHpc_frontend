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
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../../core/services/competition.service";
import {RouterLink} from "@angular/router";

@Component({
    selector       : 'team',
    templateUrl    : './team.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, RouterLink],
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: UntypedFormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() competitionId: number;
    team : any[]

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private competitionService: CompetitionService,
    ) {
    }

    ngOnInit(): void {
        this.getTeamByCompetitionId(this.competitionId)
    }

    getTeamByCompetitionId(competitionId: number){
        this.competitionService.getTeamByCompetitionId(competitionId).subscribe(res=>{
            console.log(res)
            this.team=res
            this._changeDetectorRef.detectChanges()
        })
    }

    // rejectJoinRequest(requestId: any){
    //     this.competitionService.rejectJoinRequest(requestId).subscribe(res=>{
    //         console.log(res)
    //         this.getWaitingListByCompetitionId(this.competitionId)
    //         this._changeDetectorRef.detectChanges()
    //     })
    // }

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

    toggleDetails(productId: string): void {
        // If the product is already selected...
        // if ( this.selectedProduct && this.selectedProduct.id === productId )
        // {
        //     // Close the details
        //     this.closeDetails();
        //     return;
        // }
        //
        // // Get the product by id
        // this._inventoryService.getProductById(productId)
        //     .subscribe((product) =>
        //     {
        //         // Set the selected product
        //         this.selectedProduct = product;
        //
        //         // Fill the form
        //         this.selectedProductForm.patchValue(product);
        //
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    closeDetails(): void {
        this.selectedProduct = null;
    }

    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }


    // filterTags(event): void {
    //     // Get the value
    //     const value = event.target.value.toLowerCase();
    //
    //     // Filter the tags
    //     this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    // }


}
