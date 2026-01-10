<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">

      <h2 class="text-2xl font-bold text-center text-red-600 mb-4">
        Entrar no Sistema
      </h2>

      <div class="space-y-3">
      
        <input 
          v-model="username" 
          placeholder="Usuário"
          class="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />

   
        <input 
          v-model="password" 
          type="password" 
          placeholder="Senha"
          class="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />

       
        <button 
          @click="handleLogin"
          class="w-full bg-red-600 text-white py-1.5 rounded font-semibold text-sm hover:bg-red-700 transition"
        >
          Entrar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await auth.login(username.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    alert('Usuário ou senha inválidos')
  }
}
</script>
