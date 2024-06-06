<script setup>
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import services from '@/services'
import myDialog from '@/components/Dialog.vue'
import { formatDate_notime, compareDates } from '@/plugins/function.js'
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
const editingReportIndex = ref(null);  // Added for tracking the edit state

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
        if (foundResponders.image) {
            return [foundResponders.image, "image"];
        } else {
            return [foundResponders.name, "name"];
        }
    } else {
        return "";
    }
};

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
    editingReportIndex.value = null
    const hasNullId = reports.some(item => item.id === null);

    if (hasNullId) {
        Swal.fire({
            text: "โปรดบันทึกข้อมูลที่คุณสร้างมาก่อนหน้านี้ค่ะ",
            icon: 'error',
            confirmButtonText: 'OK'
        })
        return;
    }

    const newReport = { id: null };
    columns.forEach(column => {
        const refName = column.ref_name;
        newReport[refName] = null;
    });
    reports.push(newReport);
}

const deleteReportNotId = (report, index) => {
    report.splice(index, 1);
}

const popupDate = ref([]);
const popupDateDraf = ref([]);
const showDatePickerDraf = (index, item, type) => {
    if (item) {
        if (type === 'draft_date') {
            item.draft_date = null
        }


    }

    popupDateDraf.value[index] = true
}

const showDatePicker = (index, item, type) => {
    if (item) {
        if (type === 'draft_date') {
            item.draft_date = null
        }
        else if (type === 'posting_date') {
            item.posting_date = null
        }

    }

    popupDate.value[index] = true





};

