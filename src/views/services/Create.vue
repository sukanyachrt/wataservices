<script setup>
const overlay = ref(false);
const dialogVisible = ref(false);
const resolvePromise = ref()
const rejectPromise = ref()
const formCreateRef = ref(null);
const form = {
    name: '',
    description: ''
}
const Id = ref('')
const formCreate = ref(structuredClone(form));
const showForms = async data => {
    dialogVisible.value = true


    if (data) {
        Id.value = data.id
        formCreate.value = { ...data }
    }

    return new Promise((resolve, reject) => {
        resolvePromise.value = (data, type) => {
            resolve({ 'status': true, 'data': data, 'type': type })
            dialogVisible.value = false
        }

        rejectPromise.value = () => {
            resolve({ 'status': false })
            dialogVisible.value = false
        }
    })
}
const clearform = async () => {
    Id.value = ''
    formCreate.value = structuredClone(form);
    // รีเซ็ตฟอร์ม
    if (formCreateRef.value) {
        await formCreateRef.value.resetValidation();
    }
}
defineExpose({ showForms, clearform })

</script>
<template>
    <div class="text-center">
        <v-overlay v-model="overlay" persistent class="align-center justify-center">
            <v-progress-circular :size="90" :width="6" color="primary" indeterminate>
                <template v-slot:default>
                    <span class="text-white"> Loading </span>
                </template>
            </v-progress-circular>
        </v-overlay>
    </div>
    <VDialog transition="dialog-top-transition" width="500" v-model="dialogVisible">
        <VCard class="mt-6 border-t-xl border-primary border-opacity-100 border-4" :title="Id=='' ? 'เพิ่ม Services': 'แก้ไข Services'">
              <VCardText>
                <div>Create Survices</div>
            </VCardText>
        </VCard>
    </VDialog>

</template>
