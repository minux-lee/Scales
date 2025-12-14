import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/Scales/",
  server: {
    headers: {
      // SharedArrayBuffer 사용을 위한 보안 헤더 (WebChucK 필수)
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },
  optimizeDeps: {
    exclude: ['webchuck'] // WASM 모듈 최적화 제외 설정
  }
});