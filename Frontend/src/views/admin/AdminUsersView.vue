<template>
  <div class="screen-title">Administración de Usuarios</div>
  <div>
    <button id="new-btn" @click="showCreateForm">+</button>
  </div>

  <div class="backdrop" v-if="showBackdrop"></div>
  <div class="loading" v-if="loading">{{ processingMsg }}</div>
  <div class="error" v-if="errorMsg">{{ errorMsg }}</div>

  <div class="list" v-if="!loading && !errorMsg">
    <div class="row header">
      <div>#</div>
      <div>Nombre</div>
      <div>Usuario</div>
      <div>Contraseña</div>
      <div>Fecha</div>
      <div>Acciones</div>
    </div>

    <div class="row body" v-for="(user, idx) in users">
      <div>{{ idx + 1 }}</div>
      <div>{{ user.name }}</div>
      <div>{{ user.username }}</div>
      <div>{{ user.password }}</div>
      <div>{{ user.date }}</div>
      <div>
        <span @click="deleteUser(user.id)">X</span> / <span @click="showUpdateForm(user)">E</span>
      </div>
    </div>
  </div>

  <div id="form" ref="formref">
    <div class="form-content">
      <div class="action-bar">
        <div class="cancel" @click="hideForm">X</div>
      </div>
      <div class="form-row">
        <label for="name">Nombre:</label>
        <input type="text" name="name" id="name" v-model="name" />
      </div>
      <div class="form-row">
        <label for="username">Usuario:</label>
        <input type="text" name="username" id="username" v-model="username" />
      </div>
      <div class="form-row">
        <label for="password">Contraseña:</label>
        <input type="password" name="password" id="password" v-model="password" />
      </div>
      <div class="footer actions">
        <button @click="updateUser" v-if="isUpdating">Actualizar</button>
        <button @click="createUser" v-else>Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HOST, JSON_HEADER } from '@/main'
import { onBeforeMount, ref } from 'vue'

interface UserType {
  id: number
  type: number
  name: string
  username: string
  password: string
  date: string
}

const users = ref<UserType[]>()
const loading = ref<boolean>(false)
const showBackdrop = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const processingMsg = ref<string>()
const errorMsg = ref<string>()

const formref = ref()
const selectedUserId = ref<number>()
const name = ref<string>()
const username = ref<string>()
const password = ref<string>()

onBeforeMount(() => {
  loadUsers()
})

function loadUsers() {
  loading.value = true
  showBackdrop.value = true
  processingMsg.value = 'Cargando usuarios...'

  fetch(HOST + '/users')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((results: UserType[] = []) => {
      users.value = results.filter((user) => user.type !== 1)
    })
    .catch((e) => {
      console.error(e)
    })
    .finally(() => {
      loading.value = false
      showBackdrop.value = false
    })
}

function showCreateForm() {
  formref.value.classList.add('visible')
  formref.value.style.zIndex = 2
  showBackdrop.value = true
  isUpdating.value = false
}

function showUpdateForm(user: UserType) {
  selectedUserId.value = user.id
  name.value = user.name
  username.value = user.username
  password.value = user.password
  isUpdating.value = true

  formref.value.classList.add('visible')
  formref.value.style.zIndex = 2
  showBackdrop.value = true
}

function hideForm() {
  name.value = undefined
  username.value = undefined
  password.value = undefined

  formref.value.classList.remove('visible')
  showBackdrop.value = false
}

function createUser() {
  const bodyJSON = {
    name: name.value!,
    username: username.value!,
    password: password.value!,
  }
  const body = JSON.stringify(bodyJSON)

  loading.value = true
  showBackdrop.value = true
  formref.value.style.zIndex = 1
  processingMsg.value = 'Creando usuario...'

  fetch(HOST + '/users', { method: 'POST', headers: JSON_HEADER, body })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((resp: any) => {
      console.log('--- @USERS new user', resp)

      hideForm()
      users.value?.push({
        id: resp.insertId,
        type: 0,
        ...bodyJSON,
        date: new Date().toDateString(),
      })

      name.value = username.value = password.value = undefined

      loading.value = false
      showBackdrop.value = false
    })
    .catch((e) => {
      console.error(e)
      loading.value = false
      showBackdrop.value = false
      formref.value.style.zIndex = 2
    })
}

function updateUser() {
  const body = JSON.stringify({
    name: name.value,
    username: username.value,
    password: password.value,
  })

  loading.value = true
  showBackdrop.value = true
  formref.value.style.zIndex = 1
  processingMsg.value = 'Actualizando usuario...'

  fetch(`${HOST}/users/${selectedUserId.value}`, { method: 'PATCH', headers: JSON_HEADER, body })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then(() => {
      hideForm()
      loadUsers()
    })
    .catch((e) => {
      console.error(e)
      hideForm()
      loading.value = false
      showBackdrop.value = false
      formref.value.style.zIndex = 2
    })
}

function deleteUser(userId: number) {
  loading.value = true
  showBackdrop.value = true
  processingMsg.value = 'Eliminando usuario...'

  fetch(`${HOST}/users/${userId}`, { method: 'DELETE' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then(() => {
      users.value = users.value?.filter((u) => u.id != userId)
      loading.value = false
      showBackdrop.value = false
    })
    .catch((e) => {
      console.error(e)
      loading.value = false
      showBackdrop.value = false
    })
}
</script>

<style scoped>
.screen-title {
  text-align: center;
}

.list {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.row {
  display: grid;
  grid-template-columns: 0.15fr repeat(4, 1fr) 0.4fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.row.header div {
  text-align: center;
}
.row div:not(:first-child) {
  padding: 2px 0px 2px 2px;
}

.row.header {
  position: sticky;
  top: 0px;
  background-color: black;
  color: white;
}
.row.header div,
.row.body div {
  border: 1px solid white;
}
.row div {
  overflow: hidden;
  white-space: break-spaces;
  text-overflow: ellipsis;
}
.row.body div:first-child,
.row.body div:last-child {
  text-align: center;
}

#form {
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  z-index: 2;
}
#form.visible {
  display: flex;
}
.form-content {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  border: 2px solid red;
  border-radius: 8px;
  max-width: 400px;
  padding: 8px;
  padding-top: 0;
  height: min-content;
  background: white;
  color: black;
}
.form-content .action-bar {
  display: flex;
  justify-content: flex-end;
}
.form-content .action-bar .cancel {
  cursor: pointer;
}
.form-content .form-row {
  display: flex;
  margin: 4px 0;
}
.form-content label {
  display: block;
  text-align: right;
  padding-right: 4px;
  width: 90px;
}
.form-content .footer.actions {
  display: flex;
  justify-content: flex-end;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  z-index: 2;
}

.loading,
.create-msg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  margin: auto;
  height: min-content;
  z-index: 3;
}

#new-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  border-radius: 50%;
  background-color: lightgreen;
  border-color: limegreen;
  color: black;
  font-weight: bolder;
  box-shadow: 1px 1px 6px 0 lightgray;
  width: 48px;
  height: 48px;
}
</style>
