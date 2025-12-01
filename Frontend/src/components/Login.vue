<template>
  <div id="login-wrapper" :class="{ error: errorMsg }">
    <p class="header">ACCESO</p>

    <input
      name="user"
      type="text"
      placeholder="Usuario"
      autofocus
      v-model="user"
      @focus="clearError"
      @keyup="clearError"
    />

    <input
      name="password"
      type="password"
      placeholder="Contraseña"
      v-model="password"
      maxlength="8"
      @focus="clearError"
      @keyup="clearError"
    />
    <div class="messages-wrapper">
      <p class="message error" v-if="errorMsg">{{ errorMsg }}</p>
      <p class="message loading" v-if="loading">Validando...</p>
    </div>
    <button ref="loginBtn" @click="login()" :disabled="disabledButton">Acceder</button>
  </div>
</template>

<script setup lang="ts">
import { HOST, JSON_HEADER, STORE } from '@/main'
import router from '@/router'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const user = defineModel<string>('user')
const password = defineModel<string>('password')
let errorMsg = ref<string | undefined>()
let loading = ref<boolean>(false)

onMounted(() => {
  const element = document.querySelector('#login-wrapper') as HTMLDivElement
  element.addEventListener('keyup', onKeyup)
})

onBeforeUnmount(() => {
  const element = document.querySelector('#login-wrapper') as HTMLDivElement
  element.removeEventListener('keyup', onKeyup)
})

function login() {
  const body = JSON.stringify({ user: user.value, password: password.value })

  loading.value = true

  fetch(HOST + '/users/login', { method: 'post', headers: JSON_HEADER, body })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((result: any[]) => {
      if (!result.length || !result[0].name) {
        errorMsg.value = 'Usuario y/o contraseña no coinciden'
        return console.warn('--- @Login: No user/password match', result)
      }

      STORE.user.id = result[0].id
      STORE.user.name = result[0].name
      STORE.user.type = result[0].type

      STORE.isAuthenticated = true

      router.push('admin/gifts')
    })
    .catch((error) => {
      console.error('Error:', error) // Handle any errors during the fetch operation
      errorMsg.value = error
    })
    .finally(() => {
      loading.value = false
    })
}

function clearError() {
  errorMsg.value = undefined
}

/* function focusLoginButton(key: KeyboardEvent) {
  clearError()
  console.log(key.code)
  if(!key.code) return;

  if (key && key.code.toLowerCase() === 'enter' && !disabledButton.value) {
    login()
  }
} */

/* function passwordKeyup(key: KeyboardEvent) {
  clearError()
  console.log(key.code)
  if(!key.code) return;

  if (key.code.toLowerCase() === 'enter' && !disabledButton.value) {
    login()
  }
} */

function onKeyup(key: KeyboardEvent) {
  if (!key.code) return

  if (key.code.toLowerCase() === 'enter' && !disabledButton.value) {
    login()
  }
}

const disabledButton = computed({
  get(): boolean {
    return !password.value || password.value.length < 8 || errorMsg.value != undefined
  },
  set() {},
})
</script>

<style scoped>
#login-wrapper {
  display: flex;
  flex-direction: column;
  border: 2px solid purple;
  box-shadow: 0 0 10px 3px blueviolet;
  border-radius: 8px;
  max-width: 600px;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.65);
  padding: 1rem;
  width: 400px;
}

@media screen and (max-width: 767px) {
  #login-wrapper {
    width: 90%;
  }
}

#login-wrapper p.header {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

input {
  margin: 8px 0;
  border: 1px solid blueviolet;
  border-radius: 6px;
  height: 48px;
  padding-left: 6px;
}

.messages-wrapper {
  height: 32px;
  font-size: 16px;
  margin-top: -2px;
  margin-bottom: 8px;
  overflow: auto;
}

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.message.loading {
  font-weight: bold;
  color: green;
}
.message.error {
  color: rgb(189, 0, 0);
  font-weight: bold;
  background-color: yellow;
  border-radius: 6px;
}

button {
  margin-left: auto;
}
</style>
