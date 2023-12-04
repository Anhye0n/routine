import { createRouter, createWebHistory } from 'vue-router';

import DateDay from '@/views/date/DateDay.vue';
import DateWeek from '@/views/date/DateWeek.vue';
import DateMonth from '@/views/date/DateMonth.vue';

import NotFoundView from '@/views/NotFoundView.vue';

import LoginView from '@/views/user/LoginView.vue';
import DateHome from '@/views/date/DateHome.vue';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      // path: '/login',
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: DateHome,
      children: [
        {
          path: 'day/:date',
          name: 'day',
          component: DateDay,
        },
        {
          path: 'week/:date',
          name: 'week',
          component: DateWeek,
        },
        {
          path: 'month/:date',
          name: 'month',
          component: DateMonth,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
});

export default router;
