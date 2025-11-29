<template>
  <div id="main-wrapper">
    <div class="gift-btn-wrapper" v-if="gifts?.length! > 0">
      <div class="gift-btn" @click="showCreateForm"></div>
    </div>

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
      <div class="row body" v-for="(gift, idx) in gifts" :class="{ odd: (idx + 1) % 2 != 0 }">
        <div>
          <!-- {{ idx + 1 }} -->
          <div class="gift-actions">
            <div>({{ idx + 1 }})</div>
            <div @click="showConfirmDelete(gift.id)" class="icon delete"></div>
            <div @click="showUpdateForm(gift)" class="icon edit"></div>
          </div>
        </div>
        <div class="gift-title">
          <div>
            {{ gift.title }}
          </div>
        </div>
        <div class="gift-description">{{ gift.description }}</div>
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
            <input type="text" name="title" id="title" autofocus v-model="title" />
          </div>
          <div class="form-row">
            <label for="description">Descripción:</label>
            <input type="text" name="description" id="description" v-model="description" />
          </div>
          <div class="form-row">
            <label for="image">Link Imagen:</label>
            <textarea type="url" name="image" id="image" v-model="image" ></textarea>
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
                  <div class="icon delete" @click="openDeleteLink(link, idx)"></div>
                  <div class="icon edit" @click="openUpdateLink(link, idx)"></div>
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

        <div
          class="backdrop inner"
          v-if="showLinksForm || isDeleteLinkOpen || isUpdateLinkOpen"
        ></div>
        <!-- ADD LINK FORM -->
        <div class="card" v-if="showLinksForm">
          <div class="header">Agregar Link</div>
          <div class="main">
            <div class="form-row">
              <label for="linkText">Texto:</label>
              <input type="text" name="linkText" id="linkText" autofocus v-model="linkText" />
            </div>
            <div class="form-row">
              <label for="linkUrl">Enlace:</label>
              <textarea type="url" name="linkUrl" id="linkUrl" v-model="linkUrl"></textarea>
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
        <!-- DELETE LINK CONFIRM -->
        <div class="card" v-if="isDeleteLinkOpen">
          <div class="header">Confirmar</div>
          <div class="main">¿Realmente quieres eliminar este Link?</div>
          <div class="footer">
            <button @click="closeDeleteLink()">Cancelar</button>
            <button class="cancel" @click="confirmDeleteLink()">Aceptar</button>
          </div>
        </div>
        <!-- UPDATE LINK FORM -->
        <div class="card" v-if="isUpdateLinkOpen">
          <div class="header">Actualizar Link</div>
          <div class="main">
            <div class="form-row">
              <label for="link-title">Texto</label>
              <input type="text" name="link-title" id="link-title" autofocus v-model="linkText" />
            </div>
            <div class="form-row">
              <label for="link-url">Link</label>
              <textarea name="link-url" id="link-url" v-model="linkUrl"></textarea>
              <div class="link-format-error" v-if="linkUrl && invalidLinkFormat">
                Debe comenzar con http:// o https://
              </div>
            </div>
          </div>
          <div class="footer">
            <button @click="closeUpdateLink()">Cancelar</button>
            <button class="cancel" @click="confirmUpdateLink()">Aceptar</button>
          </div>
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
const isDeleteLinkOpen = ref<boolean>(false)

const showConfirmDialog = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const processingMsg = ref<string>()
const errorMsg = ref<string>()

let selectedLinkIdx: number
const isUpdateLinkOpen = ref<boolean>(false)

const showBackdrop = ref<boolean>(false)

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
  linkText.value = undefined
  linkUrl.value = undefined
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

function openDeleteLink(linkData: { text: string; url: string }, idx: number) {
  linkText.value = linkData.text
  linkUrl.value = linkData.url
  selectedLinkIdx = idx
  isDeleteLinkOpen.value = true
  links.value[idx]
}
function closeDeleteLink() {
  /* selectedLink.value = undefined */
  isDeleteLinkOpen.value = false
}
function confirmDeleteLink() {
  links.value.splice(selectedLinkIdx, 1)
  /* selectedLink.value = undefined */
  isDeleteLinkOpen.value = false
}

function openUpdateLink(linkData: { text: string; url: string }, idx: number) {
  linkText.value = linkData.text
  linkUrl.value = linkData.url
  selectedLinkIdx = idx
  isUpdateLinkOpen.value = true
}
function closeUpdateLink() {
  /* selectedLink.value = undefined */
  isUpdateLinkOpen.value = false
}
function confirmUpdateLink() {
  links.value[selectedLinkIdx]!.text = linkText.value!
  links.value[selectedLinkIdx]!.url = linkUrl.value!
  /* selectedLink.value = undefined */
  isUpdateLinkOpen.value = false
}
</script>

<style scoped>
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
.row.body .gift-title div,
.row.body .gift-description {
  word-break: break-word;
  white-space: break-spaces;
  text-align: justify;
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
.card .card {
  width: 85%;
  box-shadow: none;
  z-index: 2;
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
.backdrop.inner {
  border-radius: 8px;
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
.link-list .link:not(.odd) {
  background-color: whitesmoke;
}
.link-list .link:nth-child(2n + 2) {
  border-top-width: 0;
}
.odd {
  background-color: #ecfff3;
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
  margin-top: 4px;
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
  background: rgba(0, 0, 0, 0.88);
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
    filter: drop-shadow(0px 0px 20px rgb(0, 213, 255));
    width: 72px;
    height: 72px;
  }
  50% {
    filter: drop-shadow(0px 0px 10px rgb(255, 242, 0));
    width: 80px;
    height: 80px;
  }
  100% {
    filter: drop-shadow(0px 0px 20px rgb(0, 213, 255));
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
</style>
