<script setup>
import Swal from 'sweetalert2'
import services from '@/services'
import { formatDate_notime, compareDates } from '@/plugins/function.js'
import Showimage from '@/views/project/Showimage.vue'
const overlay = ref(false);
const myShowimageRef = ref(null)
const dialogVisible = ref(false)
const resolvePromise = ref()
const rejectPromise = ref()
const report_id = ref('')
const auth = ref('')
const dataReport = ref([])
const dataColunm = ref([])
const dataresponders = ref([])
const datastatuses = ref([])
const isEditing = ref(false);

const showDialog = async data => {
    overlay.value = true
    dialogVisible.value = true
    console.log(data)
    report_id.value = data.report_id
    auth.value = data.auth;

    await getReport();
    return new Promise((resolve, reject) => {
        resolvePromise.value = () => {
            resolve(true)
            dialogVisible.value = false
        }

        rejectPromise.value = () => {
            resolve(false)
            dialogVisible.value = false
        }
    })
}

const getReport = async () => {
    if (report_id.value && auth.value) {
        try {
            const response = await services.reportProjectbyIdreport(report_id.value, auth.value);
            console.log(response)
            if (response.data.status === "Successful") {
                dataReport.value = response.data.data.report
                dataColunm.value = response.data.data.columns
                dataresponders.value = response.data.data.responders
                datastatuses.value = response.data.data.statuses
            }
            overlay.value = false
        } catch (error) {
            overlay.value = false;
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
}

const convertStatus = (item, statuses) => {
    let foundStatus = datastatuses.value.find(status => status.id === item);
    if (foundStatus) {
        return `<VChip style="background-color: ${foundStatus.color}; color: aliceblue;" variant="outlined" class="px-2 py-1 rounded">${foundStatus.name}</VChip>`;
    } else {
        return "";
    }
}

const convertrtetretre = (item) => {
    let foundResponders = dataresponders.value.find(responders => responders.id === item);
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

const close = () => {
    rejectPromise.value()
}

const toggleEdit = () => {
    isEditing.value = !isEditing.value;
}

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

const saveReport = async () => {
    const newItem = { ...dataReport.value }
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
         overlay.value = true;
        const response = await services.reportUpdate(report_id.value, newItem, auth.value);
        console.log(response)
        if (response.data.status === "Successful") {
            overlay.value = false;
            toggleEdit();
            close()
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 2000
            });

        }
    } catch (error) {
        console.log(error)
        overlay.value = false;
        close();
        Swal.fire({
            text: `${error.response.data.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}

const formattedDate = (item) => {
    if (item) {
        const date = new Date(item);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    return null;
};

const popupDateDraf = ref([]);
const showDatePickerDraf = (index, item, type) => {
    if (item) {
        item.draft_date = null;
    }
    popupDateDraf.value[index] = true;
}

const popupDate = ref([]);
const showDatePicker = (index, item, type) => {
    if (item) {
        item.posting_date = null;
    }
    popupDate.value[index] = true;
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

defineExpose({ showDialog })

const showImage = async (image) => {
    if (myShowimageRef.value) {
        const result = await myShowimageRef.value.showDialog({
            image
        })
        console.log(result)
    }
}
</script>

<template>
    <VDialog transition="dialog-top-transition" width="800" v-model="dialogVisible">
        <div class="text-center">
            <v-overlay v-model="overlay" persistent class="align-center justify-center">
                <v-progress-circular :size="90" :width="6" color="primary" indeterminate>
                    <template v-slot:default>
                        <span class="text-white"> Loading </span>
                    </template>
                </v-progress-circular>
            </v-overlay>
            <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                @input="AddUploadImage($event, index)" />
        </div>
        <VCard title="Report">
            <VDivider class="mb-6" />
            <VCardText>
                <VRow v-if="dataColunm">
                    <VCol cols="12">
                        <VTable>
                            <thead>
                                <tr>
                                    <th class="text-left">Colunm</th>
                                    <th class="text-left">ข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(itemC, indexCol) in dataColunm" :key="indexCol">
                                    <td class="text-left">
                                        {{ itemC.name }}
                                    </td>
                                    <td>
                                        <template v-if="isEditing">
                                            <template v-if="itemC.ref_name === 'status_id'">
                                                <VAutocomplete v-model="dataReport[itemC.ref_name]" autocomplete="no"
                                                    :items="datastatuses" item-title="name" item-value="id"
                                                    density="compact" clearable :placeholder="itemC.name"
                                                    :label="itemC.name" />
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'responder_id'">
                                                <VAutocomplete v-model="dataReport[itemC.ref_name]" autocomplete="no"
                                                    :items="dataresponders" item-title="name" item-value="id"
                                                    density="compact" clearable :placeholder="itemC.name" />
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'image'">
                                                <VBadge v-if="dataReport.image" icon="ri-close-line" color="error"
                                                    @click="removeImage(dataReport)" class="v-badge--tonal my-4">
                                                    <VAvatar  size="50">
                                                        <VImg :src="dataReport.image" />
                                                    </VAvatar>
                                                </VBadge>


                                                <VBtn v-else variant="text" color="default"
                                                    @click="openupload(dataReport, indexReport)">
                                                    <VIcon size="35" class="bg-secondary" icon="ri-image-add-line" />
                                                </VBtn>
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'draft_date'">
                                                <v-text-field color="primary"
                                                    :value="formattedDate(dataReport[itemC.ref_name])"
                                                    @focus="showDatePickerDraf(indexCol, dataReport)" clearable
                                                    v-model="dataReport[itemC.ref_name]" placeholder="dd/mm/yyyy"
                                                    Readonly autocomplete="no" density="compact">
                                                    <template #prepend-inner>
                                                        <v-menu activator="parent" v-model="popupDateDraf[indexCol]"
                                                            :close-on-content-click="false">
                                                            <v-date-picker color="primary" hideHeader hideWeekdays
                                                                v-model="dataReport[itemC.ref_name]">
                                                            </v-date-picker>
                                                        </v-menu>
                                                    </template>
                                                </v-text-field>
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'posting_date'">
                                                <v-text-field color="primary"
                                                    :value="formattedDate(dataReport[itemC.ref_name])"
                                                    @focus="showDatePicker(indexCol, dataReport)" clearable
                                                    v-model="dataReport[itemC.ref_name]" Readonly autocomplete="no"
                                                    density="compact">
                                                    <template #prepend-inner>
                                                        <v-menu activator="parent" v-model="popupDate[indexCol]"
                                                            :close-on-content-click="false">
                                                            <v-date-picker color="primary" hideHeader hideWeekdays
                                                                v-model="dataReport[itemC.ref_name]">
                                                            </v-date-picker>
                                                        </v-menu>
                                                    </template>
                                                </v-text-field>
                                            </template>
                                            <template
                                                v-else-if="itemC.ref_name === 'url' || itemC.ref_name === 'group_link'">
                                                <VTextField v-model="dataReport[itemC.ref_name]"></VTextField>
                                            </template>
                                            <template v-else>
                                                <VTextField v-model="dataReport[itemC.ref_name]"></VTextField>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <template v-if="itemC.ref_name === 'status_id'">
                                                <div v-html="convertStatus(dataReport[itemC.ref_name], datastatuses)">
                                                </div>
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'responder_id'">
                                                <VAvatar
                                                    v-if="convertrtetretre(dataReport[itemC.ref_name])[1] === 'image'"
                                                    rounded="lg" size="50" class="me-6 my-2"
                                                    :image="convertrtetretre(dataReport[itemC.ref_name])[0]" />
                                                <span v-else>{{ convertrtetretre(dataReport[itemC.ref_name])[0]
                                                    }}</span>
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'image'">
                                                <VAvatar @click="showImage(dataReport[itemC.ref_name])" v-if="dataReport[itemC.ref_name] !== ''" rounded="lg" size="50"
                                                    class="me-6 my-2" :image="dataReport[itemC.ref_name]" />
                                            </template>
                                            <template
                                                v-else-if="itemC.ref_name === 'draft_date' || itemC.ref_name === 'posting_date'">
                                                <span v-if="dataReport[itemC.ref_name]">
                                                    {{ formatDate_notime(dataReport[itemC.ref_name]) }}
                                                </span>
                                            </template>
                                            <template
                                                v-else-if="itemC.ref_name === 'url' || itemC.ref_name === 'group_link'">
                                                <template v-if="dataReport[itemC.ref_name]">
                                                    <a :href="dataReport[itemC.ref_name]" target="_blank">ลิงค์</a>
                                                </template>
                                            </template>
                                            <template v-else>
                                                {{ dataReport[itemC.ref_name] }}
                                            </template>
                                        </template>
                                    </td>
                                </tr>
                                <tr >
                                    <td class="text-right">
                                        <VBtn v-if="!isEditing" size="small" color="warning" @click="toggleEdit">
                                            <VIcon class="me-1" icon="ri-edit-box-line" size="22" />
                                            <VTooltip activator="parent" location="top">
                                                แก้ไข Report
                                            </VTooltip>
                                            แก้ไข Report
                                        </VBtn>
                                        <VBtn v-else size="small" color="success" @click="saveReport">
                                            <VIcon class="me-1" icon="ri-save-line" size="22" />
                                            <VTooltip activator="parent" location="top">
                                                บันทึก Report
                                            </VTooltip>
                                            บันทึก Report
                                        </VBtn>
                                    </td>
                                    <td class="text-left">
                                        <VBtn @click="close" size="small" color="secondary">
                                            <VIcon class="me-1" icon="ri-close-circle-line" size="22" />
                                            <VTooltip activator="parent" location="top">
                                                Close
                                            </VTooltip>
                                            Close
                                        </VBtn>
                                    </td>
                                </tr>
                            </tbody>
                        </VTable>
                    </VCol>
                </VRow>
            </VCardText>
            <VDivider class="my-1" />
        </VCard>
    </VDialog>
    <Showimage ref="myShowimageRef" />
</template>

<style lang="css">
.v-overlay--active .v-overlay__scrim {
    opacity: 0.5;
}
</style>
