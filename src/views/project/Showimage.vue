<script setup>
const overlay = ref(false)
const dialogVisible = ref(false)
const Image = ref('');
const resolvePromise = ref()
const rejectPromise = ref()
const showDialog = async data => {
    dialogVisible.value = true;
    console.log(data)
    Image.value = data.image
    return new Promise((resolve, reject) => {
        resolvePromise.value = () => {
            resolve(true)
            dialogVisible.value = false
        }

        rejectPromise.value = () => {
            resolve(false)
            dialogVisible.value = false
        }
    })
}
defineExpose({ showDialog })
</script>
<template>
    <VDialog transition="dialog-top-transition" width="500" v-model="dialogVisible">
        <div class="text-center">
            <v-overlay v-model="overlay" persistent class="align-center justify-center">
                <v-progress-circular :size="90" :width="6" color="primary" indeterminate>
                    <template v-slot:default>
                        <span class="text-white"> Loading </span>
                    </template>
                </v-progress-circular>
            </v-overlay>

        </div>

        <div class="d-flex justify-space-around align-center bg-grey-lighten-4">
            <div>
                <v-img :aspect-ratio="1" class="bg-white" :src="Image"
                    width="500" ></v-img>
            </div>
        </div>

    </VDialog>

</template>