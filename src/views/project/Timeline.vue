<script setup>
import Cookies from 'js-cookie';
import services from '@/services';
import { useAccountStore } from '@/plugins/store';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { formatDate_notime } from '@/plugins/function.js';
import ReportById from '@/views/project/ReportById.vue'

const store = useAccountStore();
const newToken = store.decryptData(Cookies.get('wataservices_token'));
let auth = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + newToken,
    },
};
const router = useRouter()
const overlay = ref(true);
const data = ref([]);
const grouped = ref({});
const myReportByIdRef = ref(null)
onMounted(async () => {
    await getdataTimeline();
});

const getdataTimeline = async () => {
    try {
        overlay.value = true;
        const response = await services.projectTimeline(auth);
       // console.log(response);
        if (response.data.status === 'Successful') {
            data.value = response.data.data;
            await groupedReports();
            overlay.value = false;
        }
    } catch (error) {
        overlay.value = false;
      //  console.log(error)
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
};

const groupedReports = async () => {
    const tempGrouped = {};

    data.value.forEach((item) => {
        item.services.forEach((service) => {
            service.reports.forEach((report) => {
                if (!tempGrouped[report.expected]) {
                    tempGrouped[report.expected] = {};
                }
                if (!tempGrouped[report.expected][item.name]) {
                    tempGrouped[report.expected][item.name] = { id: item.id, services: {} };
                }
                if (!tempGrouped[report.expected][item.name].services[service.name]) {
                    tempGrouped[report.expected][item.name].services[service.name] = [];
                }
                tempGrouped[report.expected][item.name].services[service.name].push({
                    id: report.id,
                    draft_date: report.draft_date,
                    comment: report.comment,
                });
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
const showDetailReport = async (report_id) => {
    if (myReportByIdRef.value) {
        const result = await myReportByIdRef.value.showDialog({
            report_id,
            auth
        })
       // console.log(result) 
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
    <VRow>
        <VCol cols="12">
            <h1>Timeline </h1>
        </VCol>
    </VRow>
    <v-timeline v-if="data.length>0">
        <v-timeline-item size="large" v-for="(projects, expected) in grouped" :key="expected" dot-color="primary">
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
                                <template #append>
                                    <VBtn @click="showDetailReport(report.id)" variant="text" color="primary"
                                        icon="ri-article-line" />
                                </template>
                            </VListItem>
                        </VList>
                        <VDivider />
                    </div>
                </v-card-text>
                <!-- <VCardText class="text-center">
                    <v-btn :to="`/project-report/${project.id}`" class="mx-2" color="primary" size="small">
                        <VIcon start icon="ri-article-line" /> report
                    </v-btn>

                </VCardText> -->
            </v-card>
        </v-timeline-item>
    </v-timeline>
    <VRow v-else class="text-center">
        <VCol cols="12">
            <h3></h3>
            <v-alert border="start" color="deep-primary-accent-4" variant="tonal">
                <template v-slot:title>
                    ไม่มีข้อมูล
                </template>

            </v-alert>
        </VCol>
    </VRow>
    <ReportById ref="myReportByIdRef" />
</template>
