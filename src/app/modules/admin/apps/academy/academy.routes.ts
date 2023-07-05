import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { AcademyComponent } from 'app/modules/admin/apps/academy/academy.component';
import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
import { AcademyListComponent } from 'app/modules/admin/apps/academy/list/list.component';
import { catchError, throwError } from 'rxjs';
import {ProfileComponent} from "../../pages/profile/profile.component";

/**
 * Course resolver
 *
 * @param route
 * @param state
 */

export default [
    {
        path     : '',
        component: AcademyComponent,
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: AcademyListComponent,
            },
            {
                path     : ':id',
                component: AcademyDetailsComponent,

            },
            {
                path     : 'profile/:id',
                component: ProfileComponent,

            },
        ],
    },
] as Routes;
