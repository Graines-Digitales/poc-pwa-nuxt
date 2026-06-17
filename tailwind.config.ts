import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
