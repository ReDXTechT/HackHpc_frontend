import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { FileDetails } from 'app/modules/admin/apps/file-manager/details/details.component';
import { FileManagerComponent } from 'app/modules/admin/apps/file-manager/file-manager.component';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { catchError, throwError } from 'rxjs';

export default [
    {
        path     : '',
        component: FileManagerComponent,
        children : [
            {
                path     : 'folders/:folderId',
                component: FileManagerListComponent,
                children : [
                    {
                        path         : 'details/:id',
                        component    : FileDetails,
                    },
                ],
            },
            {
                path     : 'competition/:compId/files/:fileId',
                component: FileManagerListComponent,
                children : [
                    {
                        path         : 'details/:id',
                        component    : FileDetails,
                    },
                ],
            },
            {
                path     : '',
                component: FileManagerListComponent,
                children : [
                    {
                        path         : 'details/:id',
                        component    : FileDetails,
                    },
                ],
            },
        ],
    },
] as Routes;
