<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAccountStore } from '@/plugins/store';
const store = useAccountStore();
import { useRouter } from 'vue-router'
 const router = useRouter()

onMounted(async () => {
  await logout()


})
const logout =async () =>{
    const newToken = store.decryptData(Cookies.get('wataservices_token'));
   try {
    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://wata-api.sawasdeehub.tech/api/logout',
  headers: { 
    'Accept': 'application/json', 
    'Authorization': 'Bearer '+newToken
  },
 
};

axios.request(config)
.then((response) => {
 Cookies.remove('wataservices_token')
 router.push(`signin`)
})
.catch((error) => {
  console.log(error);
});

   } catch (error) {
      console.log(error)
   }
}

</script>
<template>
    <div>
        Logout
    </div>
</template>