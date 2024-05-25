<script setup>
import Cookies from 'js-cookie'
import services from '@/services'
import { useAccountStore } from '@/plugins/store';
import Swal from 'sweetalert2'
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const overlay = ref(false);
const platforms = ref([])
const columns = ref([])
const form = {
    platform_id: '',
    name: '',
    detail: '',
    note: '',
    statuses: [],
    columns: []
}
const formCreate = ref(structuredClone(form));
onMounted(async () => {
    await getServicesCreate()
})
const getServicesCreate = async () => {
    try {
        const response = await services.servicesCreate(auth);
        console.log(response)
        if (response.data.status === "Successful") {
            platforms.value = response.data.data.platforms;
            columns.value = response.data.data.columns;
        }

    } catch (error) {
        console.log(error)
    }
}
import Notlogo from '@images/avatars/Notlogo.png'

const logoData = {
    logo: '',

}

const refInputEl = ref()
const logoForm = ref(structuredClone(logoData))

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
const options_score = [
    { status: '', color: '' },

]
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

    <VRow class="match-height align-center align-center justify-center">
        <VCol cols="12" md="10">
            <VCard>
                <VCardText>
                    <VForm ref="formCreateRef">
                        {{ formCreate }}
                        <VRow class="justify-center align-center">
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.name" required label="ชื่อของ service"
                                    :rules="[v => !!v || 'โปรดกรอกชื่อของ service']" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <VAutocomplete v-model="formCreate.platform_id" autocomplete="no"
                                    label="ชื่อของ platform ที่จะใส่ให้ service" :items="platforms" item-title="name"
                                    item-value="id" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.detail" label="คำอธิบาย service เพิ่มเติม">
                                </VTextField>
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.note" label="บันทึกข้อความของ service">
                                </VTextField>
                            </VCol>

                        </VRow>
                    </VForm>
                </VCardText>
                <VCardText class="d-flex">
                    <VAvatar rounded="lg" size="100" class="me-6 border-md border-primary"
                        :image="logoForm.logo === '' ? Notlogo : logoForm.logo" />

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
                    <VRow>

                        <VCol cols="12">
                            <VTable density="compact">
                                <thead>
                                    <tr>
                                        <th class="text-uppercase">
                                            ข้อมูลสถานะ

                                        </th>

                                        <th class="text-uppercase text-center">


                                        </th>

                                    </tr>
                                </thead>
                            </VTable>

                            
                            
                                    <div class="d-flex align-center flex-wrap px-2 mt-2"
                                        v-for="(option, optionIndex) in options_score" :key="optionIndex">
                                        <VRow>
                                            <VCol cols="6">
                                                <VTextField label="ชื่อของสถานะ" v-model="option.status"
                                                    :model-value="option.status" variant="outlined"
                                                    @focus="$event.target.select()">
                                                </VTextField>
                                            </VCol>
                                            <VCol cols="6">
                                                <VTextField label="สีของสถานะ" :model-value="option.color"
                                                    variant="outlined" v-model="option.color" class="text-caption"
                                                    @focus="$event.target.select()">
                                                </VTextField>
                                            </VCol>
                                        </VRow>
                                        <VBtn icon class="ms-2" color="default" size="x-small" variant="text"
                                            @click="removeTypeAnswer_score(item, optionIndex)">
                                            <VIcon size="30" icon="ri-close-line" />
                                        </VBtn>
                                    </div>
                                    <div class="d-flex align-center flex-wrap px-2 mt-3 text-primary">
                                        <VLabel style="cursor: pointer" @click="addTypeAnswer_radio(item)">
                                            <VIcon size="24" icon="ri-circle-line" />
                                            <span class="ms-3">เพิ่มตัวเลือก</span>
                                        </VLabel>
                                    </div>

                        </VCol>



                        <VCol cols="12">

                            <VTabs>
                                <VTab key="colunm" value="colunm">
                                    ข้อมูล Column
                                </VTab>
                            </VTabs>
                            <VWindow>
                                <VWindowItem :key="colunm" :value="colunm">
                                    <VTable density="compact" class="mt-2 mx-5">
                                        <thead>
                                            <tr>
                                                <th class="text-uppercase">
                                                    ชื่อของคอลัมน์

                                                </th>

                                                <th class="text-uppercase text-center">


                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                        </tbody>
                                    </VTable>

                                </VWindowItem>
                            </VWindow>

                        </VCol>


                    </VRow>

                </VCardText>

            </VCard>
        </VCol>


    </VRow>
</template>
