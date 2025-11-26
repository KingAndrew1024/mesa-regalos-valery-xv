import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ListView from '@/views/ListView.vue'
import AdminPaneView from '@/views/admin/AdminPaneView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import AdminMainView from '@/views/admin/AdminMainView.vue'
import AdminGiftsView from '@/views/admin/AdminGiftsView.vue'
import { STORE } from '@/main'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/list',
      name: 'list',
      component: ListView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPaneView,
      children: [
        {
          path: '',
          name: '/admin/main',
          component: AdminMainView,
        },
        {
          path: '/admin/users',
          component: AdminUsersView,
        },
        {
          path: '/admin/gifts',
          component: AdminGiftsView,
          /* meta: { requiresAuth: true }, */
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/admin') // Redirect to login if not authenticated
  } else {
    next() // Proceed with navigation
  }
})

function isAuthenticated() {
  return STORE.isAuthenticated
}

export default router
