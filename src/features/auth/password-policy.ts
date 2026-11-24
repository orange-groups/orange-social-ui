// Keep this aligned with the backend NewPasswordPolicy validator.
const PASSWORD_PATTERN = /^(?=[^\r\n]*\p{L})(?=[^\r\n]*\p{Nd})(?=[^\r\n]*[\p{P}\p{S}])[^\r\n]{8,128}$/u

export function isValidNewPassword(password: string): boolean {
  return PASSWORD_PATTERN.test(password)
}
