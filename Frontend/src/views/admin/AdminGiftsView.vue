<template>
  <div id="main-wrapper">
    <div class="screen-title">Administración de Regalos</div>
    <div class="gift-btn-wrapper" v-if="gifts?.length! > 0">
      <div class="gift-btn" @click="showCreateForm"></div>
    </div>
    <!-- <div>
      <button id="new-btn" @click="showCreateForm" v-if="gifts?.length! > 0">+</button>
    </div> -->

    <div class="backdrop" v-if="showBackdrop"></div>
    <div class="loading" v-if="loading">{{ processingMsg }}</div>
    <div class="error" v-if="errorMsg">{{ errorMsg }}</div>

    <div
      class="empty-list"
      v-if="!loading && !errorMsg && gifts?.length! == 0 && !showForm && !showLinksForm"
    >
      <div class="title">
        <p>¡Feliz XV aniversario Valeria!</p>
        <div class="aurora">
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
          <div class="aurora__item"></div>
        </div>
        <div class="subtitle">
          Haz click en el regalo para comenzar a crear tu lista de obsequios
        </div>
      </div>
      <div class="gift-btn-wrapper">
        <div class="gift-btn" @click="showCreateForm"></div>
      </div>
      <!-- <button id="new-btn" class="big" @click="showCreateForm">+</button> -->
    </div>

    <div class="list" v-if="!loading && !errorMsg && gifts!.length > 0">
      <div class="row header">
        <div>!</div>
        <div>Titulo</div>
        <div>Descripción</div>
        <div>Imagen</div>
        <div>Links tiendas</div>
        <!-- <div>Acciones</div> -->
      </div>
      <div class="row body" v-for="(gift, idx) in gifts">
        <div>
          <!-- {{ idx + 1 }} -->
          <div class="gift-actions">
            <div @click="showConfirmDelete(gift.id)" class="icon delete"></div>
            <div @click="showUpdateForm(gift)" class="icon edit"></div>
          </div>
        </div>
        <div class="gift-title">
          <div>
            {{ gift.title }}
          </div>
        </div>
        <div>{{ gift.description }}</div>
        <div class="image-wrapper">
          <img :src="gift.image" alt="regalo" />
        </div>
        <div class="link-row-wrapper">
          <div v-for="gLink in gift.links" class="link-row">
            <div>{{ gLink.text }}</div>
            <div>{{ gLink.url }}</div>
          </div>
        </div>
        <!-- <div>
          <span @click="showConfirmDelete(gift.id)">X</span> /
          <span @click="showUpdateForm(gift)">E</span>
        </div> -->
      </div>
    </div>

    <div id="form" :hidden="!showForm || loading">
      <div class="card">
        <div class="header">Nuevo Regalo</div>
        <div class="main">
          <div class="form-row">
            <label for="title">Título:</label>
            <input type="text" name="title" id="title" v-model="title" />
          </div>
          <div class="form-row">
            <label for="description">Descripción:</label>
            <input type="text" name="description" id="description" v-model="description" />
          </div>
          <div class="form-row">
            <label for="image">Link Imagen:</label>
            <input type="url" name="image" id="image" v-model="image" />
            <div class="link-format-error" v-if="image && invalidImageLinkFormat">
              Debe comenzar con http:// o https://
            </div>
          </div>
          <div class="form-row stores">
            <label for="url"
              >Link tiendas: <span name="url" class="icon add" @click="openLinksForm"></span
            ></label>
            <!-- <a href="javascript:void(0)" @click="openLinksForm" v-if="links.length < 4">Agregar</a> -->
          </div>
          <div class="form-row link-list" v-if="links?.length > 0">
            <div class="link-list-head">
              <div>Nombre</div>
              <div>Link</div>
            </div>
            <div class="link" v-for="(link, idx) in links" :class="{ odd: (idx + 1) % 2 != 0 }">
              <div class="link-text">
                <div class="text">{{ link.text }}</div>
                <div class="link-actions">
                  <div class="icon delete"></div>
                  <div class="icon edit"></div>
                </div>
              </div>
              <div class="link-url">{{ link.url }}</div>
            </div>
          </div>
        </div>
        <div class="footer">
          <button @click="hideForm" class="cancel">Cancelar</button>
          <button @click="updateGift" v-if="isUpdating" class="confirm">Actualizar</button>
          <button @click="createGift" :disabled="invalidGiftForm" class="confirm" v-else>
            Guardar
          </button>
        </div>
      </div>
    </div>

    <div id="links-form" v-if="showLinksForm">
      <div class="card">
        <div class="header">Agregar Link</div>
        <div class="main">
          <div class="form-row">
            <label for="linkText">Texto:</label>
            <input type="text" name="linkText" id="linkText" v-model="linkText" />
          </div>
          <div class="form-row">
            <label for="linkUrl">Enlace:</label>
            <input type="url" name="linkUrl" id="linkUrl" v-model="linkUrl" />
            <div class="link-format-error" v-if="linkUrl && invalidLinkFormat">
              Debe comenzar con http:// o https://
            </div>
          </div>
        </div>
        <div class="footer">
          <button @click="closeLinksForm" class="cancel">Cancelar</button>
          <button @click="addLink" :disabled="!linkText || !linkUrl || invalidLinkFormat">
            Agregar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="confirm-dialog" v-if="showConfirmDialog">
    <div class="header">CONFIRMAR</div>
    <div class="body">¿Seguro que quieres eliminar este elemento?</div>
    <div class="footer">
      <button class="destructive" @click="hideConfirmDelete">NO</button>
      <button @click="deleteGift(selectedGiftId!)">SÍ</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HOST, JSON_HEADER, type DBResponseType, type GiftType } from '@/main'
