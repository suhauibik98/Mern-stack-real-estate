import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
       '/api':{
        target: 'http://10.10.30.30:5000',
        secure:false
       }
    }
  },
});
