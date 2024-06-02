<script setup>
import Cookies from 'js-cookie'
import services from '@/services'
import { useAccountStore } from '@/plugins/store';
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useAccountStore()
import logowata from '@images/logowata.png'
import { ref } from 'vue';
const form = {
  email: '',
  password: '',
  remember: false,
}
const overlay = ref(true)
const formRef = ref(null)
const formSignin = ref(structuredClone(form))
const isPasswordVisible = ref(false)
onMounted(async () => {
  const loggedIn =await Cookies.get('wataservices_token')
  if (loggedIn) {
    router.push("/platforms");
  }
  else{
    overlay.value=false
  }
})

const Signin = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
    overlay.value = true
    try {
      let auth = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await services.login(formSignin.value, auth)
      if (response.data.status === 'Successful') {
        
        const expirationDate = new Date()
        const token = response.data.data.token;
        const newToken = await store.encryptAndStoreData(token)
        expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000)
        Cookies.set('wataservices_token', newToken, {
          expires: expirationDate,
        });
        console.log(response.data.data)
        const user = {
          firstname: response.data.data.user.firstname,
          lastname: response.data.data.user.lastname,
          email: response.data.data.user.email,
          image: response.data.data.user.image,
          username: formSignin.value.email,
          password: formSignin.value.password,
          remember: formSignin.value.remember,
          userRole : response.data.data.user.userRole
        }
        overlay.value = false

        const newUser = store.encryptAndStoreData(user)
        store.dataUser = newUser

        router.push(`platforms`)

      } else {
        overlay.value = false
        Swal.fire({
          text: response.data.status,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }

    } catch (error) {
      overlay.value = false
      console.log(error)
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  } else {
    console.log(valid)
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
  <div v-if="overlay===false" class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
           <VAvatar rounded="lg" size="120" :image="logowata" class="mx-4"/>
          </div>
        </template>

       </VCardItem>

      <VCardText class="pt-2 text-center">
        <h5 class="text-h5 font-weight-semibold mb-1">Welcome to Wata Services! 👋🏻</h5>
        <p class="mb-0 text-center">Please sign-in to your account and start the System.</p>
      </VCardText>

      <VCardText>
        <VForm ref="formRef">
          <VRow>
            <!-- email / username-->
            <VCol cols="12">
              <VTextField v-model="formSignin.email" label="Email / Username" type="text"
                :rules="[v => !!v || 'โปรดกรอก Email / Username']" required />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField required :rules="[v => !!v || 'โปรดกรอก Password']" v-model="formSignin.password"
                label="Password" placeholder="············" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />



              <VBtn block @click="Signin()" class="mt-4">
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
.auth-wrapper {
  min-block-size: calc(var(--vh, 1vh) * 100);
}

.auth-card {
  z-index: 1 !important;
}

.auth-footer-start-tree,
.auth-footer-end-tree {
  position: absolute;
  z-index: 1;
}

.auth-footer-start-tree {
  inset-block-end: 0;
  inset-inline-start: 0;
}

.auth-footer-end-tree {
  inset-block-end: 0;
  inset-inline-end: 0;
}

.auth-illustration {
  z-index: 1;
}

.auth-logo {
  position: absolute;
  z-index: 1;
  inset-block-start: 2rem;
  inset-inline-start: 2.3rem;
}

.auth-bg {
  background-color: rgb(var(--v-theme-surface));
}
</style>