import { computed, onBeforeMount, ref } from 'vue'

const gifts = ref<GiftType[]>()
const selectedGiftId = ref<number>()
const title = ref<string>()
const description = ref<string>()
const image = ref<string>()
const links = ref<{ text: string; url: string }[]>([])
const linkText = ref<string>()
const linkUrl = ref<string>()

const loading = ref<boolean>(false)
const showForm = ref<boolean>(false)
const showLinksForm = ref<boolean>(false)
const showBackdrop = ref<boolean>(false)
const showConfirmDialog = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const processingMsg = ref<string>()
const errorMsg = ref<string>()

onBeforeMount(() => {
  loadGifts()
})

function loadGifts() {
  loading.value = true
  showBackdrop.value = true
  processingMsg.value = 'Cargando regalos...'

  fetch(HOST + '/gifts')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((results: GiftType[] = []) => {
      gifts.value = results /* .filter((user) => user.type !== 1) */
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
  showForm.value = true
  showBackdrop.value = true
  isUpdating.value = false
}

function hideForm() {
  title.value = undefined
  description.value = undefined
  image.value = undefined
  links.value = []

  showForm.value = false
  showBackdrop.value = false
}

function showUpdateForm(gift: GiftType) {
  selectedGiftId.value = gift.id
  title.value = gift.title
  description.value = gift.description
  image.value = gift.image
  links.value = [...gift.links]

  showForm.value = true
  showBackdrop.value = true
  isUpdating.value = true
}

function createGift() {
  const bodyJSON = {
    title: title.value!,
    description: description.value!,
    image: image.value!,
    links: links.value!,
  }
  const body = JSON.stringify(bodyJSON)

  loading.value = true
  showBackdrop.value = true
  processingMsg.value = 'Creando regalo...'

  fetch(HOST + '/gifts', { method: 'POST', headers: JSON_HEADER, body })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((resp: any) => {
      console.log(resp)

      //hideForm()
      gifts.value?.push({
        id: resp.insertId,
        ...bodyJSON,
        status: 0,
        purchase_date: '',
      })

      title.value = undefined
      description.value = undefined
      image.value = undefined
      links.value = []

      loading.value = false
      //showBackdrop.value = false
    })
    .catch((e) => {
      console.error(e)
      loading.value = false
      showBackdrop.value = false
    })
}

function updateGift() {
  const JSONBody = {
    title: title.value!,
    description: description.value!,
    image: image.value!,
    links: links.value!,
  }
  const body = JSON.stringify(JSONBody)

  loading.value = true
  showBackdrop.value = true
  processingMsg.value = 'Actualizando regalo...'

  fetch(`${HOST}/gifts/${selectedGiftId.value}`, { method: 'PATCH', headers: JSON_HEADER, body })
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((resp: DBResponseType) => {
      if (resp.affectedRows === 1) {
        const giftList: GiftType[] = gifts.value!
        const giftIdx = giftList.findIndex((g) => g.id === selectedGiftId.value)!
        let oldGift = giftList[giftIdx]!

        oldGift = { ...oldGift, ...JSONBody }

        gifts.value![giftIdx] = oldGift

        hideForm()
        loading.value = false
        showBackdrop.value = false
      } else {
        processingMsg.value = 'Hubo un error al actualizar el regalo.'
        setTimeout(() => {
          hideForm()
          loading.value = false
          showBackdrop.value = false
        }, 8000)
      }
    })
    .catch((e) => {
      console.error(e)
      hideForm()
      loading.value = false
      showBackdrop.value = false
    })
}

function showConfirmDelete(id: number) {
  showConfirmDialog.value = true
  showBackdrop.value = true
  selectedGiftId.value = id
  //processingMsg.value = ''
  //deleteGift(id)
}

function hideConfirmDelete() {
  showConfirmDialog.value = false
  showBackdrop.value = false
}

function deleteGift(id: number) {
  loading.value = true
  showBackdrop.value = true
  showConfirmDialog.value = false
  processingMsg.value = 'Eliminando regalo...'

  fetch(`${HOST}/gifts/${id}`, { method: 'DELETE' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then(() => {
      gifts.value = gifts.value?.filter((g) => g.id != id)
      loading.value = false
      showBackdrop.value = false
    })
    .catch((e) => {
      console.error(e)
      loading.value = false
      showBackdrop.value = false
    })
}

function openLinksForm() {
  showForm.value = false
  showLinksForm.value = true
}

function closeLinksForm() {
  showForm.value = true
  showLinksForm.value = false
}

const invalidGiftForm = computed(() => {
  return (
    !title.value ||
    !description.value ||
    !image.value ||
    invalidImageLinkFormat.value ||
    links.value.length === 0
  )
})

const invalidImageLinkFormat = computed(() => {
  const match = image.value?.match(/^(http|https):\/\//g)
  return !match
})

const invalidLinkFormat = computed(() => {
  const match = linkUrl.value?.match(/^(http|https):\/\//g)
  return !match
})

function addLink() {
  links.value.push({ text: linkText.value!, url: linkUrl.value! })
  linkText.value = undefined
  linkUrl.value = undefined
  closeLinksForm()
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
  background-color: #f5f5f5eb;
  color: black;
  overflow-x: auto;
}

.row {
  display: grid;
  grid-auto-columns: auto;
  grid-template-columns: 0.25fr repeat(3, 1fr) 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.row div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* word-break: break-all; */
}
.row div:not(:first-child) {
  padding: 2px 0px 2px 2px;
}
.row.header {
  position: sticky;
  top: 0px;
  background-color: black;
  color: white;
  min-width: 600px;
}
.row.header div {
  text-align: center;
}
.row.header div,
.row.body > div {
  border: 1px solid #aaa;
}

.row.body {
  min-width: 600px;
}
.row.body > div:not(.link-row-wrapper):not(.link-row):not(.link-row div:last-child) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.row.body div:first-child,
.row.body div:last-child {
  text-align: center;
}
.row.body .gift-title {
  display: flex;
  flex-direction: column;
}
.row.body .gift-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: auto;
}
.row.body .gift-actions .icon {
  margin: 8px 0;
}

.row.body .image-wrapper {
  display: flex;
  justify-content: center;
}
.row.body img {
  width: 80px;
  height: 80px;
  margin: auto;
}

#form,
#links-form {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  z-index: 2;
}
#form.visible {
  display: flex;
}

.card {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  max-width: 380px;
  height: min-content;
}
.card .header {
  text-align: center;
  font-weight: bold;
}

.form-row {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 8px;
}
.form-row label {
  font-weight: bold;
}
.form-row input {
  width: 100%;
  border-radius: 4px;
  height: 28px;
}
.form-row.stores {
  flex-direction: row;
}
.form-row.stores label {
  display: flex;
}
.form-row.stores label .icon {
  margin-left: 4px;
}
.card .actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.card .link-format-error {
  color: red;
  font-size: 13px;
}

.backdrop {
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

@media screen and (min-width: 930px) {
  /* #new-btn {
    position: absolute;
    right: 24px;
    bottom: 8px;
    border-radius: 50%;
    background-color: lightgreen;
    border-color: limegreen;
    color: green;
    font-weight: bolder;
    box-shadow: 1px 1px 6px 0 lightgray;
    width: 48px;
    height: 48px;
  } */

  /* #new-btn.big {
    position: initial;
    font-size: 28px;
    box-shadow: 3px 3px 12px 0 rgb(66, 66, 66);
    width: 72px;
    height: 72px;
  } */

  .gift-btn-wrapper {
    position: absolute;
    right: 24px;
    bottom: 32px;
    height: 32px !important;
  }
  .gift-btn {
    animation: beat-small 2s infinite;
  }
  .gift-btn:hover {
    animation: none;
    width: 40px;
    height: 40px;
  }
}

.confirm-dialog {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  display: flex;
  flex-flow: column;
  background-color: white;
  border: 2px solid red;
  border-radius: 8px;
  color: black;
  padding: 6px;
  width: 250px;
  height: 130px;
  z-index: 2;
}
.confirm-dialog .header {
  text-align: center;
  font-weight: bolder;
  color: orangered;
}
.confirm-dialog .body {
  flex: 1;
}
.confirm-dialog .footer {
  display: flex;
  justify-content: space-between;
}
.confirm-dialog .footer .destructive {
  border-color: red;
  background-color: lightsalmon;
  color: black;
}

.link-list {
  max-height: 35vh;
  overflow: auto;
}
.link-list .link-list-head {
  position: sticky;
  top: 0;
  display: flex;
  background-color: black;
  color: whitesmoke;
}
.link-list .link-list-head div:first-child {
  text-align: center;
  width: 30%;
}
.link-list .link-list-head div:last-child {
  text-align: center;
  border-left: 1px solid white;
  width: 70%;
}
.link-list .link {
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
}
.link-list .link:nth-child(2n + 2) {
  border-top-width: 0;
}
.link-list .link.odd {
  background-color: #e6e6e6;
}

.link-list .link .link-text .text {
  font-weight: bold;
}
.link-list .link .link-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
  width: 30%;
}
.link-text .link-actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.link-list .link .link-url {
  border-left: 1px solid lightgray;
  word-break: break-all;
  padding: 2px;
  width: 70%;
}

.row.body .link-row-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 4px;
}
.row.body .link-row {
  margin-bottom: 2px;
  padding: 0 4px;
}
.row.body .link-row div {
  border: 0;
}
.link-row div:first-child {
  font-weight: bold;
}

.empty-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.85);
  box-shadow: 0 0 16px white;
  color: green;
  margin: auto;
  max-width: 600px;
  max-height: 400px;
  width: 75%;
}
.empty-list .title {
  position: relative;
  overflow: hidden;
  margin-top: -10%;
  margin-bottom: 10%;
}
.empty-list .title p,
.empty-list .subtitle {
  text-transform: uppercase;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
  color: white;
}
.empty-list .subtitle {
  width: 70%;
  margin: auto;
  margin-top: 8px;
  font-size: 1.1em;
}
.empty-list .gift-btn-wrapper {
  position: initial;
  height: 80px;
}
.empty-list .gift-btn {
  animation: beat 2s infinite;
}

