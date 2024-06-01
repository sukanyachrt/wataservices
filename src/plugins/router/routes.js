export const routes = [
  { path: '/', redirect: '/platforms', requiresAuth: true },
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
        },
      },
      {
        path: 'services',
        component: () => import('@/views/services/Data.vue'),
        meta: {
          title: 'services',
          requiresAuth: true,
        },
      },
      {
        path: 'services-create/:id?',
        component: () => import('@/views/services/Create.vue'),
        meta: {
          title: 'services-create',
          requiresAuth: true,
        },
      },
      {
        path: 'project',
        component: () => import('@/views/project/Data.vue'),
        meta: {
          title: 'project',
          requiresAuth: true,
        },
      },
      {
        path: 'project-create/:id?',
        component: () => import('@/views/project/Create.vue'),
        meta: {
          title: 'project-create',
          requiresAuth: true,
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
        },
      },
      {
        path: 'teams-create/:id?',
        component: () => import('@/views/teams/Create.vue'),
        meta: {
          title: 'project-create',
          requiresAuth: true,
        },
      },
      {
        path: 'users',
        component: () => import('@/views/user/Data.vue'),
        meta: {
          title: 'users',
          requiresAuth: true,
        },
      },
      {
        path: 'users-create/:id?',
        component: () => import('@/views/user/Create.vue'),
        meta: {
          title: 'users-create',
          requiresAuth: true,
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
    ],
  },
]
