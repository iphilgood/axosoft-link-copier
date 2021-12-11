import { resolve } from 'path';
import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  darkMode: 'class',
  // https://windicss.org/posts/v30.html#attributify-mode
  attributify: true,
  extract: { include: [resolve(__dirname, 'src/**/*.{vue,html}')] },
  theme: {
    extend: {
      colors: {
        'axo-dark': '#1c2933',
        'axo-icon': '#607a8a',
        'axo-gray': '#d7e0e0',
      },
    },
  },
});
