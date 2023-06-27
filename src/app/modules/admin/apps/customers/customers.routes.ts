import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import {CustomersDetailsComponent
} from 'app/modules/admin/apps/customers/details/details.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { catchError, throwError } from 'rxjs';



export default [
    {
        path     : '',
        component: CustomersComponent,
        children : [
            {
                path     : '',
                component: CustomersListComponent,
                children : [
                    {
                        path         : ':id',
                        component    : CustomersDetailsComponent,
                    },
                    {
                        path         : 'add',
                        component    : CustomersDetailsComponent,
                    },
                ],
            },
        ],
    },
] as Routes;
