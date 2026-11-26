import {emberbox} from '@emberbox/ui/vite'
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'
import {PUBLIC_PATHS} from './src/router/public-paths.ts'

const backend = process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000'

export default defineConfig({
    plugins: [
        vue(),
        emberbox({
            url: 'https://lernkarten.emberbox.app',
            logo: 'lernkarten',
            app: {name: 'Lernkarten', description: 'Taktische Zeichen und Gefahrgut lernen'},
            prerender: {entry: 'src/prerender.ts', paths: [...PUBLIC_PATHS]},
        }),
    ],
    server: {
        proxy: {
            '/api': {target: backend, changeOrigin: true},
        },
    },
})
