import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    // preview dijalankan di host lain (bukan localhost) → izinkan semua host
    allowedHosts: true as true,
  },
  build: {
    rollupOptions: {
      output: {
        // vendor dipisah supaya cache React/GSAP tidak batal tiap kali kode situs berubah
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/'))
            return 'vendor-react';
          if (id.includes('/gsap/')) return 'vendor-gsap';
          if (id.includes('/lenis/')) return 'vendor-lenis';
          return 'vendor-misc';
        },
      },
    },
  },
});
