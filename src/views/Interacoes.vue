<template>
  <div class="flex min-h-screen bg-gray-100 font-sans">
  
    <aside class="w-64 bg-blue-600 text-white flex flex-col">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Controle Estoque</h2>
        <nav class="flex flex-col space-y-2">
          <router-link to="/dashboard" class="px-4 py-2 rounded hover:bg-blue-500 transition-colors">Dashboard</router-link>
          <router-link to="/receitas" class="px-4 py-2 rounded hover:bg-blue-500 transition-colors">Receitas</router-link>
          <router-link to="/interacoes" class="px-4 py-2 rounded hover:bg-blue-500 transition-colors">Interações</router-link>
          <router-link to="/categorias" class="px-4 py-2 rounded hover:bg-blue-500 transition-colors">Categorias</router-link>
          <button @click="logout" class="mt-6 px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors">Sair</button>
        </nav>
      </div>
    </aside>

   
    <div class="flex-1 p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Interações</h2>

     
      <div class="bg-white p-4 rounded shadow mb-6">
        <select v-model="form.receita" class="input mb-2">
          <option value="" disabled>Selecione uma receita</option>
          <option v-for="r in receitas" :key="r.id" :value="r.id">{{ r.titulo }}</option>
        </select>

        <select v-model="form.tipo" class="input mb-2">
          <option value="COM">Comentário</option>
          <option value="AVA">Avaliação</option>
        </select>

        <textarea v-if="form.tipo === 'COM'" v-model="form.comentario" placeholder="Comentário" class="input mb-2"></textarea>
        <input v-if="form.tipo === 'AVA'" type="number" min="1" max="5" v-model="form.estrelas" placeholder="Estrelas" class="input mb-2"/>

        <div class="flex space-x-2">
          <button @click="form.id ? updateInteraction() : createInteraction()" class="btn-blue">
            {{ form.id ? 'Atualizar' : 'Criar' }}
          </button>
          <button v-if="form.id" @click="resetForm()" class="btn-gray">Cancelar</button>
        </div>
      </div>

     
      <div class="bg-white rounded shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentário</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estrelas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="i in interacoes" :key="i.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ i.receita?.titulo }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ i.tipo }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ i.comentario || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ i.estrelas || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="editInteraction(i)" class="btn-yellow mr-2">Editar</button>
                <button @click="deleteInteraction(i.id)" class="btn-red">Excluir</button>
              </td>
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

const interacoes = ref([])
const receitas = ref([])
const form = ref({
  id: null,
  receita: null,
  tipo: 'COM',
  comentario: '',
  estrelas: null
})

const loadInteractions = async () => {
  const res = await api.get('interacoes/')
  interacoes.value = res.data
}

const loadReceitas = async () => {
  const res = await api.get('receitas/')
  receitas.value = res.data
}

const createInteraction = async () => {
  try {
    const payload = {
      receita_id: form.value.receita, 
      tipo: form.value.tipo
    }

   
    if (form.value.tipo === 'COM') payload.comentario = form.value.comentario
    // só envia estrelas se for do tipo AVA
    if (form.value.tipo === 'AVA') payload.estrelas = form.value.estrelas

    await api.post('interacoes/', payload)
    resetForm()
    loadInteractions()
  } catch (error) {
    console.error('Erro ao criar interação:', error)
    alert('Erro ao criar interação. Verifique os campos.')
  }
}

const updateInteraction = async () => {
  try {
    const payload = {
      receita_id: form.value.receita,
      tipo: form.value.tipo
    }
    if (form.value.tipo === 'COM') payload.comentario = form.value.comentario
    if (form.value.tipo === 'AVA') payload.estrelas = form.value.estrelas

    await api.put(`interacoes/${form.value.id}/`, payload)
    resetForm()
    loadInteractions()
  } catch (error) {
    console.error('Erro ao atualizar interação:', error)
    alert('Erro ao atualizar interação. Verifique os campos.')
  }
}


const editInteraction = (i) => {
  form.value = {
    id: i.id,
    receita: i.receita?.id || null,
    tipo: i.tipo,
    comentario: i.comentario,
    estrelas: i.estrelas
  }
}

const deleteInteraction = async (id) => {
  if (confirm('Deseja realmente excluir?')) {
    await api.delete(`interacoes/${id}/`)
    loadInteractions()
  }
}

const resetForm = () => {
  form.value = { id: null, receita: null, tipo: 'COM', comentario: '', estrelas: null }
}

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

onMounted(() => {
  loadReceitas()
  loadInteractions()
})
</script>

<style>
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  width: 100%;
  focus:outline-none;
  focus:ring-2;
  focus:ring-blue-500;
}
.btn-blue { @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition; }
.btn-gray { @apply bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition; }
.btn-yellow { @apply bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition; }
.btn-red { @apply bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition; }
</style>
