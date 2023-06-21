import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import {CustomersDetailsComponent
} from 'app/modules/admin/apps/customers/details/details.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { catchError, throwError } from 'rxjs';

/**
 * Contact resolver
 *
 * @param route
 * @param state
 */
// const contactResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
// {
//     const contactsService = inject(CustomersService);
//     const router = inject(Router);
//
//     return contactsService.getContactById(route.paramMap.get('id'))
//         .pipe(
//             // Error here means the requested contact is not available
//             catchError((error) =>
//             {
//                 // Log the error
//                 console.error(error);
//
//                 // Get the parent url
//                 const parentUrl = state.url.split('/').slice(0, -1).join('/');
//
//                 // Navigate to there
//                 router.navigateByUrl(parentUrl);
//
//                 // Throw an error
//                 return throwError(error);
//             }),
//         );
// };

/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
// const canDeactivateContactsDetails = (
//     component: ContactsDetailsComponent,
//     currentRoute: ActivatedRouteSnapshot,
//     currentState: RouterStateSnapshot,
//     nextState: RouterStateSnapshot) =>
// {
//     // Get the next route
//     let nextRoute: ActivatedRouteSnapshot = nextState.root;
//     while ( nextRoute.firstChild )
//     {
//         nextRoute = nextRoute.firstChild;
//     }
//
//     // If the next state doesn't contain '/contacts'
//     // it means we are navigating away from the
//     // contacts app
//     if ( !nextState.url.includes('/customers') )
//     {
//         // Let it navigate
//         return true;
//     }
//
//     // If we are navigating to another contact...
//     if ( nextRoute.paramMap.get('id') )
//     {
//         // Just navigate
//         return true;
//     }
//
//     // Otherwise, close the drawer first, and then navigate
//     return component.closeDrawer().then(() => true);
// };

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
                ],
            },
        ],
    },
] as Routes;
