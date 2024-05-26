<template>
    <v-app>
        <v-container>
            <v-autocomplete v-model="selectedItem" :items="autocompleteItems" label="Select or type" item-title="name"
                item-value="id" >
                <template #no-data>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title v-if="selectedItem !== 'Add new'" @click="test">ไม่มีข้อมูลที่ต้องการ
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
                <v-card>
                    <v-card-title>เพิ่มข้อมูลลูกค้า</v-card-title>
                    <VDivider />
                    <v-card-text class="mt-4">
                        <VRow class="justify-center align-center">
                            <VCol cols="12">
                                <v-text-field v-model="newItem.firstname" label="ชื่อลูกค้า"></v-text-field>
                            </VCol>
                            <VCol cols="12">
                                <v-text-field v-model="newItem.lastname" label="นามสกุลลูกค้า"></v-text-field>
                            </VCol>
                        </VRow>
                        
                        
                    </v-card-text>
                    <VDivider />
                    <v-card-actions class="justify-center align-center my-2">
                        <VBtn variant="tonal" @click="saveNewItem" class="mx-4">
                            <VIcon size="24" icon="ri-add-line" />
                            บันทึกข้อมูล
                        </VBtn>
                        <VBtn variant="tonal" color="secondary"@click="modalOpen = false" class="mx-4">
                            <VIcon size="24" icon="ri-restart-line" />
                            ยกเลิก
                        </VBtn>
                        
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
const test = () => {
    modalOpen.value = true
}
const selectedItem = ref(null)
const items = ref([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
])

const modalOpen = ref(false)
const newItem = ref({
    firstname: '',
    lastname: ''
})





function saveNewItem() {
    const fullName = `${newItem.value.firstname} ${newItem.value.lastname}`
    items.value.push({ id: items.value.length + 1, name: fullName })
    selectedItem.value = fullName
    modalOpen.value = false
}

const autocompleteItems = computed(() => {
    return items.value
})
</script>