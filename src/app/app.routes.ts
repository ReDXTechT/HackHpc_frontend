import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: '/home'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            // Apps
            {path: 'apps', children: [
                {path: 'clusters-monitoring', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.routes')},
                {path: 'competitions', loadChildren: () => import('app/modules/admin/apps/academy/academy.routes')},
                {path: 'pending-competitions', loadChildren: () => import('app/modules/admin/apps/pending-competitions/pending-competitions.routes')},
                {path: 'competition', loadChildren: () => import('app/modules/admin/apps/competition/competition.module').then((m) => m.CompetitionModule)},
                {path: 'customers', loadChildren: () => import('app/modules/admin/apps/customers/customers.routes')},
                {path: 'pending-customers-accounts', loadChildren: () => import('app/modules/admin/apps/pending-customers/pending-customers.routes')},
                {path: 'results-submissions', loadChildren: () => import('app/modules/admin/apps/file-manager/file-manager.routes')},
                {path: 'help-center', loadChildren: () => import('app/modules/admin/apps/help-center/help-center.routes')},
                {path: 'mailbox', loadChildren: () => import('app/modules/admin/apps/mailbox/mailbox.routes')},
                {path: 'scrumboard', loadChildren: () => import('app/modules/admin/apps/scrumboard/scrumboard.routes')},
                {path: 'test', loadChildren: () => import('app/modules/admin/apps/test/test.routes')},
            ]},

            // Pages
            {path: 'pages', children: [

                // Activities
                // {path: 'activities', loadChildren: () => import('app/modules/admin/pages/activities/activities.routes')},

                // Authentication
                // {path: 'authentication', loadChildren: () => import('app/modules/admin/pages/authentication/authentication.routes')},
                // Invoice


                // Pricing
                {path: 'pricing', children: [
                    {path: 'modern', loadChildren: () => import('app/modules/admin/pages/pricing/modern/modern.routes')},
                    {path: 'simple', loadChildren: () => import('app/modules/admin/pages/pricing/simple/simple.routes')},
                    {path: 'single', loadChildren: () => import('app/modules/admin/pages/pricing/single/single.routes')},
                    {path: 'table', loadChildren: () => import('app/modules/admin/pages/pricing/table/table.routes')}
                ]},

                // Profile
                {path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.routes')},

                // Settings
                {path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.routes')},
            ]},

            // User Interface
            {path: 'ui', children: [
                 // Cards
                {path: 'cards', loadChildren: () => import('app/modules/admin/ui/cards/cards.routes')},


                // Confirmation Dialog
                {path: 'confirmation-dialog', loadChildren: () => import('app/modules/admin/ui/confirmation-dialog/confirmation-dialog.routes')},


                // Forms
                {path: 'forms', loadChildren: () => import('app/modules/admin/ui/forms/forms.routes')},
                ]},


            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes')},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
