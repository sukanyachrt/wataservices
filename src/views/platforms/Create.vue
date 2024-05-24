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
    <VDialog transition="dialog-top-transition" width="500" v-model="dialogVisible">
        <VCard class="mt-6 border-t-xl border-primary border-opacity-100 border-4" :title="Id=='' ? 'เพิ่ม Platforms': 'แก้ไข Platforms'">
            <VCardText>
                <VForm ref="formCreateRef">
                    <VRow class="justify-center align-center">
                        <VCol cols="12">
                            <VTextField v-model="formCreate.name" required label="ชื่อของแพลตฟอร์ม"
                                :rules="[v => !!v || 'โปรดกรอกชื่อของแพลตฟอร์ม']" />
                        </VCol>
                        <VCol cols="12">
                            <VTextarea v-model="formCreate.description" label="คำอธิบายแพลตฟอร์มเพิ่มเติม" rows="2">
                            </VTextarea>
                        </VCol>
                        <VCol cols="12" class="mt-6 text-center">
                            <VBtn variant="tonal" @click="addPlatforms()" class="mx-4">
                                <VIcon size="24" icon="ri-add-line" />
                                บันทึกข้อมูล
                            </VBtn>
                            <VBtn variant="tonal" color="secondary" @click="reset()" class="mx-4">
                                <VIcon size="24" icon="ri-restart-line" />
                                ยกเลิก
                            </VBtn>
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>


        </VCard>
    </VDialog>

</template>
<script setup>
import Cookies from 'js-cookie'
import services from '@/services'
import Swal from 'sweetalert2'
import { useAccountStore } from '@/plugins/store';
const store = useAccountStore()
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken
    },
}
const overlay = ref(false)
const formCreateRef = ref(null);
const form = {
    name: '',
    description: ''
}
const Id =ref('')
const formCreate = ref(structuredClone(form));
const dialogVisible = ref(false);
const resolvePromise = ref()
const rejectPromise = ref()
const showForms = async data => {
  dialogVisible.value = true
  

if(data){
    Id.value=data.id
    formCreate.value = {...data}
}

  return new Promise((resolve, reject) => {
    resolvePromise.value = (data,type) => {
      resolve({'status' : true , 'data' : data,'type' : type})
      dialogVisible.value = false
    }

    rejectPromise.value = () => {
      resolve({'status' : false})
      dialogVisible.value = false
    }
  })
}
const addPlatforms = async () => {
    const { valid } = await formCreateRef.value.validate()
    if (valid) {
        overlay.value = true

        let databody = {
            "name": formCreate.value.name,
            "description": formCreate.value.description
        }
       
        try {
            let response;
            if(Id.value){
                 response = await services.UpdatePlatforms(Id.value,databody, auth);
                 resolvePromise.value(formCreate.value,'edit')
            }
            else{
                 response = await services.AddPlatforms(databody, auth);
                 formCreate.value.id=response.data.data.id
                 resolvePromise.value(formCreate.value,'add')
            }
           
            if (response.data.status === "Successful") {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                overlay.value=false
                
            }
            else {
                overlay.value = false
                Swal.fire({
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            overlay.value = false
            console.log(error)
        }

    }
}
const reset = async () => {
    rejectPromise.value()
   await clearform();
}

const clearform=async ()=>{
    Id.value=''
    formCreate.value =  structuredClone(form);
    // รีเซ็ตฟอร์ม
    if (formCreateRef.value) {
        await formCreateRef.value.resetValidation();
    }
}

defineExpose({ showForms,clearform })

</script>