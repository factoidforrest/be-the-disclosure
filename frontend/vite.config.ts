import { defineConfig } from 'vite'

import Components from 'unplugin-vue-components/vite';

import vue from '@vitejs/plugin-vue'
// import vuetify from "vite-plugin-vuetify"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
      dirs: ['src/**/*', 'node_modules/primevue/**/*'],
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
