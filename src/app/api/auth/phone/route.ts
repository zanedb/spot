import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { isE164PhoneNumber } from '@/lib/validators'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_ID
const client = require('twilio')(accountSid, authToken)

export async function POST(request: NextRequest) {
  const body = await request.json()

  const number = body.number
  if (isEmpty(number) || !isE164PhoneNumber(number))
    return NextResponse.json({ error: 'invalid format' }, { status: 400 })

  const lookup = await client.lookups.v2.phoneNumbers(number).fetch()
  if (!lookup.valid)
    return NextResponse.json({ error: 'invalid number' }, { status: 400 })

  // TODO: some form of rate limiting
  // either require it to be in the db already (limited to existing users)
  // allow a max number of requests per second per ip (not sure how)
  // or something similar
  // maybe require sid on confirmation as a security check as well?

  try {
    const verification = await client.verify.v2
      .services(serviceId)
      .verifications.create({ to: lookup.phoneNumber, channel: 'sms' })

    return NextResponse.json({}, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'verification error' },
      { status: err.status }
    )
  }
}
