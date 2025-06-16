<template>
  <div class="p-8">
    <div class="mb-8 text-center">
      <h1 class="mb-4 text-3xl font-bold">Welcome to Dashboard</h1>
      <p class="text-gray-600">You are successfully authenticated with Google</p>
    </div>
    
    <div class="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <div class="flex items-center mb-6">
        <div v-if="$auth.user && $auth.user.picture" class="mr-4">
          <img 
            :src="$auth.user.picture" 
            alt="Profile Picture" 
            class="w-16 h-16 rounded-full"
          />
        </div>
        <div>
          <h2 class="text-2xl font-semibold">{{ $auth.user?.name || 'User' }}</h2>
          <p class="text-gray-600">{{ $auth.user?.email || 'No email available' }}</p>
        </div>
      </div>
      
      <div class="border-t pt-4">
        <h3 class="mb-2 font-medium">Account Details:</h3>
        <pre class="bg-gray-100 p-3 rounded overflow-auto text-xs">{{ JSON.stringify(userDetails, null, 2) }}</pre>
      </div>
      
      <div class="mt-6 text-center">
        <button 
          @click="logout" 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-undef
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

export default {
  name: 'DashboardPage',
  data() {
    return {
      userDetails: null
    }
  },
  mounted() {
    // Get the user details from auth
    this.userDetails = this.$auth.user
    
    // Check if we need to redirect due to auth problems
    if (!this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>
