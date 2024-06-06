<script setup>
import Swal from 'sweetalert2'
import myDialog from '@/components/Dialog.vue'
import Cookies from 'js-cookie'
import services from '@/services'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/plugins/store';
import { formatDate_notime } from '@/plugins/function.js'
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const toggleExclusive = ref(1)
const overlay = ref(false)
const dataprojects = ref([]);
const linksPage = ref([])
const metaPage = ref([])
const myConfirmDelRef = ref(null)
const page = ref(1)
onMounted(async () => {
    await getdataProjects()
   
})
const getdataProjects = async (page) => {
    try {
        overlay.value = true
        const response = await services.projects(page, auth);
        if (response.status === 200) {
            overlay.value = false
            dataprojects.value = response.data.data
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


const deleteProject = async item => { //ลบ
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

                const result = await services.projectDelete(item.id, auth)
                if (result.data.status === "Successful") {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: result.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    await getdataProjects(page.value)
                }
                else {
                    Swal.fire({
                        text: result.data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
                await getdataProjects(page.value)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
const PaginationsProject = async () => {
    if (page.value !== metaPage.value.current_page) {
        await getdataProjects(page.value)
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
            <h1>Project</h1>
        </VCol>
      
        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
            <VBtnToggle v-model="toggleExclusive" density="compact" color="primary">
                <VBtn to="/project-dashboard">
                    <VIcon class="me-1" icon="ri-dashboard-fill" size="22" />
                    <VTooltip activator="parent" location="top">
                        แสดงข้อมูลแบบ Dashboard
                    </VTooltip>
                </VBtn>
                <VBtn>
                    <VIcon class="me-1" icon="ri-table-2" size="22" />
                    <VTooltip  location="top">
                        แสดงข้อมูลแบบตาราง
                    </VTooltip>
                </VBtn>
            </VBtnToggle>


        </VCol>
        <VCol cols="12" class="d-flex align-center justify-start justify-md-end">
            <VBtn to="/project-create">
                <VIcon class="me-1" icon="ri-add-line" size="22" />
                เพิ่ม Project
            </VBtn>
        </VCol>
    </VRow>
    <VCard class="mt-6">
        <VTable>
            <thead>
                <tr>
                    <th class="text-uppercase text-center">
                        โลโก้
                    </th>
                    <th class="text-uppercase text-center">
                        ชื่อ
                    </th>
                    <th class="text-uppercase">
                        รายละเอียด
                    </th>
                    <th class="text-uppercase text-left">
                        วันที่เริ่ม-สิ้นสุดโครงการ
                    </th>
                    <th class="text-uppercase text-center">
                        ชื่อของลูกค้า
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
                <tr v-for="item in dataprojects" :key="item.id">
                    <td class="text-center">
                        <VAvatar v-if="item.logo !== ''" rounded="lg" size="60" class="me-6 my-2" :image="item.logo" />
                        <template v-else>
                            -
                        </template>
                    </td>
                    <td class="text-left">
                        {{ item.name }}
                    </td>
                    <td class="text-left">
                        {{ item.detail }}
                    </td>
                    <td class="text-left">
                        <span>เริ่มต้น : {{ formatDate_notime(item.starting_date) }}</span><br />
                        <span>สิ้นสุด : {{ formatDate_notime(item.finishing_date) }}</span>

                    </td>
                    <td class="text-left">
                        {{ item.customer.name }}
                    </td>
                    <td class="text-center">
                        {{ formatDate_notime(item.created_at) }}

                    </td>
                    <td class="text-center">
                        <VBtn :to="`/project-report/${item.id}`" icon color="info" size="x-small" variant="text">
                            <VIcon class="me-1" icon="ri-article-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                รายงาน Project
                            </VTooltip>
                        </VBtn>
                        <VBtn :to="`/project-create/${item.id}`" icon color="warning" size="x-small" variant="text">
                            <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                แก้ไข Project
                            </VTooltip>
                        </VBtn>
                        <VBtn @click="deleteProject(item)" icon size="x-small" color="error" variant="text">
                            <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                            <VTooltip activator="parent" location="top">
                                ลบ Project
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
                    <v-pagination v-model="page" @click="PaginationsProject()" :length="metaPage.last_page"
                        :total-visible="3" next-icon="ri-arrow-right-s-fill"
                        prev-icon="ri-arrow-left-s-fill"></v-pagination>
                </v-container>
            </VCol>
        </VRow>
    </VCard>
    

    <myDialog ref="myConfirmDelRef" />
  
</template>
