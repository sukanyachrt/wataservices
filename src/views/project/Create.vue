<script setup>
import Swal from 'sweetalert2'
import Notlogo from '@images/avatars/Notlogo.png'
import { formatDate_notime } from '@/plugins/function.js'
import Cookies from 'js-cookie'
import services from '@/services'
import '@/styles/flatpickr.scss'
import flatPickr from 'vue-flatpickr-component'
import { useAccountStore } from '@/plugins/store';
import { useRouter, useRoute } from 'vue-router';
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
console.log(newToken)
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
const formCreateRef = ref(null);
const form = {
    customer: '',
    name: '',
    detail: '',
    note: '',
    starting_date1: '',
    starting_date: '',
    finishing_date1: '',
    finishing_date: '',
    services: [{}],
    passcode: '',
    pantip_job_id: ''
}
const formCreate = ref(structuredClone(form));
const logoData = {
    "logo": '',
    "Notlogo": Notlogo
}
const isPasswordVisible = ref(false)
const refInputEl = ref()
const logoForm = ref(structuredClone(logoData));
const dataservices = ref([]);
const jobs = ref([]);
const customers = ref([]);
const datePicker_startdate = ref()
const date_config_calendarYear = ref({
    enableTime: false,
    wrap: false,
    disableMobile: true,
    dateFormat: 'd-m-Y',
    defaultDate: null,
})
const chooseCalendar_startdate = () => {
    const flatPickrInstance = datePicker_startdate.value.fp
    flatPickrInstance._positionElement = window.document.getElementById('starting_date')
    flatPickrInstance.open()
}
//สิ้นสุด
const datePicker_finishingdate = ref()
const date_config_finishingdate = ref({
    enableTime: false,
    wrap: false,
    disableMobile: true,
    dateFormat: 'd-m-Y',
    defaultDate: null,
})
const chooseCalendar_finishingdate = () => {
    const flatPickrInstance = datePicker_finishingdate.value.fp
    flatPickrInstance._positionElement = window.document.getElementById('finishingdate')
    flatPickrInstance.open()
}
onMounted(async () => {
    await getProjectCreate()
    if (Project_Id.value) {
        await projectDetail();
    }
    console.log(customers.value)
})
const getProjectCreate = async () => {
    try {
        overlay.value = true
        const response = await services.projectCreate(auth);
        if (response.data.status === "Successful") {
            overlay.value = false
            dataservices.value = response.data.data.services;
            jobs.value = response.data.data.jobs;
            customers.value = response.data.data.customers;
        }
        else {
            overlay.value = false
        }

    } catch (error) {
        console.log(error)
    }
}
const projectDetail = async () => {
    try {
        overlay.value = true
        const response = await services.projectDetail(Project_Id.value, auth);
        overlay.value = false
        if (response.data.status === "Successful") {
            formCreate.value = response.data.data.project;
            logoForm.value.Notlogo = response.data.data.project.logo;
            let startingDateParts = formatDate_notime(formCreate.value.starting_date).split("-");
            formCreate.value.starting_date1 = `${startingDateParts[0]}-${startingDateParts[1]}-${startingDateParts[2]}`;

            let finishingDateParts = formatDate_notime(formCreate.value.finishing_date).split("-");
            formCreate.value.finishing_date1 = `${finishingDateParts[0]}-${finishingDateParts[1]}-${finishingDateParts[2]}`;

            formCreate.value.pantip_job_id = response.data.data.project.pantip_job
        }
        else {
            Swal.fire({
                text: response.data.status.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const changeLogo = file => {
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
                logoForm.value.logo = fileReader.result;
            }
        };
    }
};



const resetLogo = () => {
    const fileInput = refInputEl.value // Replace 'your-file-input-id' with the actual ID of your file input
    fileInput.value = '';
    logoForm.value.logo = '';
}

const addServices = () => {
    formCreate.value.services.push({});
};
const removeServices = (index) => {
    if (formCreate.value.services.length > 1) {
        formCreate.value.services.splice(index, 1)
    }
    else {
        Swal.fire({
            text: "ควรมี services อย่างน้อย 1 ค่ะ",
            icon: 'warning',
            confirmButtonText: 'OK'
        })

    }


}
const resetForm = async () => {
    resetLogo()
    formCreate.value = structuredClone(form);

}


const addProject = async () => {


    if (Project_Id.value) {
        const { valid } = await formCreateRef.value.validate()
        if (valid) {
            overlay.value = true
            await UpdateProject();
        }
        else {
            Swal.fire({
                text: "โปรดกรอกข้อมูลให้ครบถ้วนด้วยค่ะ",
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }

    }
    else {
        if (logoForm.value.logo == '') {
            Swal.fire({
                text: "โปรดอัพโหลด Logo Services ด้วยค่ะ",
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        else {
            //สร้างใหม่
            const { valid } = await formCreateRef.value.validate()
            if (valid) {

                overlay.value = true
                await InsertProject()

            }
            else {
                Swal.fire({
                    text: "โปรดกรอกข้อมูลให้ครบถ้วนด้วยค่ะ",
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

}
const UpdateProject = async () => {
    if (formCreate.value.pantip_job_id) {
        if (formCreate.value.pantip_job_id.id) {
            formCreate.value.pantip_job_id = formCreate.value.pantip_job_id.id
        }

    }
    if (formCreate.value.customer.id) {
        console.log("ss")
        formCreate.value.customer = formCreate.value.customer
    }
    else {
        formCreate.value.customer = { "id": formCreate.value.customer };
    }

    let customerId = formCreate.value.customer.id // ตัวแปรที่ต้องการตรวจสอบ
    let isCustomerExist = customers.value.some(cust => cust.id === customerId)
    console.log(isCustomerExist)
    console.log(formCreate.value.customer)
    if (isCustomerExist === false) {
        let [firstname, lastname] = customerId.split(' ')
        formCreate.value.customer = { firstname, lastname }
    }

    let startingDateParts = await formCreate.value.starting_date1.split("-");
    formCreate.value.starting_date = `${startingDateParts[2]}-${startingDateParts[1]}-${startingDateParts[0]}`;
    let finishingDateParts = await formCreate.value.finishing_date1.split("-");
    formCreate.value.finishing_date = `${finishingDateParts[2]}-${finishingDateParts[1]}-${finishingDateParts[0]}`;
    const response = await services.projectUpdate(Project_Id.value, formCreate.value, auth);
    if (response.data.status === "Successful") {

        if (logoForm.value.logo !== '') {

            await InsertLogo(response);
        }
        else {

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 2000
            });
            router.push('/project')
        }

    }
}

const InsertProject = async () => {
    let customerId = formCreate.value.customer // ตัวแปรที่ต้องการตรวจสอบ
    let isCustomerExist = customers.value.some(cust => cust.id === customerId)

    if (!isCustomerExist) {
        let [firstname, lastname] = customerId.split(' ')
        formCreate.value.customer = { firstname, lastname }
    } else {
        formCreate.value.customer = { id: customerId }
    }
    console.log(formCreate.value)
    let startingDateParts = await formCreate.value.starting_date1.split("-");
    formCreate.value.starting_date = `${startingDateParts[2]}-${startingDateParts[1]}-${startingDateParts[0]}`;
    let finishingDateParts = await formCreate.value.finishing_date1.split("-");
    formCreate.value.finishing_date = `${finishingDateParts[2]}-${finishingDateParts[1]}-${finishingDateParts[0]}`;
    console.log(formCreate.value)
    const response = await services.projectSave(formCreate.value, auth);
    if (response.data.status === "Successful") {

        await InsertLogo(response);
    }
    else {
        overlay.value = false
        Swal.fire({
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }

}

const InsertLogo = async (response) => {
    let datalogo = {
        "logo": logoForm.value.logo
    }
    const res_logo = await services.projectLogo(response.data.data.id, datalogo, auth);
    if (res_logo.data.status === "Successful") {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 2000
        });
        router.push('/project')
    }
}

const test = () => {
    modalOpen.value = true
}


const modalOpen = ref(false)
const newItem = ref({
    firstname: '',
    lastname: ''
})



const formCustomer = ref(null)

const saveNewItem = async () => {

    const { valid } = await formCustomer.value.validate()
    if (valid) {
        const fullName = `${newItem.value.firstname} ${newItem.value.lastname}`
        customers.value.push({ id: customers.value.length + 1, name: fullName })
        formCreate.value.customer = fullName
        modalOpen.value = false


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
    <div>
        <h1>{{ Project_Id === "" ? 'เพิ่ม Project' : 'แก้ไข Project' }}</h1>
    </div>
    <VRow class="match-height align-center  justify-center mt-4">
        <VCol cols="12" md="10">
            <VCard>
                <VForm ref="formCreateRef">
                    <VCardText class="d-flex">
                        <VAvatar rounded="lg" size="100" class="me-6 border-md border-primary"
                            :image="logoForm.logo === '' ? logoForm.Notlogo : logoForm.logo" />

                        <div class="d-flex flex-column justify-center gap-5">
                            <div class="d-flex flex-wrap gap-2">
                                <VBtn color="primary" @click="refInputEl?.click()">
                                    <VIcon icon="ri-upload-cloud-line" class="d-sm-none" />
                                    <span class="d-none d-sm-block">Upload new Logo</span>
                                </VBtn>

                                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                                    @input="changeLogo">

                                <VBtn type="reset" color="error" variant="outlined" @click="resetLogo">
                                    <span class="d-none d-sm-block">Reset</span>
                                    <VIcon icon="ri-refresh-line" class="d-sm-none" />
                                </VBtn>
                            </div>

                            <p class="text-body-1 mb-0">
                                Allowed jpg, jpeg, png. Max size of 2MB
                            </p>
                        </div>
                    </VCardText>
                    <VCardText>
                        <VRow class="justify-center align-center">
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.name" required label="ชื่อของ project"
                                    :rules="[v => !!v || 'โปรดกรอกชื่อของ project']" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <v-autocomplete v-model="formCreate.customer" :items="customers" label="ชื่อของลูกค้า"
                                    autocomplete="no" item-title="name" item-value="id"
                                    :rules="[v => !!v || 'โปรดเลือกชื่อของลูกค้า']" required density="compact">
                                    <template #no-data>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title v-if="formCreate.customer !== 'Add new'"
                                                    @click="test">ไม่มีข้อมูลที่ต้องการ
                                                    <VBtn size="x-small">
                                                        <VIcon start icon="ri-add-line" />
                                                        เพิ่มลูกค้า
                                                    </VBtn>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-autocomplete>

                                <v-dialog v-model="modalOpen" max-width="400">
                                    <VForm ref="formCustomer">
                                        <v-card>
                                            <v-card-title>เพิ่มข้อมูลลูกค้า</v-card-title>
                                            <VDivider />
                                            <v-card-text class="mt-4">
                                                <VRow class="justify-center align-center">
                                                    <VCol cols="12">
                                                        <v-text-field v-model="newItem.firstname"
                                                            :rules="[v => !!v || 'โปรดกรอกชื่อของลูกค้า']" required
                                                            label="ชื่อลูกค้า"></v-text-field>
                                                    </VCol>
                                                    <VCol cols="12">
                                                        <v-text-field v-model="newItem.lastname"
                                                            :rules="[v => !!v || 'โปรดกรอกนามสกุลของลูกค้า']" required
                                                            label="นามสกุลลูกค้า"></v-text-field>
                                                    </VCol>
                                                </VRow>


                                            </v-card-text>
                                            <VDivider />
                                            <v-card-actions class="justify-center align-center my-2">
                                                <VBtn variant="tonal" @click="saveNewItem" class="mx-4">
                                                    <VIcon size="24" icon="ri-add-line" />
                                                    บันทึกข้อมูล
                                                </VBtn>
                                                <VBtn variant="tonal" color="secondary" @click="modalOpen = false"
                                                    class="mx-4">
                                                    <VIcon size="24" icon="ri-restart-line" />
                                                    ยกเลิก
                                                </VBtn>

                                            </v-card-actions>
                                        </v-card>
                                    </VForm>
                                </v-dialog>
                                <!-- <VAutocomplete v-model="formCreate.customer" autocomplete="no" label="ชื่อของลูกค้า"
                                    :items="customers" item-title="name" density="compact" item-value="id" required
                                    :rules="[v => !!v || 'โปรดเลือกชื่อของลูกค้า']" /> -->
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.detail" label="รายละเอียดของ project" density="compact">
                                </VTextField>
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.note" label="บันทึกข้อความของ project">
                                </VTextField>
                            </VCol>
                            <VCol cols="12" md="6">
                                <div>
                                    <flat-pickr :config="date_config_calendarYear" v-show="false"
                                        v-model="formCreate.starting_date1" ref="datePicker_startdate"></flat-pickr>
                                    <VTextField @click="chooseCalendar_startdate" id="starting_date" autocomplete="yes"
                                        clearable v-model="formCreate.starting_date1" readonly
                                        label="วันเริ่มต้นของ project" required
                                        :rules="[v => !!v || 'เลือกวันเริ่มต้นของ project']" />
                                </div>
                            </VCol>
                            <VCol cols="12" md="6">
                                <div>
                                    <flat-pickr :config="date_config_finishingdate" v-show="false"
                                        v-model="formCreate.finishing_date1"
                                        ref="datePicker_finishingdate"></flat-pickr>
                                    <VTextField @click="chooseCalendar_finishingdate" id="finishingdate"
                                        autocomplete="yes" clearable v-model="formCreate.finishing_date1" readonly
                                        label="วันสิ้นสุดของ project" required
                                        :rules="[v => !!v || 'เลือกวันสิ้นสุดของ project']" />
                                </div>

                            </VCol>

                        </VRow>

                    </VCardText>
                    <VCardText>
                        <VRow>

                            <VCol cols="12">
                                <VTable>
                                    <thead>
                                        <tr>
                                            <th class="text-uppercase text-center text-xxl" colspan="4">
                                                <b>ข้อมูล Services</b>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>ชื่อของบริการ</td>
                                            <td>credit</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr v-for="(option, optionIndex) in formCreate.services" :key="optionIndex">
                                            <td>
                                                <VAutocomplete v-model="option.id" autocomplete="no"
                                                    :items="dataservices" item-title="name" item-value="id"
                                                    density="compact" placeholder="เลือกชื่อของ service" required
                                                    class="my-2" :rules="[v => !!v || 'โปรดเลือกชื่อของ service']" />

                                            </td>
                                            <td>

                                                <VTextField v-model="option.credit" :model-value="option.credit"
                                                    placeholder="กรอกจำนวน credit ในบริการ" variant="outlined"
                                                    density="compact" @focus="$event.target.select()" required
                                                    class="my-2" :rules="[v => !!v || 'โปรดกรอกจำนวน credit ในบริการ']">
                                                </VTextField>

                                            </td>

                                            <td>
                                                <VBtn icon class="ms-2" color="default" size="x-small" variant="text"
                                                    @click="removeServices(optionIndex)">
                                                    <VIcon size="30" icon="ri-close-line" />
                                                </VBtn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </VTable>

                                <div class="d-flex justify-center flex-wrap px-2 mt-6 text-primary">

                                    <VBtn variant="outlined" @click="addServices()">
                                        <VIcon start icon="ri-add-circle-line" />
                                        เพิ่มสถานะ
                                    </VBtn>
                                </div>

                            </VCol>
                            <VDivider />
                            <VCol cols="12" md="6" class="mt-4">
                                <VTextField required :rules="[v => !!v || 'โปรดกรอก Password']"
                                    v-model="formCreate.passcode" label="Password" placeholder="············"
                                    :type="isPasswordVisible ? 'text' : 'password'" density="compact"
                                    :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol cols="12" md="6" class="mt-4">
                                <VAutocomplete v-model="formCreate.pantip_job_id" autocomplete="no" :items="jobs"
                                    item-title="name" item-value="id" density="compact"
                                    placeholder="link Pantip Bot Porject" label="link Pantip Bot Porject" />

                            </VCol>
                        </VRow>

                    </VCardText>
                </VForm>
            </VCard>
        </VCol>
    </VRow>
    <VRow>
        <VCol cols="12" class="mt-6 text-center">
            <RouterLink :to="`/project`" icon color="secondary" size="x-small" variant="text">
                <VBtn variant="tonal" color="secondary" class="mx-4">
                    <VIcon class="me-1" icon="ri-arrow-left-line" size="22" />
                    กลับ
                </VBtn>

            </RouterLink>

            <VBtn variant="tonal" class="mx-4" @click="addProject()">
                <VIcon size="24" icon="ri-add-line" />
                บันทึก Project
            </VBtn>

            <VBtn variant="tonal" color="info" class="mx-4" @click="resetForm()">
                <VIcon size="24" icon="ri-refresh-line" class="ma-2" />
                ยกเลิก
            </VBtn>
        </VCol>
    </VRow>
</template>