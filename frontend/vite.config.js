import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "node:path";
import {visualizer} from 'rollup-plugin-visualizer'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')

    console.log('🔧 Building for mode:', mode)
    console.log('🌐 API Base URL:', env.VITE_API_BASE_URL)
    console.log('🏠 Frontend URL:', env.VITE_FRONTEND_URL)

    return {
        plugins: [
            vue(),
            visualizer({
                open: true,
                gzipSize: true,
                brotliSize: true,
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        base: '/',

        build: {
            manifest: true,
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name]-[hash].js`,
                    chunkFileNames: `assets/[name]-[hash].js`,
                    assetFileNames: `assets/[name]-[hash].[ext]`
                }
            }
        },

        server: {
            port: 5173,
            strictPort: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:4000',
                    changeOrigin: true,
                },
                '/uploads': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:4000',
                    changeOrigin: true,
                }
            }
        }
    }
})
