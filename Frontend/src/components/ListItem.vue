<template>
  <div class="item" @click="openDetails(item)" :class="{ inactive: item.status == 1 }">
    <div class="image">
      <img :src="item.image" alt="" />
      <div class="unable" v-if="item.status === 1">NO DISPONIBLE</div>
    </div>
    <div class="detail">
      <div class="title">{{ item.title }}</div>
      <div class="description">{{ item.description }}</div>
      <a href="javascript:void(0)">Más detalles</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from '@/views/ListView.vue'

const emit = defineEmits(['open-item-details:item'])
const props = defineProps<{ item: Item }>()

function openDetails(item: Item) {  
  emit('open-item-details:item', item)
}
</script>

<style scoped>
.item {
  display: flex;
  background-color: white;
  box-shadow: 0 0 10px 1px green;
  margin: 6px;
  border: 2px solid rgb(255, 0, 0);
  border-style: dotted;
  border-radius: 8px;
  padding: 8px;
  max-height: 130px;
  cursor: pointer;
}
.item.inactive {
  background-color: lightgray;
  /* border-style: unset; */
  border-color: black;
  box-shadow: none;
  color: black;
}

.image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image,
img {
  width: 100px;
  height: 100px;
}

img {
  box-shadow: 0 0 6px 0px black;
  border-radius: 8px;
}
.inactive img {
  filter: saturate(0) brightness(0.4);
}
.unable {
  position: absolute;
  color: white;
  text-align: center;
}

.detail {
  display: flex;
  flex-direction: column;
  padding: 0px 9px;
}
.detail .title {
  color: rgb(172, 114, 226);
  text-transform: uppercase;
  font-weight: bold;
}
.detail a {
  margin-top: auto;
  margin-bottom: 0;
  color: blue;
  font-weight: bold;
  /* text-decoration: none; */
}
.detail a:hover {
  color: green;
}

@media screen and (min-width: 761px) {
  .item {
    width: 47%;
  }
}
@media screen and (min-width: 1200px) {
  .item {
    width: 32%;
  }
}
</style>
