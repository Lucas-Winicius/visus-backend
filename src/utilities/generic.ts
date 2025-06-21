export const capitalize = (text: string) =>
  text
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export const title = (text: string) => {
  const [first, ...rest] = text.trim().split(' ')
  return [
    first.charAt(0).toUpperCase() + first.slice(1).toLowerCase(),
    ...rest,
  ].join(' ')
}

export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/[-_]+/g, '-')
    .replace(/^-+|-+$/g, '')