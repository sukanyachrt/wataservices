<script setup>
import services from '@/services'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
const dialogVisible = ref(false)
const resolvePromise = ref()
const rejectPromise = ref()
const linkSurvey = ref('')
const passcode =ref('')
const showDialog = async data => {
  dialogVisible.value = true
  passcode.value=data.data.passcode
  const url = window.location.origin
      
  linkSurvey.value=url+"/" +await services.projectLink(data.data.encrypted_url);
  return new Promise((resolve, reject) => {
    resolvePromise.value = () => {
      resolve(true)
      dialogVisible.value = false
    }

    rejectPromise.value = () => {
      resolve(false)
      dialogVisible.value = false
    }
  })
}
const ShowConfirm = () => {
  resolvePromise.value()
}
const _cancel = () => {
  rejectPromise.value()
}
defineExpose({ showDialog })

const CopyLink = () => {
  try {
    navigator.clipboard.writeText(linkSurvey.value)
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Copy ลิงค์ Url แล้วค่ะ !',
      showConfirmButton: false,
      timer: 3000,
    })
  } catch ($e) {}
}

const CopyPasscode = () => {
  try {
    navigator.clipboard.writeText(passcode.value)
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Copy Passcode แล้วค่ะ !',
      showConfirmButton: false,
      timer: 3000,
    })
  } catch ($e) {}
}


const qrcode = ref(null)
const downloadQrCode = async () => {
  const qrcodeElement = qrcode.value // Rename the variable to avoid conflict
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const context = canvas.getContext('2d')
  const img = new Image()

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = qrcodeElement.querySelector('img').src
  })

  context.drawImage(img, 0, 0)

  const borderWidth = 1
  context.strokeStyle = 'white'
  context.lineWidth = borderWidth
  context.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth)

  const link = document.createElement('a')
  link.download = 'คิวอาร์โค้ด Link.png' // Assuming typeImage is defined elsewhere
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <VDialog
    transition="dialog-top-transition"
    width="500"
    v-model="dialogVisible"
  >
    <VCard title="แชร์ลิงค์">
      <VDivider class="mb-6" />
      <VCardText>
        {{ datadialog }}
        <VTextField
          v-model="linkSurvey"
          variant="outlined"
          readonly
          label="ลิงค์ URL"
          type="text"
        >
        

          <template v-slot:append>
            <VBtn
              v-bind="props"
              icon
              color="primary"
              size="x-small"
              variant="text"
              @click="CopyLink"
            >
              <VIcon
                class="me-1"
                icon="ri-file-copy-line"
                size="22"
              />
              <VTooltip
                activator="parent"
                location="top"
              >
                copy ลิงค์
              </VTooltip>
            </VBtn>
          </template>
        </VTextField>
        <VTextField
          v-model="passcode"
          variant="outlined"
          readonly
          label="Passcode "
          type="text"
          class="mt-4"
        >
        

          <template v-slot:append>
            <VBtn
              v-bind="props"
              icon
              color="primary"
              size="x-small"
              variant="text"
              @click="CopyPasscode"
            >
              <VIcon
                class="me-1"
                icon="ri-file-copy-line"
                size="22"
              />
              <VTooltip
                activator="parent"
                location="top"
              >
                copy Passcode
              </VTooltip>
            </VBtn>
          </template>
        </VTextField>
      </VCardText>
      <VDivider class="my-1" />
      <VCardText>
        <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
          <div
            class="ma-auto pa-5"
            ref="qrcode"
          >
            <vue-qr
              :text="linkSurvey"
              :size="size === '' ? '200' : size"
              :logoMargin="0"
            >
            </vue-qr>
          </div>
        </div>
        <VBtn
          variant="elevated"
          block
          @click="downloadQrCode"
        >
          <VIcon
            size="30"
            icon="mdi-download-circle-outline"
          />
          <span class="ms-2"> Download QRCode</span>
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="css">
.v-overlay--active .v-overlay__scrim {
  opacity: 0.5;
}
</style>