const formattedDate = ((item) => {
    if (item) {

        const date = new Date(item);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    return null;
});

const formattedDateTosave = ((item) => {
    if (item) {
        const date = new Date(item);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return null;
});

const saveReport = async (services_id, item, index) => {
    const newItem = { ...item }
    if (newItem.posting_date) {
        newItem.posting_date = formattedDateTosave(newItem.posting_date)
    }



    if (newItem.draft_date) {
        newItem.draft_date = formattedDateTosave(newItem.draft_date)
    }
    if (newItem.image) {

        if (newItem.image.startsWith('http://') || newItem.image.startsWith('https://')) {
            delete newItem.image;
        }

    }
    try {
        if (newItem.id) {
            const response = await services.reportUpdate(newItem.id, newItem, auth);
            if (response.data.status === "Successful") {
                await reportProject();
                editingReportIndex.value = null;  // Reset edit state after saving
            }
        }
        else {
            const response = await services.reportSave(services_id, newItem, auth);
            if (response.data.status === "Successful") {
                await reportProject();

            }
        }

    } catch (error) {
        Swal.fire({
            text: `${error.response.data.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}

const editReport = async (index) => {
    if (editingReportIndex.value) {
        await reportProject();
    }

    editingReportIndex.value = index;
}

const openupload = (item, index) => {
    console.log(item)
    currentIndex = index
    currentItem = item
    refInputEl.value.click()
}
const refInputEl = ref()
let currentIndex
let currentItem
const AddUploadImage = file => {


    const fileReader = new FileReader();
    const { files } = file.target;
    if (files && files.length) {
        const selectedFile = files[0];
        if (selectedFile.size > 2 * 1024 * 1024) { // 2MB in bytes
            Swal.fire({
                text: "ภาพถ่ายต้องมีขนาด ไม่เกิน 2MB",
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }

        const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedFormats.includes(selectedFile.type)) {
            Swal.fire({
                text: "ภาพถ่ายรองรับ jpg, jpeg, png เท่านั้น",
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }

        overlay.value = true;
        fileReader.readAsDataURL(selectedFile);
        fileReader.onload = () => {
            overlay.value = false;
            if (typeof fileReader.result === 'string') {
                currentItem.image = fileReader.result;
            }
        };
    }
}
const removeImage = item => {
    const fileInput = refInputEl.value
    fileInput.value = '';
    item.image = ''
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
            <h1>{{ dataProject.name }}</h1>

        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center justify-start justify-md-end">
            <VBtn class="ms-2" :color="compareDates(dataProject.starting_date, dataProject.finishing_date).color">
                {{ compareDates(dataProject.starting_date, dataProject.finishing_date).status }}
            </VBtn>
        </VCol>
        <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
            @input="AddUploadImage($event, index)" />
    </VRow>

    <VRow class="match-height align-center justify-center">
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
                                    บันทึกภายใน
                                </th>
                                <th style="background-color: #fff !important;" class="text-end" v-if="item.id>0&& item.project_service_id>0">
                                    <VBtn @click="AddReports(item.columns, item.reports)" rounded="lg" color="primary"
                                        size="small">
                                        <VIcon start icon="ri-add-circle-fill" />
                                        สร้าง
                                    </VBtn>
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-if="item.id > 0 && item.project_service_id > 0"
                                v-for="(itemReport, indexReport) in item.reports" :key="indexReport">
                                <td v-if="itemReport.id > 0" class="text-uppercase text-center"
                                    v-for="(itemC, indexC) in item.columns" :key="indexC">
                                    <template v-if="editingReportIndex !== indexReport">
                                        <template v-if="itemC.ref_name === 'status_id'">
                                            <div v-html="convertStatus(itemReport[itemC.ref_name], item.statuses)">
                                            </div>
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'responder_id'">
                                            <VAvatar v-if="convertrtetretre(itemReport[itemC.ref_name])[1] === 'image'"
                                                rounded="lg" size="50" class="me-6 my-2"
                                                :image="convertrtetretre(itemReport[itemC.ref_name])[0]" />
                                            <span v-else>{{ convertrtetretre(itemReport[itemC.ref_name])[0]
                                                }}</span>
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'image'">
                                            <VAvatar v-if="itemReport[itemC.ref_name] !== ''" rounded="lg" size="60"
                                                class="me-6 my-2" :image="itemReport[itemC.ref_name]" />
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'draft_date'">
                                            <span v-if="itemReport[itemC.ref_name]">
                                                {{ formatDate_notime(itemReport[itemC.ref_name]) }}
                                            </span>


                                        </template>
                                        <template v-else-if="itemC.ref_name === 'posting_date'">
                                            <span v-if="itemReport[itemC.ref_name]">
                                                {{ formatDate_notime(itemReport[itemC.ref_name]) }}
                                            </span>
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'url'">
                                            <template v-if="itemReport[itemC.ref_name]">
                                                <a :href="itemReport[itemC.ref_name]" target="_blank">ลิงค์</a>
                                            </template>

                                        </template>

                                        <template v-else>
                                            {{ itemReport[itemC.ref_name] }}
                                        </template>
                                    </template>
                                    <template v-else>
                                        <!-- Editable Fields -->
                                        <template v-if="itemC.ref_name === 'status_id'">
                                            <VAutocomplete v-model="itemReport[itemC.ref_name]" autocomplete="no"
                                                :items="item.statuses" item-title="name" item-value="id"
                                                density="compact" clearable :placeholder="itemC.name" />
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'responder_id'">
                                            <VAutocomplete v-model="itemReport[itemC.ref_name]" autocomplete="no"
                                                :items="dataResponders" item-title="name" item-value="id"
                                                density="compact" clearable :placeholder="itemC.name" />
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'image'">
                                            <VBadge v-if="itemReport.image" icon="ri-close-line" color="error"
                                                @click="removeImage(itemReport)" class="v-badge--tonal my-4">
                                                <VAvatar size="60">
                                                    <VImg :src="itemReport.image" />
                                                </VAvatar>
                                            </VBadge>


                                            <VBtn v-else variant="text" color="default"
                                                @click="openupload(itemReport, indexReport)">
                                                <VIcon size="35" class="bg-secondary" icon="ri-image-add-line" />
                                            </VBtn>
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'draft_date'">
                                            <v-text-field color="primary"
                                                :value="formattedDate(itemReport[itemC.ref_name])"
                                                @focus="showDatePickerDraf(indexReport, itemReport, 'draft_date')"
                                                clearable v-model="itemReport[itemC.ref_name]" Readonly
                                                autocomplete="no" density="compact">
                                                <template #prepend-inner>
                                                    <v-menu activator="parent" v-model="popupDateDraf[indexReport]"
                                                        :close-on-content-click="false">
                                                        <v-date-picker color="primary" hideHeader hideWeekdays
                                                            v-model="itemReport[itemC.ref_name]">
                                                        </v-date-picker>
                                                    </v-menu>
                                                </template>
                                            </v-text-field>
                                        </template>
                                        <template v-else-if="itemC.ref_name === 'posting_date'">
                                            <v-text-field color="primary"
                                                :value="formattedDate(itemReport[itemC.ref_name])"
                                                @focus="showDatePicker(indexReport, itemReport, 'posting_date')"
                                                clearable v-model="itemReport[itemC.ref_name]" Readonly
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
                                    </template>
                                </td>
                                <td
                                    v-if="itemReport.id > 0 && (itemReport.inner_note === null || itemReport.inner_note === '' || itemReport.inner_note !== '')">

                                    <template v-if="editingReportIndex !== indexReport">
                                        {{ itemReport.inner_note }}
                                    </template>
                                    <template v-else>
                                        <template
                                            v-if="itemReport.inner_note === null || itemReport.inner_note === '' || itemReport.inner_note !== ''">
                                            <VTextField v-model="itemReport.inner_note" placeholder="บันทึกภายใน"
                                                variant="outlined" autocomplete="no" density="compact">
                                            </VTextField>
                                        </template>
                                    </template>
                                </td>
                                <td v-if="itemReport.id > 0" class="text-end">
                                    <VBtn v-if="editingReportIndex !== indexReport" @click="editReport(indexReport)"
                                        icon color="warning" size="x-small" variant="text">
                                        <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            แก้ไข Report
                                        </VTooltip>
                                    </VBtn>
                                    <VBtn v-if="editingReportIndex === indexReport"
                                        @click="saveReport(item.id, itemReport, indexReport)" icon color="info"
                                        size="x-small" variant="text">
                                        <VIcon class="me-1" icon="ri-save-line" size="26" />
                                        <VTooltip activator="parent" location="top">
                                            บันทึก Report
                                        </VTooltip>
                                    </VBtn>
                                    <VBtn v-if="editingReportIndex !== indexReport"
                                        @click="deleteReport(item, itemReport.id)" icon size="x-small" color="error"
                                        variant="text">
                                        <VIcon class="me-1" icon="ri-delete-bin-6-line" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            ลบ Report
                                        </VTooltip>
                                    </VBtn>
                                    <VBtn v-if="editingReportIndex === indexReport" @click="editingReportIndex = null"
                                        icon size="x-small" color="default" variant="text">
                                        <VIcon class="me-1" icon="ri-close-fill" size="22" />
                                        <VTooltip activator="parent" location="top">
                                            ยกเลิกแก้ไข Report
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
                                        <VAutocomplete v-model="itemReport[itemC.ref_name]" autocomplete="no"
                                            :items="dataResponders" item-title="name" item-value="id" density="compact"
                                            clearable :placeholder="itemC.name" />
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'image'">
                                        <VBadge v-if="itemReport.image" icon="ri-close-line" color="error"
                                            @click="removeImage(itemReport)" class="v-badge--tonal my-4">
                                            <VAvatar size="60">
                                                <VImg :src="itemReport.image" />
                                            </VAvatar>
                                        </VBadge>


                                        <VBtn v-else variant="text" color="default"
                                            @click="openupload(itemReport, indexReport)">
                                            <VIcon size="35" class="bg-secondary" icon="ri-image-add-line" />
                                        </VBtn>


                                    </template>
                                    <template v-else-if="itemC.ref_name === 'draft_date'">
                                        <v-text-field color="primary" :value="formattedDate(itemReport[itemC.ref_name])"
                                            @focus="showDatePickerDraf(indexReport)" clearable
                                            v-model="itemReport[itemC.ref_name]" placeholder="dd/mm/yyyy" Readonly
                                            autocomplete="no" density="compact">
                                            <template #prepend-inner>
                                                <v-menu activator="parent" v-model="popupDateDraf[indexReport]"
                                                    :close-on-content-click="false">
                                                    <v-date-picker color="primary" hideHeader hideWeekdays
                                                        v-model="itemReport[itemC.ref_name]">
                                                    </v-date-picker>
                                                </v-menu>
                                            </template>
                                        </v-text-field>
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
                                    <VTextField v-model="itemReport.inner_note" placeholder="บันทึกภายใน"
                                        variant="outlined" autocomplete="no" density="compact">
                                    </VTextField>
                                </td>
                                <td v-if="itemReport.id === null" class="text-end">
                                    <VBtn @click="saveReport(item.project_service_id, itemReport, indexReport)" icon
                                        color="info" size="x-small" variant="text">
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
                            <!-- id=null and  project_service_id==null-->
                            <tr v-if="item.id === null && item.project_service_id === null"
                                v-for="(itemReport, indexReport) in item.reports" :key="indexReport">
                                <td class="text-uppercase text-left" v-for="(itemC, indexC) in item.columns"
                                    :key="indexC">
                                    <template v-if="itemC.ref_name === 'status_id' || itemC.ref_name === 'status'">
                                        <div v-html="convertStatus(itemReport[itemC.ref_name], item.statuses)">
                                        </div>
                                    </template>

                                    <template v-else-if="itemC.ref_name === 'responder_id'">
                                        <VAvatar v-if="convertrtetretre(itemReport[itemC.ref_name])[1] === 'image'"
                                            rounded="lg" size="50" class="me-6 my-2"
                                            :image="convertrtetretre(itemReport[itemC.ref_name])[0]" />
                                        <span v-else>{{ convertrtetretre(itemReport[itemC.ref_name])[0]
                                            }}</span>
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'image'">
                                        <VAvatar v-if="itemReport[itemC.ref_name] !== ''" rounded="lg" size="60"
                                            class="me-6 my-2" :image="itemReport[itemC.ref_name]" />
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'draft_date'">
                                        <span v-if="itemReport[itemC.ref_name]">
                                            {{ formatDate_notime(itemReport[itemC.ref_name]) }}
                                        </span>
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'posting_date'">
                                        <span v-if="itemReport[itemC.ref_name]">
                                            {{ formatDate_notime(itemReport[itemC.ref_name]) }}
                                        </span>
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'schedule'">
                                        <span v-if="itemReport[itemC.ref_name]">
                                            {{ formatDate_notime(itemReport[itemC.ref_name]) }}
                                        </span>
                                    </template>
                                    <template v-else-if="itemC.ref_name === 'url'">
                                        <template v-if="itemReport[itemC.ref_name]">
                                            <a :href="itemReport[itemC.ref_name]" target="_blank">ลิงค์</a>
                                        </template>

                                    </template>
                                    <template v-else-if="itemReport.inner_note">
                                        {{ itemReport.itemReport.inner_note }}
                                    </template>
                                    <template v-else>
                                        {{ itemReport[itemC.ref_name] }}
                                    </template>


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
