import path from "path"
import { defineConfig } from "vite"
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server:{
    proxy:{
      "/api":{
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      }
    }
  }
})