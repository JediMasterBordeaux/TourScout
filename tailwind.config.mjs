/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        reveal: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(50px)',
            filter: 'brightness(0.5)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
            filter: 'brightness(1)'
          }
        },
        pulse: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.15 }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        reveal: 'reveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 150, 255, 0.15)'
      }
    }
  },
  plugins: []
} 