<template>
  <div class="item-detail" v-if="item">
    <div class="item-card">
      <div class="head">
        <div class="image" :style="'--bg:url(' + item.image + ')'"></div>
        <img :src="item.image" alt="regalo" />
      </div>
      <div class="body">
        <div class="title">{{ item.title }}</div>
        <div class="description">{{ item.description }}</div>
        <div class="link">
          <div>Lo puedes encontrar en:</div>
          <ul>
            <li v-for="link in item.links">
              <a :href="link.url" target="_blank">{{ link.text }}</a>
            </li>
          </ul>
        </div>
        <div class="note" v-if="item.status === 1">
          <strong>NOTA:</strong> Este artículo ya fue elegido por
          <strong>{{ item.username }}</strong>
        </div>
      </div>
      <div class="tail">
        <button @click="close" class="close">Cerrar</button>
        <button @click="showUserForm" v-if="item.status === 0">Quiero regalarlo</button>
      </div>
    </div>
  </div>
  <div class="backdrop" @click="close"></div>
</template>

<script setup lang="ts">
import type { Item } from '@/views/ListView.vue'

const props = defineProps<{
  item: Item | undefined
}>()

const emit = defineEmits(['hide-details:item', 'show-user-form'])

function close() {
  emit('hide-details:item', undefined)
}

function showUserForm() {
  emit('show-user-form')
}
</script>

<style scoped>
.item-detail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 90%;
  width: 400px;
  max-height: 80vh;
}
.item-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.item-card {
  display: flex;
  flex-direction: column;
  background-color: #eadafb;
  margin: auto 8px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 0 12px 6px rebeccapurple;
  width: 100%;
  z-index: 1;
}

.head {
  position: relative;
  background-color: gray;
  height: 200px;
  border-radius: 6px;
}
.body {
  flex: 1;
  padding: 6px;
}
.tail {
  display: flex;
  justify-content: space-between;
}

.image {
  background: var(--bg) no-repeat;
  background-size: cover;
  background-position: center;
  height: 200px;
  filter: blur(4px) brightness(0.7);
  --webkit-filter: blur(4px) brightness(0.7);
}
img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: inherit;
  height: inherit;
}

.body {
  display: flex;
  flex-direction: column;
}
.body .title {
  color: rgb(172, 114, 226);
  text-transform: uppercase;
  font-weight: bold;
}
.body .description {
  color: black;
}
.body .link {
  color: black;
  overflow: auto;
  word-break: break-word;
  white-space: break-spaces;
  max-height: 22vh;
}
.body .note {
  margin-top: auto;
  margin-bottom: 0;
  color: red;
}
strong {
  color: black;
  font-weight: bold;
}

ul li {
  margin: 2px 0;
}

.body a,
.body a:visited {
  /* display: block; */
  color: blue;
}
.body a:hover {
  color: green;
}

.tail .close {
  border-color: red;
  background-color: orange;
  color: black;
}
</style>
