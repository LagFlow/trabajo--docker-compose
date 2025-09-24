/// <reference types="vite/client" />
export {}

declare global {
  interface Window {
    _env_: {
      VITE_BACKEND?: string
    }
  }
}