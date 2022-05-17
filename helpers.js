export function Goto(path) {
  if (path) {
    window.location.assign(path)
  }
}

export function LocalGet(key) {
  if (typeof window) {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key)
    }
  }
  return null
}

export function LocalSet(key, value) {
  localStorage.setItem(key, value)
}