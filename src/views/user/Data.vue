<script setup>
import Swal from 'sweetalert2'
import myDialog from '@/components/Dialog.vue'
import Cookies from 'js-cookie'
import services from '@/services'
import { useAccountStore } from '@/plugins/store';
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const overlay = ref(false)
const dataUsers = ref([]);
const linksPage = ref([])
const metaPage = ref([])
const myConfirmDelRef = ref(null)

const page = ref(1)
onMounted(async () => {
    await getdataUsers(1)
})
const getdataUsers = async (page) => {
    try {
        overlay.value = true
        const response = await services.users(page, auth);
        if (response.status === 200) {
            overlay.value = false
            dataUsers.value = response.data.data
            linksPage.value = response.data.links
            metaPage.value = response.data.meta
        }
        else {
            overlay.value = false
        }
    } catch (error) {
        overlay.value = false
        overlay.value = false
        console.log(error)
        if (error.response.status === 401) {
            router.push('/logout')
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 2000
            });

        }
        else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 2000
            });
        }
    }
}


const deleteUsers = async item => { //ลบ
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

                const result = await services.userDelete(item.id, auth)
                if (result.data.status === "Successful") {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: result.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    await getdataUsers(page.value)
                }
                else {
                    Swal.fire({
                        text: result.data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
                await getdataUsers(page.value)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
const Paginations = async () => {
    if (page.value !== metaPage.value.current_page) {
        await getdataUsers(page.value)
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
            <h1>User</h1>
        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
            <VBtn to="/users-create">
                <VIcon class="me-1" icon="ri-add-line" size="22" />
                เพิ่ม User
            </VBtn>
        </VCol>
    </VRow>
    <VCard class="mt-6">
        <VTable>
            <thead>
                <tr>
                    <th class="text-uppercase text-center">
                        รูปภาพ
                    </th>
                    <th class="text-uppercase text-center">
                        ชื่อของ user
                    </th>
                    
                    <th class="text-uppercase">
                        บันทึกของ user
                    </th>
                    <th class="text-uppercase">
                        สิทธิของ user
                    </th>
                    <th class="text-uppercase text-center">
                        #
                    </th>

                </tr>
            </thead>

            <tbody>
                <tr v-for="item in dataUsers" :key="item.id">
                    <td class="text-center">
                        <VAvatar v-if="item.image !== ''" rounded="lg" size="60" class="me-6 my-2" :image="item.image" />
                        
                    </td>
                    <td class="text-left">
                        {{ item.name }}
                    </td>
                    <td class="text-left">
                        {{ item.note }}
                    </td>
                    <td class="text-left">
                        {{ item.role }}
                    </td>
                    
                    <td class="text-center">
                        <VBtn :to="`/users-create/${item.id}`" icon color="warning" size="x-small" variant="text">
                            <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                แก้ไข User
                            </VTooltip>
                        </VBtn>
                        <VBtn @click="deleteUsers(item)" icon size="x-small" color="error" variant="text">
                            <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                ลบ User
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
                    <v-pagination v-model="page" @click="Paginations()" :length="metaPage.last_page"
                        :total-visible="3" next-icon="ri-arrow-right-s-fill"
                        prev-icon="ri-arrow-left-s-fill"></v-pagination>
                </v-container>
            </VCol>
        </VRow>
    </VCard>
    <myDialog ref="myConfirmDelRef" />
    

</template>