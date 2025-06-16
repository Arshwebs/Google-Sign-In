// Base URL for API requests
const baseURL = '/api'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt-alt/auth', '@nuxt-alt/http'],

  auth: {
    strategies: {
      google: {
        scheme: 'oauth2',
        token: {
          property: 'accessToken',
          maxAge: 60 * 60 * 24, // 24 hours
          global: true,
        },
        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
          token: '/api/auth/google/token',
          userInfo: false, // userInfo is included in the token response
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID', // Will use env variable if available
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: '',
        user: {
          property: 'user',
          autoFetch: false, // No separate fetch needed
        },
      },
    },
    redirect: {
      login: '/',
      logout: '/',
      callback: '/dashboard',
      home: '/dashboard',
    },
  },
  
  http: {
    baseURL,
    credentials: 'same-origin',
    browserBaseURL: baseURL,
  },
  
  // Required for Nitro server
  nitro: {
    preset: 'node-server'
  },
})