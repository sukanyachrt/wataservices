<script setup>
import Swal from 'sweetalert2'
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
const router = useRouter()
const route = useRoute();
const Project_Id = ref(route.params.id)
const overlay = ref(false);
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
        <h1>{{ dataProject.name }}</h1>
        {{ dataProject }}
    </div>
    <VRow class="match-height align-center  justify-center mt-4">
        <VCol cols="12">
            <VCard class="my-4" v-for="(item, optionIndex) in dataProject.services" :key="optionIndex">
                <VCardTitle>
                    {{ item.name }}
                </VCardTitle>
                <VCardText class="d-flex">
                    <VTable style="width: 100% !important;">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-center" v-for="(itemCol, indexCol) in item.columns"
                                    :key="indexCol">
                                    {{ itemCol.name }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-uppercase text-center" v-for="(itemCol, indexCol) in item.columns"
                                    :key="indexCol">
                                    <VTextField placeholder="กรอกจำนวน credit ในบริการ" variant="outlined" 
                                        autocomplete="no" density="compact" @focus="$event.target.select()" required
                                        class="my-2" :rules="[v => !!v || 'โปรดกรอกจำนวน credit ในบริการ']">
                                    </VTextField>
                                </td>
                            </tr>
                        </tbody>
                    </VTable>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>