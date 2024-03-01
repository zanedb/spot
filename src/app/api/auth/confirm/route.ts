import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { isEmpty } from 'lodash'
import { isE164PhoneNumber, isValidSmsCode } from '@/lib/validators'

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_ID,
  JWT_SECRET,
  FICTIONAL_NUMBER,
  FICTIONAL_CODE,
} = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const body = await request.json()

  const number = body.number
  if (isEmpty(number) || !isE164PhoneNumber(number))
    return NextResponse.json({ error: 'invalid number' }, { status: 400 })

  const code = body.code
  if (isEmpty(code) || !isValidSmsCode(code))
    return NextResponse.json({ error: 'invalid code' }, { status: 400 })

  // Fictional number support (App Store review process)
  if (number === FICTIONAL_NUMBER && code === FICTIONAL_CODE) {
    const token = await generateToken(number)
    return NextResponse.json({ authorization: token }, { status: 200 })
  }

  try {
    const verification = await client.verify.v2
      .services(TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: number,
        code,
      })

    if (verification.status === 'approved') {
      const token = await generateToken(number)
      return NextResponse.json({ authorization: token }, { status: 200 })
    } else {
      return NextResponse.json({}, { status: 401 })
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'verification error' },
      { status: err.status }
    )
  }
}

async function generateToken(number: string) {
  // Update or create user
  const user = await prisma.user.upsert({
    where: {
      phone: number,
    },
    update: {},
    create: {
      phone: number,
    },
  })

  // Generate JWT based on id + phone
  const token = sign(
    {
      id: user.id,
      phone: user.phone,
    },
    JWT_SECRET as string,
    { expiresIn: '365d' }
  )

  return token
}
