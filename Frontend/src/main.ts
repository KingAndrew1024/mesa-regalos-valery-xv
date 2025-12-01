import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { reactive } from 'vue'

const app = createApp(App)

app.use(router)

app.mount('#app')

//export const HOST = 'http://localhost:3000'
export const HOST = 'https://vbandrew.mx/mesa-regalos/api/api.php'
export const JSON_HEADER = { 'Content-Type': 'application/json' }

export interface DBResponseType {
  message?: string
  result?: boolean
}
/* export interface DBResponseType {
  affectedRows: number
  changedRows: number
  fieldCount: number
  info: string
  insertId: number
  serverStatus: number
  warningStatus: number
} */

export interface User {
  id: number | undefined
  name: string | undefined
  type: number | undefined
}

export interface GiftType {
  id: number
  title: string
  image: string
  description: string
  links: { text: string; url: string }[]
  status: number
  username?: string
  email?: string
  purchase_date?: string
}

export const STORE = reactive<{
  isAuthenticated: boolean
  user: User
}>({
  isAuthenticated: false,
  user: {
    id: undefined,
    name: undefined,
    type: undefined,
  },
})

/* router.beforeEach((to, from) => {
  if (!STORE.isAuthenticated && to.name != 'home') {
    return { name: 'home' }
  }
}) */
