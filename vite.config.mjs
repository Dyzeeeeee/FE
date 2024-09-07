import {
    fileURLToPath,
    URL
} from 'node:url';

import {
    PrimeVueResolver
} from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {
    defineConfig
} from 'vite';
import {
    VitePWA
} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            srcDir: 'src',
            filename: 'sw.js',
            includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'Anahaw',
                short_name: 'Anahaw',
                description: 'Anahaw app',
      start_url: "/auth/welcome",

      background_color: "#289c3c",
      theme_color: '#289c3c',
                icons: [{
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'Sharkcuet.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'Sharkcuet.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        }),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src',
                import.meta.url))
        }
    }
});
