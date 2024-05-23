export const routes = [
  // { path: '/', redirect: '/login' },
  {
    path: '/',
    component: () => import('@/pages/Signin.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'platforms',
        component: () => import('@/views/platforms/Data.vue'),
      },
      {
        path: 'platforms-create/:id?',
        component: () => import('@/views/platforms/Create.vue'),
      },
      
      {
        path: 'services',
        component: () => import('@/views/services/Data.vue'),
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
