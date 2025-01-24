import { sentryVitePlugin } from '@sentry/vite-plugin';
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_SENTRY_')
    return {
        plugins: [ react(), sentryVitePlugin({
            authToken: env.VITE_SENTRY_AUTH_TOKEN,
            org: env.VITE_SENTRY_ORG,
            project: env.VITE_SENTRY_PROJECT,
        }) ],
        test: {
            globals: true,
            environment: 'jsdom',
            css: false,
            setupFiles: [ './vitest.setup.ts' ],
        },
        build: {
            sourcemap: true
        }
    }
})