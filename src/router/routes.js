const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/DashBoard.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
