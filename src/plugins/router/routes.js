export const routes = [
  { path: '/:id', component: () => import('@/views/customer/Data.vue') },
  { path: '/', redirect: '/signin' },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/customer/Data.vue'),
      },
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'signin',
        component: () => import('@/pages/Signin.vue'),
      },
      {
        path: 'logout',
        component: () => import('@/pages/Logout.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
      {
        path: 'notpermission',
        component: () => import('@/pages/Notpermisstion.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'platforms',
        component: () => import('@/views/platforms/Data.vue'),
        meta: {
          title: 'platforms',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'services',
        component: () => import('@/views/services/Data.vue'),
        meta: {
          title: 'services',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'services-create/:id?',
        component: () => import('@/views/services/Create.vue'),
        meta: {
          title: 'services-create',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'project-dashboard',
        component: () => import('@/views/project/Dashboard.vue'),
        meta: {
          title: 'project-dashboard',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'project-table',
        component: () => import('@/views/project/Table.vue'),
        meta: {
          title: 'project-table',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'project-timeline',
        component: () => import('@/views/project/Timeline.vue'),
        meta: {
          title: 'project-timeline',
          requiresAuth: true,
          roles: ['admin','commenter'],
        },
      },
      {
        path: 'project-timeline/:id',
        component: () => import('@/views/project/Detailtimeline.vue'),
        meta: {
          title: 'project-timelinedetail',
          requiresAuth: true,
          roles: ['admin','commenter'],
        },
      },
      {
        path: 'project-create/:id?',
        component: () => import('@/views/project/Create.vue'),
        meta: {
          title: 'project-create',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'project-report/:id',
        component: () => import('@/views/project/Report.vue'),
        meta: {
          title: 'project-create',
          requiresAuth: true,
        },
      },
      {
        path: 'teams',
        component: () => import('@/views/teams/Data.vue'),
        meta: {
          title: 'teams',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'teams-create/:id?',
        component: () => import('@/views/teams/Create.vue'),
        meta: {
          title: 'project-create',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'users',
        component: () => import('@/views/user/Data.vue'),
        meta: {
          title: 'users',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
      {
        path: 'users-create/:id?',
        component: () => import('@/views/user/Create.vue'),
        meta: {
          title: 'users-create',
          requiresAuth: true,
          roles: ['admin'],
        },
      },

      {
        path: 'test',
        component: () => import('@/views/test/Create.vue'),
        meta: {
          title: 'test',
          requiresAuth: true,
        },
      },
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
     
    ],
  },
 
]
