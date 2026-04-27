const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout2.vue'),
    children: [
      { path: '', component: () => import('pages/LandingPage2.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'reservar/:slug', component: () => import('pages/BookingPage.vue') },
    ],
  },
  {
    path: '/setup-brand',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SetBrandPage.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ForceChangePassword.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard/agenda'
      },
      {
        path: 'agenda',
        component: () => import('pages/DashBoard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'servicios',
        component: () => import('pages/ServicesManagement.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipo',
        component: () => import('pages/StaffManagement.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'sucursales',
        component: () => import('pages/BranchesManagement.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'roles',
        component: () => import('pages/RolesManagement.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/onboarding',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/OnboardingPage.vue'),
      },
    ],
    meta: { requiresAuth: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
