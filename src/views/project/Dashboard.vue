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
const myConfirmDelRef = ref(null)
const dataDashboard = ref([])
const page = ref(1)
onMounted(async () => {
    await getdataProjectDashboard()
   
})


const getdataProjectDashboard = async () => {

    try {
        overlay.value = true
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
                <VBtn >
                    <VIcon class="me-1" icon="ri-dashboard-fill" size="22" />
                    <VTooltip activator="parent" location="top">
                        แสดงข้อมูลแบบ Dashboard
                    </VTooltip>
                </VBtn>
                <VBtn to="/project-table">
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
