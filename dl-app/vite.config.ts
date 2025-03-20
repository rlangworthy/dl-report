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
    port: 3001,
  },
})
