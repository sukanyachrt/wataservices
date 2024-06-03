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
const User_Id = ref(route.params.id);
const refInputEl = ref()
const formCreateRef = ref(null);
const form = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    note: '',
    telephone: '',
    address: '',
    role_id: ''
}
const formCreate = ref(structuredClone(form));
const initialFormState = ref(structuredClone(form));
const imageData = {
    "image": '',
    "NotImage": Notlogo
}
const ImageForm = ref(structuredClone(imageData));
const dataroles = ref([]);
const isPasswordVisible = ref(false)
onMounted(async () => {
    if(User_Id.value){
        await userDetail();
    }
    else{
        await usersRole();
    }
    

});
const usersRole = async () => {
    try {
        overlay.value = true
        const response = await services.usersRole(auth);
        overlay.value = false
        if (response.data.status === "Successful") {
            dataroles.value = response.data.data.roles
        }
        

    } catch (error) {
        overlay.value = false
        console.log(error)
    }
}

const userDetail =async ()=>{
    try {
        const response = await services.userDetail(User_Id.value,auth);
        if (response.data.status === "Successful") {
            formCreate.value= response.data.data.user
            ImageForm.value.NotImage =response.data.data.user.image
            dataroles.value = response.data.data.roles;
            initialFormState.value = structuredClone(response.data.data.user);
        }
    } catch (error) {
        Swal.fire({
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}

const addUser = async () => {
    try {

        const { valid } = await formCreateRef.value.validate()
        if (valid) {
            if(User_Id.value){
              await  UpdateUser();
            }
            else{
                await InsertUser();
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

const InsertUser =async ()=>{
    try {
        const response = await services.userSave(formCreate.value, auth);
       console.log(response)
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
                router.push('/users')
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
const UpdateUser = async () => {
    try {
        const modifiedFields = getModifiedFields(initialFormState.value, formCreate.value);

        // Include the role_id in the modified fields if it has changed or if it's not already included
        if (initialFormState.value.role_id !== formCreate.value.role_id || !modifiedFields.hasOwnProperty('role_id')) {
            modifiedFields.role_id = formCreate.value.role_id;
        }

        // If there are no modified fields and no new image, show no changes detected message
        if (Object.keys(modifiedFields).length === 0 && ImageForm.value.image === '') {
            Swal.fire({
                text: 'No changes detected.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Proceed with the update if there are modified fields or a new image
        const response = await services.userUpdate(User_Id.value, modifiedFields, auth);
        if (response.data.status === "Successful") {
            if (ImageForm.value.image !== '') {
                await InsertImage(response);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                router.push('/users');
            }
        }
    } catch (error) {
        Swal.fire({
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};


const InsertImage = async (response) => {
    let dataImage = {
        "image": ImageForm.value.image
    }
    const res_logo = await services.userAvatar(response.data.data.id, dataImage, auth);
    if (res_logo.data.status === "Successful") {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 2000
        });
        router.push('/users')
    }
}

const resetForm = async () => {
    resetImage()
    formCreate.value = structuredClone(form);
    if (User_Id.value) {
        await teamsDetail()
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
};



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
        <h1>{{ User_Id === "" ? 'เพิ่ม User' : 'แก้ไข User' }}</h1>
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
                                    <span class="d-none d-sm-block">Upload new Image</span>
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
                        <VRow  align="start">
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.firstname" required label="ชื่อของ user"
                                    :rules="[v => !!v || 'โปรดกรอกชื่อของ user']" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.lastname" label="นามสกุลของ user" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.telephone"  label="เบอร์โทรศัพท์ของ user"
                                    density="compact" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <VTextField v-model="formCreate.address" label="ที่อยู่ของ user" density="compact" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.email" type="email" label="Email ของ user"
                                    density="compact" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="formCreate.note" label="บันทึก ของ user" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6" class="text-start">
                                <VTextField v-model="formCreate.username" required label="Username ของ user"
                                    :rules="[v => !!v || 'โปรดกรอก Username ของ user']" density="compact" />
                            </VCol>
                            <VCol cols="12" md="6" v-if="User_Id.value===''">
                                <VTextField v-model="formCreate.password" placeholder="············"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                                    label="Password ของ user" required :rules="[v => !!v || 'โปรดกรอก Password ของ user']"
                                    density="compact" />
                            </VCol>
                            <VCol cols="12" md="6" v-if="User_Id.value!==''">
                                <VTextField v-model="formCreate.password" placeholder="············"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                                    label="Password ของ user"  
                                    density="compact" />
                            </VCol>
                            <VCol cols="12">
                                <VAutocomplete v-model="formCreate.role_id" autocomplete="no"
                                    label="ระดับสิทธิ ของ user" :items="dataroles" item-title="name" density="compact"
                                    item-value="id" required :rules="[v => !!v || 'โปรดเลือก ระดับสิทธิ ของ user']" />
                            </VCol>
                        </VRow>
                    </VCardText>
                </VForm>
            </VCard>
        </VCol>
    </VRow>
    <VRow>
        <VCol cols="12" class="mt-6 text-center">
            <RouterLink :to="`/users`" icon color="secondary" size="x-small" variant="text">
                <VBtn variant="tonal" color="secondary" class="mx-4">
                    <VIcon class="me-1" icon="ri-arrow-left-line" size="22" />
                    กลับ
                </VBtn>

            </RouterLink>

            <VBtn variant="tonal" class="mx-4" @click="addUser()">
                <VIcon size="24" icon="ri-add-line" />
                บันทึก User
            </VBtn>

            <VBtn variant="tonal" color="info" class="mx-4" @click="resetForm()">
                <VIcon size="24" icon="ri-refresh-line" class="ma-2" />
                ยกเลิก
            </VBtn>
        </VCol>
    </VRow>
</template>