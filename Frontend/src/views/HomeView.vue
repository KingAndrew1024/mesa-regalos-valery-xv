<template>
  <main>
    <div class="main-wrapper">
      <div class="loading" v-if="loadingMsg">{{ loadingMsg }}</div>
      <div class="error" v-if="errorMsg">ERROR: {{ errorMsg }}</div>

      <div class="item-list" v-if="items.length">
        <ListItem
          v-for="item in items"
          :item="item"
          @open-item-details:item="openItemDetails"
        ></ListItem>
      </div>
      <div class="empty-list" v-if="!items.length && !loadingItems">
        Valeria aun no ha creado su Mesa de Regalos
        <div class="aurora">
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
        </div>
      </div>

      <div class="item-list" v-if="loadingItems">
        <FakeItem v-for="item in 8"></FakeItem>
      </div>

      <ItemDetail
        :item="selectedItem"
        @hide-details:item="hideDetails"
        @show-user-form="openUserForm"
        v-if="showDetails && selectedItem"
      ></ItemDetail>

      <UserForm
        @close-user-form="onUserFormClose"
        @confirm-user-form="onUserFormConfirm"
        v-if="showUserForm"
      ></UserForm>
    </div>
    <!-- <div class="backdrop" @click="closeBackdrop" v-if="showBackdrop"></div> -->
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ListItem from '@/components/ListItem.vue'
import { HOST, JSON_HEADER, type DBResponseType } from '@/main'
import ItemDetail from '@/components/ItemDetail.vue'
import UserForm from '@/components/UserForm.vue'
import type { Item } from './ListView.vue'
import FakeItem from '@/components/FakeItem.vue'

const items = ref<Item[]>([])
const errorMsg = ref<string | undefined>(undefined)
const loadingMsg = ref<string | undefined>(undefined)
let selectedItem = ref<Item | undefined>(undefined)

let loadingItems = ref<boolean>(false)
let showDetails = ref<boolean>(false)
let showUserForm = ref<boolean>(false)

onMounted(async () => {
  addEventListener('keyup', (key: KeyboardEvent) => {
    if (key.code && key.code.toLowerCase() === 'escape') {
      hideDetails()
      onUserFormClose()
    }
  })

  loadingItems.value = true
  /* loadingMsg.value = 'Cargando lista de regalos...' */

  fetch(HOST + '/gifts')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      // Parse the response body as JSON
      return response.json()
    })
    .then((result) => {
      items.value = result
    })
    .catch((e) => {
      errorMsg.value = JSON.stringify(e)
    })
    .finally(() => {
      /* loadingMsg.value = undefined */
      loadingItems.value = false
    })
})

function hideDetails() {
  selectedItem.value = undefined
  showDetails.value = false
}

function openItemDetails(item: Item) {
  showDetails.value = true
  selectedItem.value = item
}

function openUserForm() {
  showDetails.value = false
  showUserForm.value = true
}

function onUserFormClose() {
  showUserForm.value = false
  showDetails.value = true
}

function onUserFormConfirm(userdata: { username: string; email: string }) {
  requestBlockItem(selectedItem.value?.id!, userdata)
}

function requestBlockItem(itemId: number, userData: { username: string; email: string }) {
  showDetails.value = false
  showUserForm.value = false
  errorMsg.value = undefined
  loadingMsg.value = 'Guardando información...'

  const body = JSON.stringify(userData)
  fetch(`${HOST}/gifts/block/${itemId}`, {
    method: 'PATCH',
    headers: JSON_HEADER,
    body,
  })
    .then(async (response: Response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const r: DBResponseType = await response.json()

      if (r.changedRows) {
        showUserForm.value = false
        showDetails.value = false
        selectedItem.value = undefined
        loadingMsg.value = undefined

        const itemIdx = items.value.findIndex((i) => i.id === itemId)
        items.value[itemIdx]!.status = 1
        items.value[itemIdx]!.username = userData.username
      }
    })
    .catch((e) => {
      loadingMsg.value = undefined
      errorMsg.value = 'Hubo un error al guradar la información'

      setTimeout(() => {
        showUserForm.value = true
      }, 8000)
    })
}
</script>

<style scoped>
main {
  /* background: url(../assets/bg2.jpg) no-repeat;
  background-size: cover;
  background-position-x: 32%; */

  background: url(../assets/gifts2.avif) no-repeat;
  /* background: url(../assets/gifts.jpg) no-repeat; */
  background-size: cover;
  overflow: auto;
}

.main-wrapper {
  margin-left: auto;
  margin-right: auto;
  margin-top: 6px;
  margin-bottom: 0px;
  width: 50%;
  height: 100%;
  color: white;
}

.item-list {
  display: flex;
  flex-direction: column;
  /* padding-right: 8px; */
  color: black;
  height: 100%;
  align-items: center;
}
@media screen and (min-width: 540px) {
  .user-info {
    max-width: 75%;
    margin-left: 25%;
  }
}
@media screen and (max-width: 760px) {
  .main-wrapper {
    max-width: unset;
    width: initial;
  }
  .item {
    width: 75%;
  }
}
@media screen and (min-width: 761px) {
  .main-wrapper {
    width: 75%;
  }
  .item-list {
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
  }
  .item {
    width: 47%;
  }
}
@media screen and (min-width: 1200px) {
  .item {
    width: 32%;
  }
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.8;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.loading {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  text-align: center;
  height: min-content;
  width: inherit;
  z-index: 2;
}

.empty-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  font-weight: bold;

  background: rgba(255, 255, 255);
  color: blue;
  border-radius: 8px;
  box-shadow: 0 0 10px black;
  overflow: hidden;
  width: 300px;
  height: 300px;
}
</style>
