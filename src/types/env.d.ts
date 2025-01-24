/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BITCOIN_COST_WS_URL: string
    readonly VITE_SENTRY_DSN: string
    readonly VITE_SENTRY_AUTH_TOKEN: string
    readonly VITE_SENTRY_ORG: string
    readonly VITE_SENTRY_PROJECT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}