<script setup>
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import services from '@/services'
import myDialog from '@/components/Dialog.vue'
import { formatDate_notime } from '@/plugins/function.js'
import { useAccountStore } from '@/plugins/store';
import { useRouter, useRoute } from 'vue-router';

const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));

let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken,
        'Accept': 'application/json'
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
    // ตรวจสอบว่ามีรายงานใดๆ ที่มี id เป็น null หรือไม่
    const hasNullId = reports.some(item => item.id === null);

    // ถ้าพบ id เป็น null ให้แสดงแจ้งเตือนและหยุดทำงาน
    if (hasNullId) {
        Swal.fire({
            text: "โปรดบันทึกข้อมูลที่คุณสร้างมาก่อนหน้านี้ค่ะ",
            icon: 'error',
            confirmButtonText: 'OK'
        })
        return;
    }

    // สร้างรายงานใหม่เฉพาะเมื่อไม่พบ id เป็น null
    const newReport = { id: null };
    columns.forEach(column => {
        const refName = column.ref_name;
        newReport[refName] = null;
    });
    reports.push(newReport);
}


const deleteReportNotId = (report, index) => {
    console.log(report)
    console.log(index)
    report.splice(index, 1);
    console.log(report)
}

onMounted(async () => {

})
const popupDate = ref([]);

const showDatePicker = (index) => {
    popupDate.value[index] = true
};
const formattedDate = ((item) => {
    if (item) {
        const date = new Date(item);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // ใช้ padStart เพื่อเติม 0 หน้าตัวเลขที่มีความยาวน้อยกว่า 2 ตัว
        const day = date.getDate().toString().padStart(2, '0'); // ใช้ padStart เพื่อเติม 0 หน้าตัวเลขที่มีความยาวน้อยกว่า 2 ตัว

        return `${day}/${month}/${year}`;
    }
    return null;
});
const formattedDateTosave = ((item) => {
    if (item) {
        const date = new Date(item);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // ใช้ padStart เพื่อเติม 0 หน้าตัวเลขที่มีความยาวน้อยกว่า 2 ตัว
        const day = date.getDate().toString().padStart(2, '0'); // ใช้ padStart เพื่อเติม 0 หน้าตัวเลขที่มีความยาวน้อยกว่า 2 ตัว

        return `${year}-${month}-${day}`;
    }
    return null;
});
const saveReport = async (services_id,item, index) => {
    console.log(services_id,item, index)
    const newItem ={...item}
    if (newItem.posting_date) {
        newItem.posting_date = formattedDateTosave(newItem.posting_date)
    }
    try {
      const response = await services.reportSave(services_id,newItem,auth);
      if (response.data.status === "Successful") {
       await reportProject()
      }

    } catch (error) {
        console.log(error)
    }
    console.log(newItem)
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
                                    <template v-else-if="itemC.ref_name === 'posting_date'">
                                        {{ formatDate_notime(itemReport[itemC.ref_name]) }}
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'url'">
                                        <a :href="itemReport[itemC.ref_name]">ลิงค์</a>
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
                                        <v-text-field color="primary" :value="formattedDate(itemReport[itemC.ref_name])"
                                            @focus="showDatePicker(indexReport)" clearable
                                            v-model="itemReport[itemC.ref_name]" placeholder="dd/mm/yyyy" Readonly
                                            autocomplete="no" density="compact">
                                            <template #prepend-inner>

                                                <v-menu activator="parent" v-model="popupDate[indexReport]"
                                                    :close-on-content-click="false">
                                                    <v-date-picker color="primary" hideHeader hideWeekdays
                                                        v-model="itemReport[itemC.ref_name]">
                                                    </v-date-picker>
                                                </v-menu>

                                            </template>
                                        </v-text-field>
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

                                    <VBtn @click="saveReport(item.id,itemReport, indexReport)" icon color="info" size="x-small"
                                        variant="text">
                                        <VIcon class="me-1" icon="ri-save-line" size="26" />
                                        <VTooltip activator="parent" location="top">
                                            บันทึก Report
                                        </VTooltip>
                                    </VBtn>
                                    <VBtn @click="deleteReportNotId(item.reports, indexReport)" icon size="x-small"
                                        color="error" variant="text">
                                        <VIcon class="me-1" icon="ri-close-fill" size="26" />
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