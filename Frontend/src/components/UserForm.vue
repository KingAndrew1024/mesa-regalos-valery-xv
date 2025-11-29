<template>
  <div class="card">
    <div class="header">IMPORTANTE</div>
    <div class="main">
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
            autofocus
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
    <div class="footer">
      <button @click="onCancel" class="cancel">Cancelar</button>
      <button @click="onConfirm" :disabled="!username || !email || !validEmail" class="confirm">
        Confirmar
      </button>
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
.card {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 90%;
  width: 260px;
  max-height: 40vh;
  z-index: 2;
}

.card .main .main-msg {
  margin-bottom: 6px;
}
.card .main .field {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.card .main .field:first-child {
  margin-top: 4px;
  margin-bottom: 8px;
}
.card .main .field label {
  font-weight: bolder;
}
.card .main .field input {
  height: 32px;
  border-radius: 4px;
}
</style>
