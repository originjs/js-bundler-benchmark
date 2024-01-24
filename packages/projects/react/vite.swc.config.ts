import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist-vite-swc',
        rollupOptions: {
            input: 'index.html'
        }
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
    },
    css: {
        devSourcemap: true,
    },
    cacheDir: 'node_modules/.vite-swc'
})
