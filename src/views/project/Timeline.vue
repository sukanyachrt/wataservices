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
onMounted(async () => {
    await getdataTimeline()
   
})

const getdataTimeline = async () => {
    try {
        const response = await services.projectTimeline(auth);
        console.log(response)
        if(response.data.status==="Successful"){

        }
    } catch (error) {
        console.log(error)
    }
}

</script>
<template>
    <div>
        Timeline
    </div>
</template>