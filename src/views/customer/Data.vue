<script setup>
import { formatDate_notime } from '@/plugins/function.js'
import ConfirmPasscode from '@/views/customer/ConfirmPasscode.vue'
import services from '@/services'
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router';
const route = useRoute();
const overlay = ref(false)
const encrypted_url = ref(route.params.id)
const passcode = ref('');
const myConfirmPasscode = ref(null)
const dataProject = ref([]);
const visible = ref(false)
onMounted(async () => {

    if (encrypted_url.value) {
        if (passcode.value == '') {
            if (myConfirmPasscode.value) {
                await confirm();

            }

        }
        else {
            let auth = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'passcode': passcode.value
                },
            }
            await getData(auth);
        }
    }
});
const confirm = async () => {
    const result = await myConfirmPasscode.value.showForms(encrypted_url.value);
    if (result.status === true) {
        passcode.value = result.data.passcode;
        let auth = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'passcode': passcode.value
            },
        }
        await getData(auth);
    }
}
const getData = async (auth) => {
    try {
        overlay.value = true
        const response = await services.customerProject(encrypted_url.value, auth);
        overlay.value = false
        if (response.data.status === "Successful") {
            dataProject.value = response.data.data.project;
            visible.value = true
        }
    } catch (error) {
        overlay.value = false

        Swal.fire({
            text: error.response.data.message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await confirm();
            }
        });

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
    <VRow class="align-top justify-center px-4"  v-if="visible">
        <VCol cols="12">
            <VRow class="align-start justify-start mt-2 mx-4">
                <VCol cols="12">
                    <VAlert border="start" color="primary" variant="tonal">
                        <h1 class="my-4">{{ dataProject.name }}</h1>
                    </VAlert>

                </VCol>
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
                                        <th class="text-uppercase text-center"
                                            v-for="(itemCol, indexCol) in item.columns" :key="indexCol">
                                            {{ itemCol.name }}
                                        </th>
                                        <th>
                                            บันทึกภายใน
                                        </th>

                                    </tr>

                                </thead>
                                <tbody>
                                    <tr v-for="(itemReport, indexReport) in item.reports" :key="indexReport">
                                        <td class="text-uppercase text-center" v-for="(itemC, indexC) in item.columns"
                                            :key="indexC">

                                            <template v-if="itemC.ref_name === 'status_id'">
                                                <VChip
                                                    :style="{ backgroundColor: itemReport.status.color, 'color': '#fff' }"
                                                    variant="outlined" class="rounded">{{ itemReport.status.name }}
                                                </VChip>
                                            </template>
                                            <template v-else-if="itemC.ref_name === 'responder_id'">
                                                <template v-if="itemReport.responder">

                                                    <VAvatar v-if="itemReport.responder.image !== ''" rounded="lg"
                                                        size="50" class="me-6 my-2"
                                                        :image="itemReport.responder.image" />
                                                    <span v-else>
                                                        {{ itemReport.responder.name }}
                                                    </span>
                                                </template>


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

                                        </td>
                                        <td
                                            v-if="(itemReport.inner_note === null || itemReport.inner_note || itemReport.inner_note === undefined)">

                                            {{ itemReport.inner_note }}

                                        </td>




                                    </tr>
                                </tbody>
                            </VTable>
                        </VCardText>
                    </VCard>
                </VCol>
            </VRow>
        </VCol>
    </VRow>

    <ConfirmPasscode ref="myConfirmPasscode" />
</template>
