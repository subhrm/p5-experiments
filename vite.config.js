import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                particleClick: resolve(__dirname, 'src/experiments/particle-click/index.html'),
                flowField: resolve(__dirname, 'src/experiments/flow-field/index.html'),
                lorenzAttractor: resolve(__dirname, 'src/experiments/lorenz-attractor/index.html')
            }
        }
    },
    server: {
        open: true
    }
});
