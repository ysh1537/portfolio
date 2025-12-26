import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'docs',
    // 청크 크기 경고 한도 증가 (3D 라이브러리 특성상)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 코어 React
          vendor: ['react', 'react-dom'],
          // Three.js 코어
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          // 후처리 효과 (무거움)
          postprocessing: ['@react-three/postprocessing'],
          // 애니메이션 라이브러리
          animation: ['framer-motion', 'gsap'],
          // 외부 서비스 (필요 시 로드)
          firebase: ['firebase/app', 'firebase/firestore'],
          sanity: ['@sanity/client', '@sanity/image-url'],
          // AI 서비스
          ai: ['@google/generative-ai'],
        },
      },
    },
  },
})

