<script setup>
import Swal from 'sweetalert2'
import myDialog from '@/components/Dialog.vue'
import Cookies from 'js-cookie'
import services from '@/services'
import { useRouter } from 'vue-router'
import trophy from '@images/misc/trophy.png'
import { useAccountStore } from '@/plugins/store';
import { formatDate_notime } from '@/plugins/function.js'
const store = useAccountStore();
import Share from '@/views/project/Share.vue'
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const toggleExclusive = ref(0)
const overlay = ref(false)
const dataprojects = ref([]);
const linksPage = ref([])
const metaPage = ref([])
const myConfirmDelRef = ref(null)
const dataDashboard = ref([])
const page = ref(1)
onMounted(async () => {
    await getdataProjectDashboard()
   
})
const getdataProjects = async (page) => {
    try {
        dataDashboard.value = []
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
        if (error) {
            Swal.fire({
                title: error.name,
                text: error.message,
                allowOutsideClick: false, // ไม่ให้ปิดโดยการคลิกภายนอก modal
                allowEscapeKey: false, // ไม่ให้ปิดโดยการกดปุ่ม Esc
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/logout')
                }
            });


        }
    }
}

const getdataProjectDashboard = async () => {

    try {
        overlay.value = true
        dataprojects.value = []
        const response = await services.projectDashboard(auth);
        console.log(response)
        if (response.data.status === "Successful") {
            overlay.value = false
            dataDashboard.value = response.data.data
        }
    } catch (error) {
        console.log(error)
        overlay.value = false
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


const mySendSurveyRef = ref(null)
const shareLink = async item => {
    if (mySendSurveyRef.value) {
        overlay.value = true
        try {
            const response = await services.projectGenlink(item.id, auth);
            if (response.data.status === "Successful") {
                overlay.value = false
                const result = await mySendSurveyRef.value.showDialog({
                    data: response.data.data,
                })
            }
        } catch (error) {
            console.log(error)
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
            <h1>Project</h1>
        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
            <VBtnToggle v-model="toggleExclusive" density="compact" color="primary">
                <VBtn @click="getdataProjectDashboard()">
                    <VIcon class="me-1" icon="ri-dashboard-fill" size="22" />
                    <VTooltip activator="parent" location="top">
                        แสดงข้อมูลแบบ Dashboard
                    </VTooltip>
                </VBtn>
                <VBtn @click="getdataProjects(page)">
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
    <VCard class="mt-6" v-if="dataprojects.length > 0">
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
    <VRow v-if="dataDashboard.length > 0">
        <VCol cols="12" md="6" v-for="item in dataDashboard" :key="item.id">
            <VCard class="position-relative">
                <VCardItem>
                    <VCardTitle> {{ item.name }}</VCardTitle>

                    <template #append>
                        <VBtn @click="shareLink(item)" color="primary" variant="outlined" icon="ri-stackshare-line" />

                    </template>
                </VCardItem>
                <VCardText>

                    <div class="demo-space-x">
                        <VProgressCircular :rotate="360" :size="80" :width="6" :model-value="item.percent"
                            color="primary">
                            <h5 class="text-h5 text-primary">
                                {{ item.percent }} %
                            </h5>

                        </VProgressCircular>


                    </div>


                    <!--                     
                    <VBtn size="small" class="mt-5">
                        Share
                    </VBtn> -->
                </VCardText>

                <!-- Trophy -->
                <VImg :src="item.logo" class="trophy" />
            </VCard>
        </VCol>
    </VRow>

    <myDialog ref="myConfirmDelRef" />
    <Share ref="mySendSurveyRef" />

</template>
<style lang="scss">
.v-card .trophy {
    position: absolute;
    inline-size: 5.188rem;
    inset-block-end: 1.25rem;
    inset-inline-end: 1.25rem;
}
</style>
