<template>
  <div class="item" @click="openDetails(item)" :class="{ inactive: item.status == 1 }">
    <div class="item-inner">
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
  padding: 2px;
  background: linear-gradient(15deg, #9e8635, #ffeb90, #9e8635);
  border-radius: 8px;
  box-shadow: 0 0 10px 1px black;
  transition: transform 0.3s ease-in-out;
  margin: 6px;
  max-height: 130px;
}
.item:hover {
  transform: scale(1.05);
}
.item-inner {
  display: flex;
  background: linear-gradient(45deg, #0048d4, #00194a, black);
  
  /* border: 2px solid rgb(0 136 255);
  border-style: dotted; */
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
}
.item-inner:hover {
  background: black
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
  color: white;
}
.detail .title {
  color: rgb(103 164 252);
  text-transform: uppercase;
  font-weight: bold;
}
.detail a {
  margin-top: auto;
  margin-bottom: 0;
  color: #ffb822;
  font-weight: bold;
  /* text-decoration: none; */
}
.detail a:hover {
  color: whitesmoke;
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
