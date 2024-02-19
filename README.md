# spot

backend for [Spotifriend](https://github.com/zanedb/spotifriend)

## .env

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SERVICE_ID=
DATABASE_URL=
JWT_SECRET=
```

## api spec

**ROOT** https://spot.zane.app/api

### POST `/auth/phone`

body must include `{"number":"+12345678910"}`. using E.164 format.

if sms successfully sent, will return `200`. else corresponding error code and body: `{"error":"invalid number"}`

### POST `/auth/confirm`

body must include `{"code":"123456"}`

if code is correct, will return `200` + body containing bearer token (i.e. `{"authorization":"..."}`). this token must be included on all future authorized requests.

### GET `/users/me`

must include authorization. if successful, will return user object:

```
{
  "id": "1",
  "username": "..",
  "phone": "+12345678910",
  "name": "Atticus Fletcher"
}
```

### POST `/users/me`

must include authorization. include a body with one or both of `username`/`name` values. if successful, will return updated user object.
