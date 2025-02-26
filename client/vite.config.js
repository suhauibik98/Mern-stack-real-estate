import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
export default defineConfig({
  plugins: [react()],
  server: {
    host:"192.168.1.124",
    // proxy:{
    //    '/api':{
    //     target: 'http://10.10.30.30:5000',
    //     secure:false
    //    }
    // }
  },
 
});
// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
