import { defineConfig } from 'vite';
export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    define: {
        __DATA_PATH__: JSON.stringify(process.env.DATA_PATH || './data/')
    }
});
