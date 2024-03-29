import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [
        react()
    ], server: {
        port: 5011,
        strictPort: true,
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
    },
    css: {
        devSourcemap: false,
    },
    cacheDir: 'node_modules/.cache-vite-swc',
    build: {
        outDir: 'dist-vite-swc'
    }
});
