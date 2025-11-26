<template>
  <div class="user-form">
    <div class="header">IMPORTANTE</div>
    <div class="body">
      <div class="main-msg">
        Porfavor registra tu nombre para que otros sepan que este regalo ya fue seleccionado.
        <br />
        tambien tu correo electrónico por si necesitamos contactarte.
      </div>
      <div class="fields">
        <div class="field">
          <label for="name">Nombre:</label>
          <input
            type="text"
            name="name"
            maxlength="50"
            placeholder="Tu Nombre"
            v-model="username"
          />
        </div>
        <div class="field">
          <label for="email">Correo:</label>
          <input
            type="text"
            name="email"
            maxlength="50"
            placeholder="Correo electrónico"
            v-model="email"
          />
        </div>
      </div>
    </div>
    <div class="tail">
      <button @click="onCancel">Cancelar</button>
      <button @click="onConfirm" :disabled="!username || !email || !validEmail">Confirmar</button>
    </div>
  </div>
  <div class="backdrop" @click="onCancel"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['close-user-form', 'confirm-user-form'])
const username = defineModel<string>('username')
const email = defineModel<string>('email')

function onCancel() {
  emit('close-user-form')
}
function onConfirm() {
  emit('confirm-user-form', { username: username.value, email: email.value })
}

const validEmail = computed(() => {
  return email.value?.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g)
})
</script>

<style scoped>
.user-form {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 6px;
  border-radius: 8px;
  max-width: 90%;
  width: 260px;
  max-height: 40vh;

  display: flex;
  flex-direction: column;
  background-color: #eadafb;
  box-shadow: 0 0 12px 6px rebeccapurple;

  color: black;

  z-index: 2;
}

.header {
  text-align: center;
  font-weight: bolder;
  color: green;
  padding-bottom: 6px;
}
.body {
  height: 100%;
  display: flex;
  flex-flow: column;
  flex: 1;
}
.body .main-msg {
  margin-bottom: 6px;
}
.body .field {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.body .field:first-child {
  margin-top: 4px;
  margin-bottom: 8px;
}
.body .field label {
  font-weight: bolder;
}
.body .field input {
  height: 32px;
  border-radius: 4px;
}

.tail {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 0;
}
</style>
