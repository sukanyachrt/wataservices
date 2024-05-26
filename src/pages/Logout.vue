<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAccountStore } from '@/plugins/store';
const store = useAccountStore();
import { useRouter } from 'vue-router'
const router = useRouter()
const overlay=ref(true)
onMounted(async () => {
  await logout()


})
const logout = async () => {
  const newToken = store.decryptData(Cookies.get('wataservices_token'));
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://wata-api.sawasdeehub.tech/api/logout',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + newToken
      },

    };

    axios.request(config)
      .then((response) => {
        Cookies.remove('wataservices_token')
        router.push(`signin`)
      })
      .catch((error) => {
        console.log(error);
        router.push(`signin`)
        Cookies.remove('wataservices_token')
      });

  } catch (error) {
    router.push(`signin`)
    console.log(error)
    Cookies.remove('wataservices_token')
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
</template>