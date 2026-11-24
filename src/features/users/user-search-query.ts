export function normalizeUserQuery(value: string) {
  return value.trim().replace(/^(?:@\s*)+/, '')
}

export function isValidUserQuery(query: string) {
  const length = [...query].length
  return length >= 2 && length <= 100
}
