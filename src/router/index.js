import { createRouter, createWebHistory } from 'vue-router'

import DateDay from '@/views/date/DateDay.vue';
import DateWeek from '@/views/date/DateWeek.vue';
import DateMonth from '@/views/date/DateMonth.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
        {
      path: '/',
      name: 'day',
      component: DateDay
    },
    {
      path: '/week',
      name: 'week',
      component: DateWeek
    },
    {
      path: '/month',
      name: 'month',
      component: DateMonth
    }
  ]
})

export default router
