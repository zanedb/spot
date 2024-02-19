import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { pick } from 'lodash'
import { isValidUsername } from '@/lib/validators'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const id = requestHeaders.get('x-authorized-id')

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  })

  return NextResponse.json(user, { status: 200 })
}

export async function POST(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const id = requestHeaders.get('x-authorized-id')

  const body = await request.json()
  const data = pick(body, ['name', 'username']) // only allow certain params through

  if (!isValidUsername(data.username))
    return NextResponse.json({ error: 'invalid username' }, { status: 400 })

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data,
  })

  return NextResponse.json(user, { status: 200 })
}
