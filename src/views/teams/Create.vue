<script setup>
import Swal from 'sweetalert2'
import Notlogo from '@images/avatars/Notlogo.png'
import Cookies from 'js-cookie'
import services from '@/services'
import { useAccountStore } from '@/plugins/store';
import { useRouter, useRoute } from 'vue-router';
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const overlay = ref(false);
const router = useRouter()
const route = useRoute();
const teams_Id = ref(route.params.id);
const refInputEl = ref()
const formCreateRef = ref(null);
const form = {
    email: '',
    firstname: '',
    lastname: '',
    note: '',
    username: '',
    password: ''
}
const formCreate = ref(structuredClone(form));
const initialFormState = ref(structuredClone(form));
const imageData = {
    "image": '',
    "NotImage": Notlogo
}
const ImageForm = ref(structuredClone(imageData));
onMounted(async () => {
    if (teams_Id.value) {
        await teamsDetail();
    }
});

const teamsDetail = async () => {
    try {
        overlay.value = true
        const response = await services.teamsDetail(teams_Id.value, auth);
        overlay.value = false
        if (response.data.status === "Successful") {
            ImageForm.value.NotImage = response.data.data.image
            formCreate.value = response.data.data
            initialFormState.value = structuredClone(response.data.data);

        }
    } catch (error) {
        console.log(error)
    }
}

const addTeams = async () => {
    try {

        const { valid } = await formCreateRef.value.validate()
        if (valid) {

            if (teams_Id.value) {
                await UpdateTeams();
            }
            else {
                console.log("yes")
                await InsertTeams()
            }


        }
    } catch (error) {

        Swal.fire({
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}
const InsertTeams = async () => {
    try {
        const response = await services.teamsSave(formCreate.value, auth);
        if (response.data.status === "Successful") {
            if (ImageForm.value.image !== "") {
                await InsertImage(response);
            }
            else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                router.push('/teams')
            }


        }
    } catch (error) {
        Swal.fire({
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}



const UpdateTeams = async () => {
    try {
        const modifiedFields = getModifiedFields(initialFormState.value, formCreate.value);
        if (Object.keys(modifiedFields).length === 0) {
            if (ImageForm.value.image === '') {
                router.push('/teams')
                return;
            }
            else {
                let res = {
                    "data": {
                        "status": "Successful",
                        "message": "Team member ryye55ff updated Successfully",
                        "data": {
                            "id": teams_Id.value
                        }
                    }
                }
                await InsertImage(res);
            }

        }

        const response = await services.teamsUpdate(teams_Id.value, modifiedFields, auth);
        if (response.data.status === "Successful") {
            if (ImageForm.value.image !== '') {

                await InsertImage(response);
            }
            else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                router.push('/teams')
            }



        }

    } catch (error) {
        Swal.fire({
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}
const InsertImage = async (response) => {
    let dataImage = {
        "image": ImageForm.value.image
    }
    const res_logo = await services.teamsAvatar(response.data.data.id, dataImage, auth);
    if (res_logo.data.status === "Successful") {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 2000
        });
        router.push('/teams')
    }
}

const getModifiedFields = (initial, current) => {
    let modified = {};
    for (let key in current) {
        if (current[key] !== initial[key]) {
            modified[key] = current[key];
        }
    }
    return modified;
}

const resetForm = async () => {
    resetImage()
    formCreate.value = structuredClone(form);
    if (teams_Id.value) {
        await teamsDetail()
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
                ImageForm.value.image = fileReader.result;
            }
        };
    }
};



const resetImage = () => {
    const fileInput = refInputEl.value // Replace 'your-file-input-id' with the actual ID of your file input
    fileInput.value = '';
    ImageForm.value.image = '';
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
        <h1>{{ teams_Id === "" ? 'เพิ่ม Teams' : 'แก้ไข Teams' }}</h1>
    </div>
    <VRow class="match-height align-center  justify-center mt-4">
        <VCol cols="12" md="10">
            <VCard>
                <VForm ref="formCreateRef">
                    <VCardText class="d-flex">
                        <VAvatar rounded="lg" size="100" class="me-6 border-md border-primary"
                            :image="ImageForm.image === '' ? ImageForm.NotImage : ImageForm.image" />

                        <div class="d-flex flex-column justify-center gap-5">
                            <div class="d-flex flex-wrap gap-2">
                                <VBtn color="primary" @click="refInputEl?.click()">
                                    <VIcon icon="ri-upload-cloud-line" class="d-sm-none" />
                                    <span class="d-none d-sm-block">Upload new Logo</span>
                                </VBtn>

                                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                                    @input="changeLogo">

                                <VBtn type="reset" color="error" variant="outlined" @click="resetImage">
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
                                <VTextField v-model="formCreate.firstname" required label="ชื่อของ user"
                                    :rules="[v => !!v || 'โปรดกรอกชื่อของ user']" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.lastname" label="นามสกุลของ user" density="compact" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.note" label="บันทึกของ user">
                                </VTextField>
                            </VCol>

                            <VCol cols="12">
                                <VTextField v-model="formCreate.email" label="Email ของ user" density="compact" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.username" required label="Username ของ user"
                                    :rules="[v => !!v || 'โปรดกรอก Username ของ user']" density="compact" />
                            </VCol>
                            <VCol cols="12" v-if="teams_Id == ''">
                                <VTextField v-model="formCreate.password" required label="password ของ user"
                                    :rules="[v => !!v || 'โปรดกรอก password ของ user']" density="compact" />
                            </VCol>



                        </VRow>

                    </VCardText>

                </VForm>
            </VCard>
        </VCol>
    </VRow>
    <VRow>
        <VCol cols="12" class="mt-6 text-center">
            <RouterLink :to="`/teams`" icon color="secondary" size="x-small" variant="text">
                <VBtn variant="tonal" color="secondary" class="mx-4">
                    <VIcon class="me-1" icon="ri-arrow-left-line" size="22" />
                    กลับ
                </VBtn>

            </RouterLink>

            <VBtn variant="tonal" class="mx-4" @click="addTeams()">
                <VIcon size="24" icon="ri-add-line" />
                บันทึก Teams
            </VBtn>

            <VBtn variant="tonal" color="info" class="mx-4" @click="resetForm()">
                <VIcon size="24" icon="ri-refresh-line" class="ma-2" />
                ยกเลิก
            </VBtn>
        </VCol>
    </VRow>
</template>