import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true, // This makes the server accessible on your local network
    port: 3000, // You can specify the port here, change 3000 to any other if needed
  },
  plugins: [react()],
})
