# spot

backend for [Spotifriend](https://github.com/zanedb/spotifriend)

## setup

create a `.env` file containing the following:

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SERVICE_ID=
DATABASE_URL=
JWT_SECRET=
FICTIONAL_NUMBER=
FICTIONAL_CODE=
```

## fictional numbers

per the App Store review process, we'll need to include a fictional number + code combo. this can be defined in `.env` (E.164 format) and will bypass the twilio verify call.

## api spec

**ROOT** https://spot.zane.app/api

### POST `/auth/phone`

body must include `{"number":"+12345678910"}`. using E.164 format.

if sms successfully sent, will return `200`. else corresponding error code and body: `{"error":"invalid number"}`

### POST `/auth/confirm`

body must include `{"number":"+12345678910","code":"123456"}`

if code is correct, will return `200` + body containing bearer token (i.e. `{"authorization":"..."}`). this token must be included on all future authorized requests.

### GET `/users/me`

must include authorization. if successful, will return user object:

```
{
  "id": "1",
  "username": "att",
  "phone": "+12345678910",
  "name": "Atticus Fletcher"
}
```

### POST `/users/me`

must include authorization. include a body with one or both of `username`/`name` values. if successful, will return updated user object.

### GET `/users/lookup?username=att`

must include authorization. example response:

```
{
  "isAvailable": false,
  "username": "att"
}
```
