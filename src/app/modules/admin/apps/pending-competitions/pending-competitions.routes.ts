import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import {PendingCompetitionsDetailsComponent} from "./details/details.component";
import {PendingCompetitionsListComponent} from "./list/list.component";
import {PendingCompetitionsComponent} from "./pending-competitions.component";

/**
 * Course resolver
 *
 * @param route
 * @param state
 */

export default [
    {
        path     : '',
        component: PendingCompetitionsComponent,
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: PendingCompetitionsListComponent,
            },
            {
                path     : ':id',
                component: PendingCompetitionsDetailsComponent,

            },
        ],
    },
] as Routes;
