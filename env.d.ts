/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BITCOIN_COST_WS_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}