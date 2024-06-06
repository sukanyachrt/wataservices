<script setup>
import Cookies from 'js-cookie';
import services from '@/services';
import { useAccountStore } from '@/plugins/store';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { formatDate_notime } from '@/plugins/function.js';
const router = useRouter()
const route = useRoute();
const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
const Project_Id = ref(route.params.id)
const overlay = ref(false)
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken,
    },
};
const data = ref([])
const grouped = ref({});
onMounted(async () => {
    if (Project_Id.value) {
        await getdetailTimeline();
    }

});
const getdetailTimeline = async () => {
    try {
        overlay.value = true;
        const response = await services.projectTimelineByIdproject(Project_Id.value, auth)
        console.log(response)
        if (response.data.status === 'Successful') {
            data.value = response.data.data;

            await groupedReports()
            overlay.value = false;
        }

    } catch (error) {
        overlay.value = false;
        console.log(error)
    }
}

const groupedReports = async () => {
    const tempGrouped = {};

    data.value.services.forEach((service) => {
        service.reports.forEach((report) => {
            if (!tempGrouped[report.expected]) {
                tempGrouped[report.expected] = {};
            }
            if (!tempGrouped[report.expected][data.value.name]) {
                tempGrouped[report.expected][data.value.name] = { id: data.value.id, services: {} };
            }
            if (!tempGrouped[report.expected][data.value.name].services[service.name]) {
                tempGrouped[report.expected][data.value.name].services[service.name] = [];
            }
            tempGrouped[report.expected][data.value.name].services[service.name].push({
                id: report.id,
                draft_date: report.draft_date,
                comment: report.comment,
            });
        });
    });

    const orderedGroups = {};
    const order = ['today', 'tomorrow', 'after_tomorrow'];

    // Add ordered groups first
    order.forEach((key) => {
        if (tempGrouped[key]) {
            orderedGroups[key] = tempGrouped[key];
            delete tempGrouped[key];
        }
    });

    // Add remaining groups
    Object.keys(tempGrouped).forEach((key) => {
        orderedGroups[key] = tempGrouped[key];
    });

    grouped.value = orderedGroups;
    return grouped.value;
};
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
        <VCol cols="12">
            <h1>{{ data.name }}</h1>
        </VCol>
    </VRow>
    <VRow>
        <VCol cols="12">
            <v-timeline>
                <v-timeline-item size="large" v-for="(projects, expected) in grouped" :key="expected"
                    dot-color="primary">
                    <template v-slot:opposite>
                        <v-card-title>
                            <span>{{ expected }}</span>
                        </v-card-title>
                    </template>
                    <v-card class="elevation-2 my-2" v-for="(project, name) in projects" :key="project.id">
                        <v-card-title :class="['text-h6', `bg-primary`, `outlined`]">
                            {{ name }} 
                        </v-card-title>
                        <v-card-text class="my-2">
                            <div v-for="(reports, serviceName) in project.services" :key="serviceName">
                                <VList lines="three" density="compact" select-strategy="classic">
                                    <VListheader>
                                        <VIcon icon="ri-service-line" class="mt-2" /> {{ serviceName }}
                                    </VListheader>

                                    <VListItem v-for="report in reports" :key="report.id">
                                        <template #prepend="{ isActive }">
                                            <VListItemAction start>
                                                <VIcon icon="ri-checkbox-blank-circle-line" class="mt-2" />
                                            </VListItemAction>
                                        </template>

                                        <VListItemTitle>วันที่คาดหวังส่งงาน : {{ formatDate_notime(report.draft_date) }}
                                        </VListItemTitle>
                                        <VListItemSubtitle>รายละเอียดคอมเมนท์ในงาน : {{ report.comment }}
                                        </VListItemSubtitle>
                                    </VListItem>
                                </VList>
                                <VDivider />
                            </div>
                        </v-card-text>
                        
                    </v-card>
                </v-timeline-item>
            </v-timeline>
            
        </VCol>
    </VRow>
</template>