.gift-btn {
  background: url(../../assets/birthday-gift.png);
  background-size: cover;
  cursor: pointer;
}

@keyframes beat {
  0% {
    filter: drop-shadow(5px 5px 10px blueviolet);
    width: 72px;
    height: 72px;
  }
  50% {
    filter: drop-shadow(5px 5px 10px #fff);
    width: 80px;
    height: 80px;
  }
  100% {
    filter: drop-shadow(5px 5px 10px blueviolet);
    width: 72px;
    height: 72px;
  }
}

@keyframes beat-small {
  0% {
    filter: drop-shadow(5px 5px 10px blueviolet);
    width: 32px;
    height: 32px;
  }
  50% {
    filter: drop-shadow(5px 5px 10px #fff);
    width: 40px;
    height: 40px;
  }
  100% {
    filter: drop-shadow(5px 5px 10px blueviolet);
    width: 32px;
    height: 32px;
  }
}

.aurora {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  mix-blend-mode: darken;
  pointer-events: none;
}

.aurora__item {
  overflow: hidden;
  position: absolute;
  width: 60vw;
  height: 60vw;
  background-color: #00c2ff;
  border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  filter: blur(1rem);
  mix-blend-mode: overlay;
}

.aurora__item:nth-of-type(1) {
  top: -50%;
  animation:
    aurora-border 6s ease-in-out infinite,
    aurora-1 12s ease-in-out infinite alternate;
}

.aurora__item:nth-of-type(2) {
  background-color: #ffc640;
  right: 0;
  top: 0;
  animation:
    aurora-border 6s ease-in-out infinite,
    aurora-2 12s ease-in-out infinite alternate;
}

.aurora__item:nth-of-type(3) {
  background-color: #33ff8c;
  left: 0;
  bottom: 0;
  animation:
    aurora-border 6s ease-in-out infinite,
    aurora-3 8s ease-in-out infinite alternate;
}

.aurora__item:nth-of-type(4) {
  background-color: #e54cff;
  right: 0;
  bottom: -50%;
  animation:
    aurora-border 6s ease-in-out infinite,
    aurora-4 16s ease-in-out infinite alternate;
}

@keyframes aurora-1 {
  0% {
    top: 0;
    right: 0;
  }

  50% {
    top: 100%;
    right: 75%;
  }

  75% {
    top: 100%;
    right: 25%;
  }

  100% {
    top: 0;
    right: 0;
  }
}

@keyframes aurora-2 {
  0% {
    top: -50%;
    left: 0%;
  }

  60% {
    top: 100%;
    left: 75%;
  }

  85% {
    top: 100%;
    left: 25%;
  }

  100% {
    top: -50%;
    left: 0%;
  }
}

@keyframes aurora-3 {
  0% {
    bottom: 0;
    left: 0;
  }

  40% {
    bottom: 100%;
    left: 75%;
  }

  65% {
    bottom: 40%;
    left: 50%;
  }

  100% {
    bottom: 0;
    left: 0;
  }
}

@keyframes aurora-4 {
  0% {
    bottom: -50%;
    right: 0;
  }

  50% {
    bottom: 0%;
    right: 40%;
  }

  90% {
    bottom: 50%;
    right: 25%;
  }

  100% {
    bottom: -50%;
    right: 0;
  }
}

@keyframes aurora-border {
  0% {
    border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  }

  25% {
    border-radius: 47% 29% 39% 49% / 61% 19% 66% 26%;
  }

  50% {
    border-radius: 57% 23% 47% 72% / 63% 17% 66% 33%;
  }

  75% {
    border-radius: 28% 49% 29% 100% / 93% 20% 64% 25%;
  }

  100% {
    border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  }
}
</style>
