import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Página de inicio' }
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('../views/SetupView.vue'),
      meta: { title: 'Setup común (para todos los proyectos)' }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: { title: 'Lista de proyectos' }
    },
    {
      path: '/projectForm/:fileName',
      name: 'projectForm',
      component: () => import('../views/ProjectFormView.vue'),
      meta: { title: 'Project Configuration' }
    },
    {
      path: '/projectPrint/:fileName',
      name: 'projectPrint',
      component: () => import('../views/ProjectPrintView.vue'),
      meta: { title: 'Project Detail' }
    }
  ]
})

export default router
