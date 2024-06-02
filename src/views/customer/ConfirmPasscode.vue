<template>
   
    <VDialog transition="dialog-top-transition" width="500" v-model="dialogVisible">
        <VCard class="mt-6 border-t-xl border-primary border-opacity-100 border-4" title="ยืนยัน Passcode เพื่อเข้าดูรายงาน">
            <VCardText>
                <VForm ref="formCreateRef">
                   <VRow class="justify-center align-center">
                        <VCol cols="12">
                            <VTextField v-model="formCreate.encrypted_url" required label="encrypted_url"
                                :rules="[v => !!v || 'encrypted_url']" Readonly />
                        </VCol>
                        <VCol cols="12">
                            <VTextField v-model="formCreate.passcode" required label="passcode"
                                :rules="[v => !!v || 'passcode']"  />
                        </VCol>
                        <VCol cols="12" class="mt-6 text-center">
                            <VBtn variant="tonal" @click="confirmPasscode()" class="mx-4">
                                <VIcon size="24" icon="ri-check-double-fill" />
                                ยืนยัน Passcode
                            </VBtn>
                            
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>


        </VCard>
    </VDialog>

</template>
<script setup>

const formCreateRef = ref(null);
const form = {
    encrypted_url: '',
    passcode: ''
}
const formCreate = ref(structuredClone(form));
const dialogVisible = ref(false);
const resolvePromise = ref()
const rejectPromise = ref()
const showForms = async data => {
  dialogVisible.value = true
  console.log(data)

if(data){
    formCreate.value.encrypted_url = data
}

  return new Promise((resolve, reject) => {
    resolvePromise.value = (data,type) => {
      resolve({'status' : true , 'data' : data})
      dialogVisible.value = false
    }

    rejectPromise.value = () => {
      resolve({'status' : false})
      dialogVisible.value = false
    }
  })
}
const confirmPasscode = async () => {
    const { valid } = await formCreateRef.value.validate()
    if (valid) {
        resolvePromise.value(formCreate.value)

    }
}




defineExpose({ showForms })

</script>