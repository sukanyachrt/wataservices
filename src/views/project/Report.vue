<script setup>
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import services from '@/services'
import myDialog from '@/components/Dialog.vue'
import { useAccountStore } from '@/plugins/store';
import { useRouter, useRoute } from 'vue-router';

import '@/styles/flatpickr.scss'
import flatPickr from 'vue-flatpickr-component'




const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));

let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const router = useRouter()
const route = useRoute();
const Project_Id = ref(route.params.id)
const overlay = ref(false);
const myConfirmDelRef = ref(null)
const dataProject = ref([]);
const dataResponders = ref([])
onMounted(async () => {
    if (Project_Id.value) {
        await reportProject();
    }
});

const reportProject = async () => {
    try {
        overlay.value = true
        const response = await services.reportProject(Project_Id.value, auth);
        console.log(response)
        overlay.value = false
        if (response.data.status === "Successful") {
            dataProject.value = response.data.data.project;
            dataResponders.value = response.data.data.responders;

        }
    } catch (error) {
        overlay.value = false
        console.log(error)
        Swal.fire({
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}

const convertStatus = (item, statuses) => {
    let foundStatus = statuses.find(status => status.id === item);
    if (foundStatus) {
        return `<VChip style="background-color: ${foundStatus.color}; color: aliceblue;" variant="outlined" class="px-2 py-1 rounded">${foundStatus.name}</VChip>`;
    } else {
        return "";
    }
}

const convertrtetretre = (item) => {
    let foundResponders = dataResponders.value.find(responders => responders.id === item);
    if (foundResponders) {
        return ` <VAvatar  rounded="lg" size="60" class="me-6 my-2" image="${foundResponders.image}" />`;

    } else {
        return "";
    }
}


const deleteReport = async (item, id) => {
    if (myConfirmDelRef.value) {
        const result = await myConfirmDelRef.value.showDialog({
            text: 'ยืนยันการลบข้อมูลรายงาน ! ',
            icon_: 'ri-question-mark',
            color: 'warning',
            comfirmBtn: 'ยืนยัน',
            cancelBtn: 'ยกเลิก',
        })
        if (result) {
            try {
                const result = await services.reportDelete(id, auth)
                if (result.data.status === "Successful") {

                    const index = item.reports.findIndex(item => item.id === id);
                    if (index !== -1) {
                        item.reports.splice(index, 1);

                    }
                }
                else {
                    Swal.fire({
                        text: result.data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }

            } catch (error) {
                console.log(error)
            }
        }
    }
}
const AddReports = (columns, reports) => {
    const newReport = { id: null };
    columns.forEach(column => {
        const refName = column.ref_name;
        newReport[refName] = null;
    });
    reports.push(newReport);
    console.log(reports)
}

const deleteReportNotId = (report, index) => {
    console.log(report)
    console.log(index)
    report.splice(index, 1);
    console.log(report)
}
const datePickers = ref()
const chooseCalendar_startdate = (index) => {
    // Check if datePickers array is defined and has elements
    if (datePickers && datePickers.length > 0) {
        // Check if index is within bounds
        if (index >= 0 && index < datePickers.length) {
            const flatPickrInstance = datePickers[index];
            // Verify if flatPickrInstance is defined
            if (flatPickrInstance) {
                const positionElement = document.getElementById('starting_date' + index);
                // Verify if positionElement is defined
                if (positionElement) {
                    flatPickrInstance._positionElement = positionElement;
                    flatPickrInstance.open();
                } else {
                    console.error('Position element not found for index:', index);
                }
            } else {
                console.error('Flatpickr instance not found for index:', index);
            }
        } else {
            console.error('Index out of bounds:', index);
        }
    } else {
        console.error('datePickers array is undefined or empty');
    }
};

onMounted(async () => {

})
const date = ref(null)

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
    <div>
        <h1>{{ Project_Id === "" ? 'เพิ่ม Project' : 'รายงาน Project' }}</h1>

       
    </div>
    
    <VRow class="match-height align-center  justify-center mt-4">
        <VCol cols="12">
            <VCard class="my-8" v-for="(item, optionIndex) in dataProject.services" :key="optionIndex">
                <VCardTitle>
                    <VRow>
                       
                        <VCol cols="12" md="6">
                            <span> {{ item.name }}</span>

                        </VCol>
                        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
                            เครดิต : <VBtn class="ms-2" color="success" variant="outlined">
                                {{ item.success }} / {{ item.credit }}
                            </VBtn>
                        </VCol>
                    </VRow>

                </VCardTitle>
                <VCardText class="d-flex mt-2">
                    <VTable style="width: 100% !important;">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-center" v-for="(itemCol, indexCol) in item.columns"
                                    :key="indexCol">
                                    {{ itemCol.name }}
                                </th>
                                <th>
                                    Render Note
                                </th>
                                <th style="background-color: #fff !important; " class="text-end">
                                    <VBtn @click="AddReports(item.columns, item.reports)" rounded="lg" color="primary"
                                        size="small">
                                        <VIcon start icon="ri-add-circle-fill" />
                                        สร้าง
                                    </VBtn>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(itemReport, indexReport) in item.reports" :key="indexReport">
                                <td v-if="itemReport.id > 0" class="text-uppercase text-center"
                                    v-for="(itemC, indexC) in item.columns" :key="indexC">

                                    <template v-if="itemC.ref_name === 'status_id'">
                                        <div v-html="convertStatus(itemReport[itemC.ref_name], item.statuses)">

                                        </div>
                                    </template>

                                    <template v-else-if="itemC.ref_name === 'responder_id'">
                                        <div v-html="convertrtetretre(itemReport[itemC.ref_name])">
                                        </div>
                                    </template>

                                    <template v-else-if="itemC.ref_name === 'image'">
                                        <VAvatar v-if="itemReport[itemC.ref_name] !== ''" rounded="lg" size="60"
                                            class="me-6 my-2" :image="itemReport[itemC.ref_name]" />
                                    </template>

                                    <template v-else>

                                        {{ itemReport[itemC.ref_name] }}
                                    </template>
                                </td>
                                <td v-if="itemReport.id > 0">
                                    -
                                </td>
                                <td v-if="itemReport.id > 0" class="text-end">

                                    <VBtn icon color="warning" size="x-small" variant="text">
                                        <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            แก้ไข Report
                                        </VTooltip>
                                    </VBtn>
                                    <VBtn @click="deleteReport(item, itemReport.id)" icon size="x-small" color="error"
                                        variant="text">
                                        <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            ลบ Report
                                        </VTooltip>
                                    </VBtn>
                                </td>

                                <!-- No id -->
                                <td v-if="itemReport.id === null" class="text-uppercase text-center "
                                    v-for="(itemC, indexC) in item.columns" :key="indexC">
                                    <template v-if="itemC.ref_name === 'status_id'">
                                        <VAutocomplete v-model="itemReport[itemC.ref_name]" autocomplete="no"
                                            :items="item.statuses" item-title="name" item-value="id" density="compact"
                                            clearable :placeholder="itemC.name" :label="itemC.name" />
                                    </template>

                                    <template v-else-if="itemC.ref_name === 'responder_id'">
                                        <div v-html="convertrtetretre(itemReport[itemC.ref_name])">
                                        </div>
                                    </template>

                                    <template v-else-if="itemC.ref_name === 'image'">
                                        <VAvatar v-if="itemReport[itemC.ref_name] !== ''" rounded="lg" size="60"
                                            class="me-6 my-2" :image="itemReport[itemC.ref_name]" />
                                    </template>

                                    <template v-else-if="itemC.ref_name === 'posting_date'">

                                    </template>

                                    <template v-else>
                                        <VTextField v-model="itemReport[itemC.ref_name]" :placeholder="itemC.name"
                                            variant="outlined" autocomplete="no" density="compact">
                                        </VTextField>

                                    </template>
                                </td>
                                <td v-if="itemReport.id === null">
                                    -
                                </td>
                                <td v-if="itemReport.id === null" class="text-end">

                                    <VBtn icon color="warning" size="x-small" variant="text">
                                        <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            แก้ไข Report
                                        </VTooltip>
                                    </VBtn>
                                    <VBtn @click="deleteReportNotId(item.reports, indexReport)" icon size="x-small"
                                        color="error" variant="text">
                                        <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            ลบ Report
                                        </VTooltip>
                                    </VBtn>
                                </td>
                            </tr>
                        </tbody>
                    </VTable>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
    <myDialog ref="myConfirmDelRef" />

</template>