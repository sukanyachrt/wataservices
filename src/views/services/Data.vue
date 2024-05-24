<script setup>
import Swal from 'sweetalert2'
import myDialog from '@/components/Dialog.vue'
import ServicesCreate from '@/views/services/Create.vue'
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
const dataservices = ref([]);
const linksPage = ref([])
const metaPage = ref([])
const serachSurvey = ref('')
const myConfirmDelRef = ref(null)
const myCreateRef = ref(null)

const page = ref(1)
onMounted(async () => {
    await getdataServices(1)
})
const getdataServices = async (page) => {
    try {
        overlay.value = true
        const response = await services.services(page, auth)
        if (response.status === 200) {
            overlay.value = false
            dataservices.value = response.data.data
            linksPage.value = response.data.links
            metaPage.value = response.data.meta
        }
        else {
            overlay.value = false
        }
    } catch (error) {
        console.log(error)
    }
}


const deleteServices = async item => { //ลบ
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

                const result = await services.deleteServices(item.id, auth)
                if (result.data.status === "Successful") {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: result.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    await getdataServices(page.value)
                }
                else {
                    Swal.fire({
                        text: result.data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
                await getdataServices(page.value)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
const PaginationsPlatform = async () => {
    await getdataServices(page.value)
}

const addServices = async (item) => {
    if (myCreateRef.value) {
        const clear = await myCreateRef.value.clearform();
        const result = await myCreateRef.value.showForms(item);
        if (result.status === true && result.type === 'edit') {
            item.name = result.data.name
            item.detail = result.data.detail
            item.logo = result.data.logo
        }
        else if (result.status === true && result.type === 'add') {
            await dataServices(page.value)
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
            <h1>Services</h1>
        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
            <VBtn @click="addServices()">
                <VIcon class="me-1" icon="ri-add-line" size="22" />
                เพิ่ม Services
            </VBtn>
        </VCol>
    </VRow>
    <VCard class="mt-6">
        <VTable>
            <thead>
                <tr>
                    <th class="text-uppercase">
                        ชื่อของบริการ
                    </th>
                    <th class="text-uppercase text-left">
                        รายละเอียดของบริการ
                    </th>
                    <th class="text-uppercase text-center">
                        โลโก้
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
                <tr v-for="item in dataservices" :key="item.id">
                    <td>
                        {{ item.name }}
                    </td>
                    <td class="text-left">
                        {{ item.detail }}
                    </td>
                    <td class="text-center">
                        <VAvatar v-if="item.logo !== ''" rounded="lg" size="60" class="me-6 mt-2" :image="item.logo" />
                        <template v-else>
                            -
                        </template>
                    </td>

                    <td class="text-center">
                        {{ formatDate(item.created_at) }}

                    </td>
                    <td class="text-center">
                        <VBtn @click="addServices(item)" icon color="warning" size="x-small" variant="text">
                            <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                แก้ไข Services
                            </VTooltip>
                        </VBtn>
                        <VBtn @click="deleteServices(item)" icon size="x-small" color="error" variant="text">
                            <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                ลบ Services
                            </VTooltip>
                        </VBtn>

                    </td>

                </tr>
            </tbody>
        </VTable>

        <VRow>
            <VCol md="6" class="d-flex align-center justify-center justify-md-end">
                Showing {{ metaPage.from }} to {{ metaPage.to }} of {{ metaPage.total }} entries
            </VCol>
            <VCol cols="12" md="6" class="d-flex align-center justify-end justify-md-end">
                <v-container class="max-width">
                    <v-pagination v-model="page" @click="PaginationsPlatform()" :length="metaPage.last_page"
                        :total-visible="3" next-icon="ri-arrow-right-s-fill"
                        prev-icon="ri-arrow-left-s-fill"></v-pagination>
                </v-container>
            </VCol>
        </VRow>
    </VCard>
    <myDialog ref="myConfirmDelRef" />
    <ServicesCreate ref="myCreateRef" />

</template>