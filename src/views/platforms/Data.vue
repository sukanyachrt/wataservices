<script setup>
import Swal from 'sweetalert2'
import myDialog from '@/components/Dialog.vue'
import Cookies from 'js-cookie'
import services from '@/services'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/plugins/store';
import { formatDate } from '@/plugins/function.js'
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const overlay = ref(false)
const router = useRouter()
const platforms = ref([]);
const linksPage = ref([])
const metaPage = ref([])
const serachSurvey = ref('')
const myConfirmDelRef = ref(null)
onMounted(async () => {
    await dataPlatforms()
})
const dataPlatforms = async () => {
    try {
        overlay.value=true
        const response = await services.platforms(auth)
        console.log(response)
        if (response.status === 200) {
            overlay.value=false
            platforms.value = response.data.data
            linksPage.value = response.data.links
            metaPage.value = response.data.meta
        }
        else{
            overlay.value=false
        }
    } catch (error) {
        console.log(error)
    }
}


const deletePlatforms = async item => { //ลบ
    if (myConfirmDelRef.value) {
        const result = await myConfirmDelRef.value.showDialog({
            text: 'ยืนยันการลบข้อมูล !',
            icon_: 'ri-question-mark',
            color: 'warning',
            comfirmBtn: 'ยืนยัน',
            cancelBtn: 'ยกเลิก',
        })
        if (result) {
            try {

                const result = await services.DeletePlatforms(item.id, auth)
                if (result.data.status === "Successful") {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: result.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                 await   dataPlatforms()
                }
                else {
                    Swal.fire({
                        text: result.data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
                await dataPlatforms()
            } catch (error) {
                console.log(error)
            }
        }
    }
}
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
    <VRow>
        <VCol cols="12" md="6">
            <h1>Platforms</h1>
        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
            <VBtn to="/platforms-create">
                <VIcon class="me-1" icon="ri-add-line" size="22" />
                เพิ่ม Platforms
            </VBtn>
        </VCol>
    </VRow>
    <VCard class="mt-6">
        <VTable>
            <thead>
                <tr>
                    <th class="text-uppercase">
                        ชื่อของแพลตฟอร์ม
                    </th>
                    <th class="text-uppercase text-left">
                        รายละเอียดของแพลตฟอร์ม
                    </th>
                    <th class="text-uppercase text-center">
                        วันที่สร้าง
                    </th>
                    <th class="text-uppercase text-center">
                        #
                    </th>

                </tr>
            </thead>

            <tbody>
                <tr v-for="item in platforms" :key="item.id">
                    <td>
                        {{ item.name }}
                    </td>
                    <td class="text-left">
                        {{ item.description }}
                    </td>

                    <td class="text-center">
                        {{ formatDate(item.created_at) }}

                    </td>
                    <td class="text-center">
                        <VBtn link :to="`platforms-create/${item.id}`" icon color="default" size="x-small"
                            variant="text">
                            <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                แก้ไข Platforms
                            </VTooltip>
                        </VBtn>
                        <VBtn @click="deletePlatforms(item)" icon color="default" size="x-small" variant="text">
                            <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                ลบ Platforms
                            </VTooltip>
                        </VBtn>

                    </td>

                </tr>
            </tbody>
        </VTable>
        <VCardText>
            <VRow>
                <VCol md="6" class="text-end">
                    {{ metaPage }}
                </VCol>
                <VCol md="6" class="text-center">
                    {{ linksPage }}
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
    <myDialog ref="myConfirmDelRef" />
</template>