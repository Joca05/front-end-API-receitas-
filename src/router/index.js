import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Receitas from '../views/Receitas.vue'
import Categorias from '../views/Categorias.vue'
import Interacoes from '../views/Interacoes.vue'

import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/receitas',
    name: 'Receitas',
    component: Receitas,
    meta: { requiresAuth: true }
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: Categorias,
    meta: { requiresAuth: true }
  },
  {
    path: '/interacoes',
    name: 'Interacoes',
    component: Interacoes,
    meta: { requiresAuth: true }
  },
  // rota 404 (opcional)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return '/'
  }
})

export default router

