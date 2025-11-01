import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // If repo is <username>.github.io, use base: '/'
  // Else use '/<repo-name>/'
  base: '/secretwall/'
});
