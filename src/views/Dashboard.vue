<template>
  <div class="flex min-h-screen bg-gray-100 font-sans">

    <aside class="w-56 bg-red-600 text-white flex flex-col">
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Gestão de Receitas</h2>
        <nav class="flex flex-col space-y-1">
          <router-link to="/dashboard"
            class="px-3 py-1 rounded hover:bg-red-500 transition-colors">Dashboard</router-link>
          <router-link to="/receitas"
            class="px-3 py-1 rounded hover:bg-red-500 transition-colors">Receitas</router-link>

          <router-link to="/categorias"
            class="px-3 py-1 rounded hover:bg-red-500 transition-colors">Categorias</router-link>
          <button @click="logout"
            class="mt-4 px-3 py-1 bg-red-700 rounded hover:bg-red-800 transition-colors">Sair</button>
        </nav>
      </div>
    </aside>

    
    <div class="flex-1 p-6">
      <header class="mb-4">
        <h2 class="text-xl font-bold text-gray-800">Dashboard</h2>
      </header>

      <main>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded shadow hover:shadow-md transition">
            <h3 class="text-md font-semibold text-gray-700">Receitas</h3>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ totalReceitas }}</p>
          </div>

          <div class="bg-white p-4 rounded shadow hover:shadow-md transition">
            <h3 class="text-md font-semibold text-gray-700">Interações</h3>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ totalInteracoes }}</p>
          </div>

          <div class="bg-white p-4 rounded shadow hover:shadow-md transition">
            <h3 class="text-md font-semibold text-gray-700">Categorias</h3>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ totalCategorias }}</p>
          </div>
        </div>

        
        <div class="mt-6 bg-white border-l-4 border-red-600 p-4 rounded shadow flex items-start space-x-3">
       
          <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m0-4h.01M12 6.25a9 9 0 1 0 9 9.25 9 9 0 0 0-9-9.25z" />
          </svg>

      
          <div>
            <h4 class="text-red-600 font-semibold mb-1">Bem-vindo!</h4>
            <p class="text-gray-700 text-sm">
              Você está no painel de controle de receitas. Use o menu lateral para navegar entre Receitas, Interações e
              Categorias.
            </p>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const totalReceitas = ref(0)
const totalInteracoes = ref(0)
const totalCategorias = ref(0)

const carregarDashboard = async () => {
  try {
    const [receitasRes, interacoesRes, categoriasRes] = await Promise.all([
      api.get('receitas/'),
      api.get('interacoes/'),
      api.get('categorias/')
    ])

    totalReceitas.value = receitasRes.data.length
    totalInteracoes.value = interacoesRes.data.length
    totalCategorias.value = categoriasRes.data.length
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
}

const logout = () => {
  auth.logout()
  router.push('/')
}

onMounted(() => {
  carregarDashboard()
})
</script>
