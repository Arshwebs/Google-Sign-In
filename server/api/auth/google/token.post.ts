import { H3Event } from 'h3'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { GOOGLE_CONFIG, JWT_SECRET_KEY } from '~/server/utils/config'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    console.log('Google token request body:', JSON.stringify(body))

    // Get code and redirect URI from the request body
    const code = body.code
    // Use the redirect URI from the request if available, otherwise use the configured one
    const redirectUri = body.redirect_uri || GOOGLE_CONFIG.REDIRECT_URI
    
    if (!code) {
      throw createError({
        statusCode: 400,
        message: 'Authorization code is required'
      })
    }

    console.log('Exchanging code for tokens with redirect_uri:', redirectUri)

    // Using URLSearchParams format as required by Google OAuth
    const params = new URLSearchParams()
    params.append('code', code)
    params.append('client_id', GOOGLE_CONFIG.CLIENT_ID)
    params.append('client_secret', GOOGLE_CONFIG.CLIENT_SECRET)
    params.append('redirect_uri', redirectUri)
    params.append('grant_type', 'authorization_code')

    let access_token: string

    try {
      const tokenResponse = await axios.post(GOOGLE_CONFIG.TOKEN_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      console.log('Token response received:', tokenResponse.status)

      if (!tokenResponse.data || !tokenResponse.data.access_token) {
        throw createError({
          statusCode: 500,
          message: 'Failed to get access token from Google'
        })
      }

      access_token = tokenResponse.data.access_token
    } catch (tokenError: any) {
      console.error('Google token exchange error:', tokenError.message)
      if (tokenError.response) {
        console.error('Response data:', JSON.stringify(tokenError.response.data))
        console.error('Response status:', tokenError.response.status)
      }

      throw createError({
        statusCode: 400,
        message: 'Failed to exchange authorization code for tokens',
        data: tokenError.response?.data || tokenError.message
      })
    }

    // Get user info using the access token
    const userInfoResponse = await axios.get(GOOGLE_CONFIG.USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const userInfo = userInfoResponse.data
    const email = userInfo.email
    const name = userInfo.name || ''
    const picture = userInfo.picture || ''

    // Optional: Verify the domain if needed
    // if (!email.endsWith('@yourdomain.com')) {
    //   throw createError({
    //     statusCode: 403,
    //     message: 'Only organization accounts are allowed'
    //   })
    // }

    // Create payload for JWT with Google user info
    const payload = {
      sub: userInfo.sub, // Google's unique identifier
      email,
      name,
      picture
    }

    // Create a JWT token
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' })

    // Return the token and user info
    return {
      success: true,
      accessToken: token,
      user: {
        email,
        name,
        picture
      }
    }
  } catch (error: any) {
    console.error('Google authentication error:', error)
    
    // If error was already created with createError, it will be forwarded automatically
    if (!error.statusCode) {
      throw createError({
        statusCode: 500,
        message: 'Error authenticating with Google'
      })
    }
    
    throw error
  }
})
