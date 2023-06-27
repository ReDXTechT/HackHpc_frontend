import { AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import {UsersService} from "../../../../../core/services/users.service";
import {Customer} from "../../../../../core/models/User";

@Component({
    selector       : 'contacts-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe],
})
export class CustomersListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    customers: any[] = [];
    customersCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedcustomer: Customer;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    name =''
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private usersService: UsersService,
        @Inject(DOCUMENT) private _document: any,
        private router: Router,
        private route: ActivatedRoute,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    )
    {
    }
    ngOnInit(): void
    {
        this.getAllCustomers();
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

    }
    onSearch(query: string) {

        this.name = query;
        this.getFilteredCustomers()
    }
    getFilteredCustomers() {
        // this.customers = this.usersService.getFilteredCustomers(this.name)
        this.usersService.getFilteredCustomers(this.name).subscribe(res=>{
            console.log(res)
            this.customers=res
            this._changeDetectorRef.detectChanges()

        })

    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getAllCustomers(){
        this.usersService.getAllCustomers().subscribe(customers=>{
            console.log(customers)
            this.customersCount = customers.length;
            this.customers=customers
            this._changeDetectorRef.detectChanges()
        })
    }
    onBackdropClicked(): void
    {
        // Go back to the list
        this.router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
