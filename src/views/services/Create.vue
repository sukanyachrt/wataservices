<script setup>
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import Cookies from 'js-cookie'
import services from '@/services'
import { useAccountStore } from '@/plugins/store';
import { useRouter, useRoute } from 'vue-router';
import Notlogo from '@images/avatars/Notlogo.png'
import Swal from 'sweetalert2'
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
const Services_Id = ref(route.params.id)
const overlay = ref(false);
const platforms = ref([])
const columns = ref([])
const formCreateRef = ref(null);
const form = {
    platform_id: '',
    name: '',
    detail: '',
    note: '',
    statuses: [{ name: '', color: '#000', type: false }],
    columns_: [{}],
    columns: []
}
const formCreate = ref(structuredClone(form));
const logoData = {
    "logo": '',
    "Notlogo": Notlogo
}

const refInputEl = ref()
const logoForm = ref(structuredClone(logoData))
onMounted(async () => {
    await getServicesCreate()
    if (Services_Id.value) {
        await servicesDetail();
    }
})
const servicesDetail = async () => {
    try {
        overlay.value = true
        const response = await services.servicesDetail(Services_Id.value, auth);
        overlay.value = false

        if (response.data.status === "Successful") {
            formCreate.value = response.data.data.service;
            logoForm.value.Notlogo = response.data.data.service.logo;
            formCreate.value.columns_ = response.data.data.service.columns
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
const getServicesCreate = async () => {
    try {
        const response = await services.servicesCreate(auth);
        if (response.data.status === "Successful") {
            platforms.value = response.data.data.platforms;
            columns.value = response.data.data.columns;
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

const addStatus = () => {
    formCreate.value.statuses.push({ name: '', color: '#000', type: false });
};
const removeStatus = (index) => {
    formCreate.value.statuses.splice(index, 1)

}
const capitalizedLabel = (label) => {

    if (label == true) {
        return "สถานะนี้แปลว่างานสำเร็จ"
    }
    else {
        return "สถานะทั่วไป"
    }

}

const addCoulunm = () => {
    formCreate.value.columns_.push({});
}
const removeColunm = (index) => {
    formCreate.value.columns_.splice(index, 1)
}
const resetForm =async () => {
    resetLogo()
    formCreate.value = structuredClone(form);
    if (Services_Id.value) {
        await servicesDetail();
    }
}
const addServices = async () => {
    if (Services_Id.value) {
        const { valid } = await formCreateRef.value.validate()
        if (valid) {
            overlay.value = true
            await UpdateServices();
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
                await InsertServices()

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

const UpdateServices = async () => {
    formCreate.value.columns = formCreate.value.columns_.map(column => column.id);

    const response = await services.servicesUpdate(Services_Id.value, formCreate.value, auth);
    console.log(response)
    if (response.data.status === "Successful") {
        //insert image
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
            router.push('/services')
        }

    }
}

const InsertServices = async () => {
    formCreate.value.columns = formCreate.value.columns_.map(column => column.id);

    const response = await services.servicesSave(formCreate.value, auth);
    if (response.data.status === "Successful") {
        //insert image
        await InsertLogo(response);
    }

}

const InsertLogo = async (response) => {
    let datalogo = {
        "logo": logoForm.value.logo
    }
    const res_logo = await services.servicesLogo(response.data.data.id, datalogo, auth);
    if (res_logo.data.status === "Successful") {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 2000
        });
        router.push('/services')
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
        <h1>เพิ่ม Services</h1>
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
                                Allowed JPG, GIF or PNG. Max size of 2MB
                            </p>
                        </div>
                    </VCardText>
                    <VCardText>
                        <VRow class="justify-center align-center">
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.name" required label="ชื่อของ service"
                                    :rules="[v => !!v || 'โปรดกรอกชื่อของ service']" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <VAutocomplete v-model="formCreate.platform_id" autocomplete="no"
                                    label="ชื่อของ platform ที่จะใส่ให้ service" :items="platforms" item-title="name"
                                    density="compact" item-value="id" required
                                    :rules="[v => !!v || 'โปรดเลือกชื่อ platform ที่จะใส่ให้ service']" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.detail" label="คำอธิบาย service เพิ่มเติม"
                                    density="compact">
                                </VTextField>
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.note" label="บันทึกข้อความของ service">
                                </VTextField>
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
                                                <b>ข้อมูลสถานะ</b>

                                            </th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>ชื่อของสถานะ</td>
                                            <td>สีของสถานะ</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr v-for="(option, optionIndex) in formCreate.statuses" :key="optionIndex">
                                            <td>
                                                <VTextField v-model="option.name" :model-value="option.name"
                                                    placeholder="เลือกชื่อของสถานะ" variant="outlined" density="compact"
                                                    @focus="$event.target.select()" required class="my-2"
                                                    :rules="[v => !!v || 'โปรดกรอกชื่อของสถานะ']">
                                                </VTextField>
                                            </td>
                                            <td>

                                                <color-picker v-model:pureColor="option.color" format="hex" />

                                            </td>
                                            <td>
                                                <VSwitch v-model="option.type" :label="capitalizedLabel(option.type)" />


                                            </td>
                                            <td>
                                                <VBtn icon class="ms-2" color="default" size="x-small" variant="text"
                                                    @click="removeStatus(optionIndex)">
                                                    <VIcon size="30" icon="ri-close-line" />
                                                </VBtn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </VTable>

                                <div class="d-flex justify-center flex-wrap px-2 mt-6 text-primary">

                                    <VBtn variant="outlined" @click="addStatus()">
                                        <VIcon start icon="ri-add-circle-line" />
                                        เพิ่มสถานะ
                                    </VBtn>
                                </div>

                            </VCol>
                            <VDivider />
                            <VCol cols="12">
                                <VTable>
                                    <thead>
                                        <tr>
                                            <th class="text-uppercase text-center" colspan="3">
                                                <b> ข้อมูล Column</b>

                                            </th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="2">ชื่อของคอลัมน์</td>
                                            <td></td>
                                        </tr>
                                        <tr v-for="(option, optionIndex) in formCreate.columns_" :key="optionIndex">
                                            <td colspan="2">
                                                <VAutocomplete v-model="option.id" autocomplete="no" :items="columns"
                                                    item-title="name" item-value="id" density="compact"
                                                    placeholder="เลือกชื่อของคอลัมน์" required class="my-2"
                                                    :rules="[v => !!v || 'โปรดเลือกชื่อของคอลัมน์']" />

                                            </td>
                                            <td class="text-center">
                                                <VBtn icon class="ms-2" color="default" size="x-small" variant="text"
                                                    @click="removeColunm(optionIndex)">
                                                    <VIcon size="30" icon="ri-close-line" />
                                                </VBtn>
                                            </td>
                                        </tr>
                                    </tbody>

                                </VTable>

                                <div class="d-flex justify-center flex-wrap px-2 mt-6 text-primary">

                                    <VBtn variant="outlined" @click="addCoulunm(item)">
                                        <VIcon start icon="ri-add-circle-line" />
                                        เพิ่ม Colunm
                                    </VBtn>
                                </div>

                            </VCol>


                        </VRow>

                    </VCardText>
                </VForm>
            </VCard>
        </VCol>
    </VRow>
    <VRow>
        <VCol cols="12" class="mt-6 text-center">
            <VBtn variant="tonal" @click="addServices()" class="mx-4">
                <VIcon size="24" icon="ri-add-line" />
                บันทึก Survices
            </VBtn>

            <VBtn variant="tonal" color="info" @click="resetForm()" class="mx-4">
                <VIcon size="24" icon="ri-refresh-line" class="ma-2" />
                ยกเลิก
            </VBtn>
        </VCol>
    </VRow>
</template>
