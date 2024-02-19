import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { isEmpty } from 'lodash'
import { isValidUsername } from '@/lib/validators'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const urlParams = url.searchParams

  // Validate username format
  const username = urlParams.get('username')
  if (isEmpty(username) || !isValidUsername(username ?? ''))
    return NextResponse.json({ error: 'invalid username' }, { status: 400 })

  try {
    // Search db
    const user = await prisma.user.findUnique({
      where: {
        username: username as string,
      },
    })

    // Return
    return NextResponse.json(
      { isAvailable: user === null, username: username },
      { status: 200 }
    )
  } catch (e) {
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }
}
