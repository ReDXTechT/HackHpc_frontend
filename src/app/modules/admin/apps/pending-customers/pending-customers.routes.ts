import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import {CustomersDetailsComponent
} from 'app/modules/admin/apps/customers/details/details.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { catchError, throwError } from 'rxjs';
import {PendingCustomersDetailsComponent} from "./details/details.component";
import {PendingCustomersListComponent} from "./list/list.component";
import {PendingCustomersComponent} from "./pending-customers.component";



export default [
    {
        path     : '',
        component: PendingCustomersComponent,
        children : [
            {
                path     : '',
                component: PendingCustomersListComponent,
                children : [
                    {
                        path         : ':id',
                        component    : PendingCustomersDetailsComponent,
                    },

                ],
            },
        ],
    },
] as Routes;
