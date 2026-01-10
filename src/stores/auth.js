import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token')
  }),

  actions: {
    async login(username, password) {
      const res = await api.post('token/', { username, password })
      this.token = res.data.access
      localStorage.setItem('token', this.token)
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
