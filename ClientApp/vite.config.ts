import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],

    // Absolute base path so routing and asset resolution work on nested page refreshes
    base: '/',
    publicDir: 'public',

    build: {
        outDir: '../wwwroot',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html'),
            output: {
                entryFileNames: 'static/js/[name].[hash].js',
                chunkFileNames: 'static/js/[name].[hash].js',
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name || '';
                    if (name.endsWith('.css')) return 'static/css/[name].[hash][extname]';
                    if (/\.(png|jpe?g|svg|gif|webp|ico)$/.test(name)) return 'static/assets/[name].[hash][extname]';
                    if (/\.(woff|woff2|ttf|eot)$/.test(name)) return 'static/fonts/[name].[hash][extname]';
                    return 'static/assets/[name].[hash][extname]';
                },
            },
        },
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});