<template>
  <div class="item" @click="openDetails(item)" :class="{ inactive: item.status == 1 }">
    <div class="ribbon" :class="'ribbon_' + randomNumber" v-if="item.status == 0"></div>
    <div class="item-inner">
      <div class="image">
        <div class="stripe" v-if="item.status == 0"></div>
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
import { computed } from 'vue'

const emit = defineEmits(['open-item-details:item'])
const props = defineProps<{ item: Item }>()

function openDetails(item: Item) {
  emit('open-item-details:item', item)
}

const randomNumber = computed(() => {
  const min = 1,
    max = 5
  return Math.floor(Math.random() * (max - min + 1) + min)
})
</script>

<style scoped>
.item {
  position: relative;
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
  background: linear-gradient(45deg, #ffffff, #e3f4ef, #99d0d3);
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
}

.item.inactive {
  background: linear-gradient(15deg, #332d03, #bc9a00, #332d03);
}
.item.inactive .item-inner {
  filter: saturate(0) brightness(0.7) contrast(1.1);
  --webkit-filter: saturate(0) brightness(0.7) contrast(1.1);
  /* background: linear-gradient(45deg, #798498, #596070, #2a2d3b); */
}

.item .ribbon {
  position: absolute;
  top: -10px;
  right: -10px;
  background-size: contain;
  width: 50px;
  height: 60px;
}
.item.inactive .ribbon {
  filter: saturate(0.2);
  --webkit-filter: saturate(0.2);
}

.ribbon_1 {
  background: url(../assets/ribbon.png) no-repeat;
}
.ribbon_2 {
  background: url(../assets/ribbon_2.png) no-repeat;
}
.ribbon_3 {
  background: url(../assets/ribbon_3.png) no-repeat;
}
.ribbon_4 {
  background: url(../assets/ribbon_4.png) no-repeat;
}
.ribbon_5 {
  background: url(../assets/ribbon_5.png) no-repeat;
}

.stripe {
  position: absolute;
  top: -3px;
  left: -3px;
  width: 40px;
  height: 40px;
  background: url(../assets/stripe.png) no-repeat;
  background-size: contain;
  transform: rotateZ(270deg);
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
  box-shadow: 0 0 6px 0px #777;
  border-radius: 8px;
}
.inactive img {
  filter: saturate(0) brightness(0.4);
  --webkit-filter: saturate(0) brightness(0.4);
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
  color: black;
}
.detail .title {
  color: rgb(0 122 129);
  text-transform: uppercase;
  font-weight: bold;
  margin-right: 30px;
}
.detail a {
  margin-top: auto;
  margin-bottom: 0;
  font-weight: bold;
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
