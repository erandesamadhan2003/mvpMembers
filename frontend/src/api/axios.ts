import axios from 'axios'
import { API_BASE_URL } from '@/constants/api.constants'
import { setupInterceptors } from '@/api/interceptors'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

setupInterceptors(api)
