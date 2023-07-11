import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';

import { catchError, Observable, throwError } from 'rxjs';
import {MonitoringCompetitionsComponent} from "./boards/monitoring";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {FileManagerComponent} from "../file-manager/file-manager.component";
import {MonitoringComponent} from "./monitoring.component";

/**
 * Board resolver
 *
 * @param route
 * @param state
 */


export default [
    {
        path: '',
        component: MonitoringComponent,
        children: [
            {
                path: '',
                component: MonitoringCompetitionsComponent,
            },
            {
                path: 'cluster/:compId',
                component: AnalyticsComponent,
            }
        ]
    }
] as Routes;
