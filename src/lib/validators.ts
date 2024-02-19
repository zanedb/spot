// E.164 = +12345678910
export const isE164PhoneNumber = (input: string) => {
  return /^\+[1-9]\d{1,14}$/.test(input)
}

// i.e. `111111`
export const isValidSmsCode = (input: string) => {
  return /^\d{6}$/.test(input)
}

// 1-30 chars alphanumeric + _
export const isValidUsername = (input: string) => {
  return /^[a-zA-Z0-9_]{1,30}$/.test(input)
}
