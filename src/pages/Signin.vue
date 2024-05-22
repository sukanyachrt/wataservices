<script setup>
import Cookies from 'js-cookie'
import services from '@/services'
import { useAccountStore } from '@/plugins/store';
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useAccountStore()
import logo from '@images/logo.svg?raw'
const form = {
  email: '',
  password: '',
  remember: false,
}

const formRef = ref(null)
const formSignin = ref(structuredClone(form))
const isPasswordVisible = ref(false)
const Signin = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
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
        expirationDate.setTime(expirationDate.getTime() + 1 * 60 * 60 * 1000)
        Cookies.set('wataservices_token', newToken, {
          expires: expirationDate,
        });
        router.push(`dashboard`)

      } else {
        Swal.fire({
          text: response.data.status,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
      
    } catch (error) {

      Swal.fire({
        title: error.response.data.status,
        text: error.response.data.message,
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
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> ata Services </VCardTitle>
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

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox v-model="formSignin.remember" label="Remember me" />

                <a class="ms-2 mb-1" href="javascript:void(0)">
                  Forgot Password?
                </a>
              </div>

              <VBtn block @click="Signin()">
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
