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

   
    <div class="flex-1 p-6 md:p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Categorias</h2>

   
      <div class="bg-white p-4 rounded shadow mb-6 space-y-2">
        <input 
          v-model="form.nome" 
          placeholder="Nome da categoria"
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />
        <div class="flex space-x-2">
          <button 
            @click="form.id ? updateCategory() : createCategory()" 
            class="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition text-sm font-medium"
          >
            {{ form.id ? 'Atualizar' : 'Criar' }}
          </button>
          <button 
            v-if="form.id" 
            @click="resetForm()" 
            class="bg-gray-200 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-300 transition text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>

  
      <div class="bg-white border-l-4 border-red-600 p-3 rounded shadow text-sm text-gray-700 mb-6">
        <p><strong>⚠ Atenção:</strong> Ao excluir uma categoria, todas as receitas associadas serão removidas permanentemente.</p>
      </div>


      <div class="bg-white rounded shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="c in categorias" :key="c.id">
              <td class="px-4 py-2 text-gray-800">{{ c.nome }}</td>
              <td class="px-4 py-2">
                <button 
                  @click="editCategory(c)" 
                  class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 mr-2 transition text-xs"
                >
                  Editar
                </button>
                <button 
                  @click="deleteCategory(c.id)" 
                  class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition text-xs"
                >
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="categorias.length === 0">
              <td colspan="2" class="px-4 py-2 text-gray-500 text-center">Nenhuma categoria encontrada.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const categorias = ref([])
const form = ref({ id: null, nome: '' })

const loadCategorias = async () => {
  const res = await api.get('categorias/')
  categorias.value = res.data
}

const createCategory = async () => {
  await api.post('categorias/', { nome: form.value.nome })
  resetForm()
  loadCategorias()
}

const updateCategory = async () => {
  await api.put(`categorias/${form.value.id}/`, { nome: form.value.nome })
  resetForm()
  loadCategorias()
}

const editCategory = (c) => {
  form.value = { id: c.id, nome: c.nome }
}

const deleteCategory = async (id) => {
  if (confirm('Deseja realmente excluir?')) {
    await api.delete(`categorias/${id}/`)
    loadCategorias()
  }
}

const resetForm = () => {
  form.value = { id: null, nome: '' }
}

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

onMounted(() => {
  loadCategorias()
})
</script>
