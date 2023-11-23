import { createRouter, createWebHistory } from 'vue-router';
import Login from "@/views/common/LoginPage.vue";

const routes = [
  { path: '/', name: "Root", component: Login },
  { path: '/login', name: "Login", component: Login },
  {
    path: '/clients',
    name: "Home",
    component: () => import('@/views/clients/ClientList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: "InvoiceList",
    component: () => import('@/views/invoicing/InvoiceList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'ClientList',
    component: () => import('@/views/clients/ClientList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cities',
    name: 'CityList',
    component: () => import('@/views/cities/CityList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'ConfigurationSettings',
    component: () => import('@/views/settings/ConfigurationSettings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/views/security/UserList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/nas',
    name: 'NASList',
    component: () => import('@/views/nas/NASList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/radgroupcheck',
    name: 'RadGroupCheckList',
    component: () => import('@/views/groups/RadGroupList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/add',
    name: 'ClientAdd',
    component: () => import('@/views/clients/ClientAdd.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id/edit',
    name: 'ClientEdit',
    component: () => import('@/views/clients/ClientEdit.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const token = localStorage.getItem('jwt');

  if (requiresAuth) {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiration = payload.exp;

      const isExpired = Date.now() >= expiration * 1000;

      if (isExpired) {
        next({
          path: '/login',
          replace: true
        })
      } else {
        next()
      }
    } else {
      next({
        path: '/login',
        replace: true
      })
    }
  } else {
    next()
  }
});

export default router;
