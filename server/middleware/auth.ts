import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../utils/config'

export default defineEventHandler(async (event: H3Event) => {
  const path = getRequestURL(event).pathname
  
  // Skip authentication for all public routes
  const publicRoutes = [
    '/',                    // Login page
    '/login',               // Login page alternative path
    '/api/auth/google',     // Google OAuth endpoints
    '/_nuxt',               // Nuxt assets
    '/favicon.ico',         // Favicon
    '/api/_content',        // Content API (if used)
  ]
  
  // Check if the current path starts with any public route prefix
  if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    return
  }

  // For API requests, check for Authorization header
  if (path.startsWith('/api/')) {
    try {
      // Get token from header
      const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')
      if (!token) {
        return createError({
          statusCode: 401,
          message: 'Unauthorized: No token provided'
        })
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET_KEY)
      
      // Add user info to the event context
      event.context.user = decoded
    } catch (err) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized: Invalid token'
      })
    }
  } else {
    // For page routes, we'll let the client-side auth middleware handle protection
    // This prevents 401 errors when directly accessing protected pages
    return
  }
})
