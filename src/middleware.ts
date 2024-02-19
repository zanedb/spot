import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import * as jose from 'jose'

const { JWT_SECRET } = process.env

export async function middleware(request: NextRequest) {
  // Basic validation
  const authorization = request.headers.get('Authorization')
  if (!authorization || isEmpty(authorization))
    return NextResponse.json(
      { error: 'missing authorization' },
      { status: 401 }
    )

  // Bearer token
  const token = authorization.split(' ')[1]
  try {
    // Decode JWT
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )

    // Add JWT to headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-authorized-id', payload.id as string)

    // Continue on..
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (e) {
    // Unauthorized
    return NextResponse.json({}, { status: 401 })
  }
}

// Define which routes are authenticated
export const config = {
  matcher: '/api/users/:path*',
}
