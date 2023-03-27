/// <reference types="vite/client" />

import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';
import { getDemoList } from './utils';

const Home = () => import('./home.vue');

let demoRoutes: RouteRecordRaw[] = [];

for (const [, value] of Object.entries(getDemoList())) {
  demoRoutes = demoRoutes.concat(
    value.map(
      item =>
        <RouteRecordRaw>{
          path: item.url,
          name: item.title,
          component: item.component
        }
    )
  );
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    ...demoRoutes
  ]
});

export default router;
