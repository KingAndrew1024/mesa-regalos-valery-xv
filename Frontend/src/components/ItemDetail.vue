<template>
  <div class="card" v-if="item">
    <div class="header">
      <div class="image" :style="'--bg:url(' + item.image + ')'"></div>
      <img :src="item.image" alt="regalo" />
    </div>
    <div class="main">
      <div class="title">{{ item.title }}</div>
      <div class="description">{{ item.description }}</div>
      <div class="link">
        <div>Lo puedes encontrar en:</div>
        <ul>
          <li v-for="link in JSON.parse(item.links)">
            <a :href="link.url" target="_blank"><span class="icon open-link"></span>{{ link.text }}</a>
          </li>
        </ul>
      </div>
      <div class="note" v-if="item.status === 1">
        Este artículo ya fue elegido por:
        <strong>{{ item.username || "tí"}}</strong>
      </div>
    </div>
    <div class="footer">
      <button @click="close" class="cancel">Cerrar</button>
      <button @click="showUserForm" v-if="item.status === 0">Quiero regalarlo</button>
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
.card {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  margin: auto;
  max-width: 90%;
  width: 400px;
  height: min-content;
  max-height: 80vh;
  z-index: 2;
}

.card .header {
  position: relative;
  background-color: gray;
  border-radius: 6px;
  height: 200px;
}

.card .header .image {
  background: var(--bg) no-repeat;
  background-size: cover;
  background-position: center;
  height: 200px;
  filter: blur(4px) brightness(0.7);
  --webkit-filter: blur(4px) brightness(0.7);
}
.card .header img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 90%;
  max-height: 90%;
}

.card .main {
  flex: 1;
  padding: 6px;
}

.main {
  display: flex;
  flex-direction: column;
}
.main .title {
  text-align: center;
  text-transform: uppercase;
  color: black;
  font-weight: bold;
  margin-bottom: 4px;
}
.main .description {
  color: black;
  margin-bottom: 8px;
}
.main .link {
  color: black;
  overflow: auto;
  word-break: break-word;
  white-space: break-spaces;
  max-height: 22vh;
}
.main .link div {
  font-weight: lighter;
  padding-left: 8px;
}
.main .note {
  font-weight: bold;
  color: red;
  margin-top: 8px;
  margin-bottom: 0;
}
strong {
  color: black;
  font-weight: bold;
}

ul {
  padding-left: 8px;
}
ul li {
  margin-top: 8px;
  list-style-type: none;
  display: flex;
}
ul li .icon {
  margin-right: 4px;
}
ul li a {
  display: flex;
}

.main a,
.main a:visited {
  font-weight: 500;
}
</style>
