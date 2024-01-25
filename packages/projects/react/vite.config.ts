import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist-vite',
        rollupOptions:{
            input:"index.html"
        }
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
    },
    css: {
        devSourcemap: true,
    },
})
