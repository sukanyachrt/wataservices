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
    <VCard class="mt-6 border-t-xl border-primary border-opacity-100 border-4" title="เพิ่ม Platforms">
        <VCardText>
            <VForm ref="formCreateRef">
                <VRow class="justify-center align-center">
                    <VCol cols="12">
                        <VTextField v-model="formCreate.name" required label="ชื่อของแพลตฟอร์ม"
                            :rules="[v => !!v || 'โปรดกรอกชื่อของแพลตฟอร์ม']" />
                    </VCol>
                    <VCol cols="12">
                        <VTextarea v-model="formCreate.description" label="คำอธิบายแพลตฟอร์มเพิ่มเติม" rows="2">
                        </VTextarea>
                    </VCol>
                    <VCol cols="12" class="mt-6 text-center">
                        <VBtn variant="tonal" @click="addPlatforms()" class="mx-4">
                            <VIcon size="24" icon="ri-add-line" />
                            บันทึกข้อมูล
                        </VBtn>
                        <VBtn variant="tonal" color="secondary" @click="reset()" class="mx-4">
                            <VIcon size="24" icon="ri-restart-line" />
                            ยกเลิก
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>


    </VCard>
    <VRow>
        <VCol cols="12" class="mt-6 text-center">
            <router-link to="/platforms" class="mx-4">
                <VBtn variant="tonal" color="secondary">
                    <VIcon size="24" icon="ri-arrow-left-line" />
                    กลุับ
                </VBtn>
            </router-link>
        </VCol>
    </VRow>
</template>
<script setup>
import Cookies from 'js-cookie'
import services from '@/services'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const Id = ref(route.params.id)
import { useAccountStore } from '@/plugins/store';
const store = useAccountStore()
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const overlay = ref(false)
const formCreateRef = ref(null);
const form = {
    name: '',
    description: ''
}
const formCreate = ref(structuredClone(form));
onMounted(async () => {
    if (Id.value > 0) {
        await platformsbyId()
    }
})
const addPlatforms = async () => {
    const { valid } = await formCreateRef.value.validate()
    if (valid) {
        overlay.value = true

        let databody = {
            "name": formCreate.value.name,
            "description": formCreate.value.description
        }
       
        try {
            let response;
            if(Id.value){
                 response = await services.UpdatePlatforms(Id.value,databody, auth);
            }
            else{
                 response = await services.AddPlatforms(databody, auth);
            }
            console.log(response)
           
            if (response.data.status === "Successful") {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                router.push(`/platforms`)
            }
            else {
                overlay.value = false
                Swal.fire({
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            overlay.value = false
            console.log(error)
        }

    }
}
const platformsbyId = async () => {
    try {
        overlay.value = true
        const response = await services.platformsbyId(Id.value, auth);
        if (response.data.status === "Successful") {
            overlay.value = false
            formCreate.value.name = response.data.data.name
            formCreate.value.description = response.data.data.description
        }
        else {
            verlay.value = false
            Swal.fire({
                text: response.data.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    } catch (error) {
        console.log(error)
    }
}
const reset = async () => {
    formCreate.value = await structuredClone(form);
    // รีเซ็ตฟอร์ม
    if (formCreateRef.value) {
        await formCreateRef.value.resetValidation();
    }
}
</script>