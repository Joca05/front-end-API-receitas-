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
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Receitas</h2>

  
      <div class="bg-white p-4 rounded shadow mb-6 space-y-2">
        <input 
          v-model="form.titulo" 
          placeholder="Título" 
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />
        <textarea 
          v-model="form.descricao" 
          placeholder="Descrição" 
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        ></textarea>
        <textarea 
          v-model="form.ingredientes" 
          placeholder="Ingredientes" 
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        ></textarea>
        <textarea 
          v-model="form.modo_preparo" 
          placeholder="Modo de preparo" 
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        ></textarea>
        <select 
          v-model="form.categoria" 
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        >
          <option value="" disabled>Selecione uma categoria</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
        <input 
          type="file" 
          @change="onFileChange" 
          class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />

        <div class="flex space-x-2 mt-2">
          <button 
            @click="form.id ? updateRecipe() : createRecipe()" 
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

     
      <div class="bg-white rounded shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="r in receitas" :key="r.id">
              <td class="px-4 py-2 text-gray-800">{{ r.titulo }}</td>
              <td class="px-4 py-2 text-gray-800">{{ r.categoria?.nome || 'Sem categoria' }}</td>
              <td class="px-4 py-2">
                <button @click="editRecipe(r)" class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 mr-2 transition text-xs">Editar</button>
                <button @click="deleteRecipe(r.id)" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition text-xs">Excluir</button>
              </td>
            </tr>
            <tr v-if="receitas.length === 0">
              <td colspan="3" class="px-4 py-2 text-gray-500 text-center">Nenhuma receita encontrada.</td>
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

const receitas = ref([])
const categorias = ref([])
const form = ref({
  id: null,
  titulo: '',
  descricao: '',
  ingredientes: '',
  modo_preparo: '',
  categoria: null,
  imagem: null
})

const loadReceitas = async () => {
  const res = await api.get('receitas/')
  receitas.value = res.data
}

const loadCategorias = async () => {
  const res = await api.get('categorias/')
  categorias.value = res.data
}

const onFileChange = (e) => {
  form.value.imagem = e.target.files[0]
}

const createRecipe = async () => {
  try {
    const data = new FormData()
    data.append('titulo', form.value.titulo)
    data.append('descricao', form.value.descricao)
    data.append('ingredientes', form.value.ingredientes)
    data.append('modo_preparo', form.value.modo_preparo)
    if (form.value.categoria) data.append('categoria_id', form.value.categoria)
    if (form.value.imagem) data.append('imagem', form.value.imagem)
    await api.post('receitas/', data)
    resetForm()
    loadReceitas()
  } catch (error) {
    console.error('Erro ao criar receita:', error)
    alert('Erro ao criar receita. Verifique os campos.')
  }
}

const updateRecipe = async () => {
  try {
    const data = new FormData()
    data.append('titulo', form.value.titulo)
    data.append('descricao', form.value.descricao)
    data.append('ingredientes', form.value.ingredientes)
    data.append('modo_preparo', form.value.modo_preparo)
    if (form.value.categoria) data.append('categoria_id', form.value.categoria)
    if (form.value.imagem) data.append('imagem', form.value.imagem)
    await api.put(`receitas/${form.value.id}/`, data)
    resetForm()
    loadReceitas()
  } catch (error) {
    console.error('Erro ao atualizar receita:', error)
    alert('Erro ao atualizar receita. Verifique os campos.')
  }
}

const editRecipe = (r) => {
  form.value = { ...r, categoria: r.categoria?.id || null, imagem: null }
}

const deleteRecipe = async (id) => {
  if (confirm('Deseja realmente excluir?')) {
    await api.delete(`receitas/${id}/`)
    loadReceitas()
  }
}

const resetForm = () => {
  form.value = { id: null, titulo: '', descricao: '', ingredientes: '', modo_preparo: '', categoria: null, imagem: null }
}

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

onMounted(() => {
  loadCategorias()
  loadReceitas()
})
</script>
