import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports:true
    })
  ],
  resolve: {
    alias: {
      
    }
  },
  server: {
    port: 3000,
  },
  base: "https://co-ps-chavez-sites-w02.cps.k12.il.us/dl-scheduling"
})