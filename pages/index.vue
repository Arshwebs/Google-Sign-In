<template>
  <div class="flex justify-center items-center w-full h-screen">
    <div class="flex flex-col p-10 space-y-5 w-full bg-white md:w-2/5">
      <div class="text-center">
        <div class="text-4xl font-bold">Login</div>
        <div class="mt-2 font-medium text-gray-400">Welcome</div>
      </div>

      <!-- Organization SSO button -->
      <div class="mt-6">
        <button
          class="flex justify-center items-center px-4 py-4 w-full text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
          @click="loginWithGoogle()"
        >
          <svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c5.523 0 10-4.478 10-10 0-0.669-0.068-1.325-0.195-1.958h-9.805z"
            ></path>
          </svg>
          Sign in with Google account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
// eslint-disable-next-line no-undef
definePageMeta({ layout: 'default' })
export default {
  name: 'LoginPage',
  data() {
    return {
      toast: useToast(),
    }
  },
  mounted() {},
  methods: {
    async loginWithGoogle() {
      try {
        const res = await this.$auth.loginWith('google')
        console.log(res)
      } catch (error) {
        console.error('SSO login error:', error)
        this.toast.error('Failed to authenticate with organization account')
      }
    },
  },
}
</script>
