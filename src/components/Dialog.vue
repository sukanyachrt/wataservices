<script setup>
const dialogVisible = ref(false)
const resolvePromise = ref()
const rejectPromise = ref()
const datadialog = ref([])
const showDialog = async data => {
  dialogVisible.value = true
  datadialog.value = data

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
</script>

<template>
  <VDialog
    transition="dialog-top-transition"
    width="300"
    v-model="dialogVisible"
  >
    <VCard>
      <VCardItem class="justify-center">
        <VAvatar
          :color="datadialog.color"
          rounded-full
          size="42"
          class="elevation-1"
        >
          <VIcon
            size="30"
            :icon="datadialog.icon_"
          />
        </VAvatar>
      </VCardItem>
      <VDivider class="mb-6" />
      <VCardText>
        <div class="text-h6 pb-2">{{ datadialog.text }}</div>
        <div
          class="demo-space-y mb-2"
          v-for="(item, index) in datadialog.data"
          :key="index"
        >
          <VAlert
            color="warning"
            border="start"
            variant="outlined"
            class="pt-2"
          >
            {{ item }}
          </VAlert>
        </div>
      </VCardText>

      <VCol
        cols="12"
        class="d-flex flex-wrap gap-4 justify-center"
      >
        <VBtn
          color="primary"
          @click="ShowConfirm()"
          >{{ datadialog.comfirmBtn }}</VBtn
        >
        <VBtn
          color="white border"
          @click="_cancel()"
        >
          {{ datadialog.cancelBtn }}
        </VBtn>
      </VCol>
    </VCard>
  </VDialog>
</template>

<style lang="css">
.v-overlay--active .v-overlay__scrim {
  opacity: 0.5;
}
</style>
