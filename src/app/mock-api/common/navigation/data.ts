/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id      : 'dashboards',
    //     title   : 'Dashboards',
    //     subtitle: 'Unique dashboard designs',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:home',
    //     children: [
    //         {
    //             id   : 'dashboards.project',
    //             title: 'Project',
    //             type : 'basic',
    //             icon : 'heroicons_outline:clipboard-document-check',
    //             link : '/dashboards/project',
    //         },
    //         {
    //             id   : 'dashboards.analytics',
    //             title: 'Analytics',
    //             type : 'basic',
    //             icon : 'heroicons_outline:chart-pie',
    //             link : '/dashboards/analytics',
    //         },
    //         {
    //             id   : 'dashboards.finance',
    //             title: 'Finance',
    //             type : 'basic',
    //             icon : 'heroicons_outline:banknotes',
    //             link : '/dashboards/finance',
    //         },
    //         {
    //             id   : 'dashboards.crypto',
    //             title: 'Crypto',
    //             type : 'basic',
    //             icon : 'heroicons_outline:currency-dollar',
    //             link : '/dashboards/crypto',
    //         },
    //     ],
    // },

    {
        id      : 'apps',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id: 'home',
                title: 'Home',
                type: 'basic',
                icon: 'feather:home',
                link: '/home',
                roles:['Customer','Admin','Competitor','']

            },
            {
                id   : 'pages.profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:user-circle',
                link : '/pages/profile',
                roles:['Customer','Competitor']

            },
            {
                id: 'monitoring',
                title: 'Clusters monitoring',
                type: 'basic',
                icon: 'feather:monitor',
                link: '/apps/clusters-monitoring',
                roles: ['Admin']


            },
            {
                id   : 'apps.competitions',
                title: 'Competitions',
                type : 'basic',
                icon : 'heroicons_outline:trophy',
                link : '/apps/competitions',
                roles:['Customer','Admin','Competitor','']

            },
            {
                id   : 'apps.competitions',
                title: 'Pending Competitions',
                type : 'basic',
                icon : 'pending',
                link : '/apps/pending-competitions',
                roles:['Admin']

            },
            {
                id      : 'apps.add_competition',
                title   : 'Add competition',
                type    : 'basic',
                icon    : 'heroicons_outline:pencil-square',
                link : '/apps/competition/add-competition',
                roles:['Customer','Admin']


            },

            {
                id   : 'apps.customers',
                title: 'Customers',
                type : 'basic',
                icon : 'heroicons_outline:building-office-2',
                link : '/apps/customers',
                roles:['Customer','Admin','Competitor','']

            },
            {
                id   : 'apps.pending-customers',
                title: 'Pending customers accounts',
                type : 'basic',
                icon : 'pending',
                link : '/apps/pending-customers-accounts',
                roles:['Admin']

            },
            {
                id   : 'apps.results-submission',
                title: 'Results submission',
                type : 'basic',
                icon : 'heroicons_outline:cloud',
                link : '/apps/results-submissions',
                roles:['Customer','Admin']

            },
            {
                id      : 'apps.help-center',
                title   : 'Help Center',
                type    : 'collapsable',
                icon    : 'heroicons_outline:information-circle',
                link    : '/apps/help-center',
                roles:['Customer','Admin','Competitor',''],
                children: [
                    {
                        id        : 'apps.help-center.home',
                        title     : 'Home',
                        type      : 'basic',
                        link      : '/apps/help-center',
                        exactMatch: true,
                        roles:['Customer','Admin','Competitor','']

                    },
                    {
                        id   : 'apps.help-center.faqs',
                        title: 'FAQs',
                        type : 'basic',
                        link : '/apps/help-center/faqs',
                        roles:['Customer','Admin','Competitor','']

                    },
                    {
                        id   : 'apps.help-center.guides',
                        title: 'Guides',
                        type : 'basic',
                        link : '/apps/help-center/guides',
                        roles:['Customer','Admin','Competitor','']

                    },
                    {
                        id   : 'apps.help-center.support',
                        title: 'Support',
                        type : 'basic',
                        link : '/apps/help-center/support',
                        roles:['Customer','Admin','Competitor','']

                    },
                ],
            },
            // {
            //     id   : 'apps.mailbox',
            //     title: 'Mailbox',
            //     type : 'basic',
            //     icon : 'heroicons_outline:envelope',
            //     link : '/apps/mailbox',
            //     badge: {
            //         title  : '27',
            //         classes: 'px-2 bg-pink-600 text-white rounded-full',
            //     },
            //     roles:['Customer','Admin','Competitor','']
            //
            // },
        ],
    },
    {
        id   : 'pages.settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog-8-tooth',
        link : '/pages/settings',
        roles:['Customer','Admin','Competitor','']

    },
    {
        id: 'logout',
        title: 'Logout',
        type: 'basic',
        icon: 'feather:log-out',
        function: () => {},
        roles:['Customer','Admin','Competitor','']
    },
    {
        id  : 'divider-1',
        type: 'divider',
    },

];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },

];
