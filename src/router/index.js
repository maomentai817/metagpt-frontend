import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LayoutContainer',
      component: () => import('@/views/LayoutContainer/LayoutContainer.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/setting',
          name: 'SettingPage',
          component: () => import('@/views/SettingPage/SettingPage.vue')
        },
        {
          path: '/dashboard',
          name: 'DashboardPage',
          component: () => import('@/views/DashboardPage/DashboardPage.vue')
        },
        {
          path: '/role',
          name: 'RolePage',
          component: () => import('@/views/RolePage/RolePage.vue')
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/views/NotFound/NotFound.vue')
        },
        {
          path: '/action',
          name: 'ActionPage',
          component: () => import('@/views/ActionPage/ActionPage.vue')
        },
        {
          path: '/model',
          name: 'ModelPage',
          component: () => import('@/views/ModelPage/ModelPage.vue')
        }
      ]
    }
    // {
    //   path: '/login',
    //   name: 'LoginPage',
    //   component: () => import('xxx')
    // }
  ],
  // 滚动行为
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
