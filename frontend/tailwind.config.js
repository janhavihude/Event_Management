/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* The Authentic Brief — cream #fdf5df */
        cream: '#fdf5df',
        /* Teal #5ebec4 — primary brand */
        primary: {
          50: '#f0fafb',
          100: '#d9f2f4',
          200: '#b5e5ea',
          300: '#8ad5dc',
          400: '#6ec9d0',
          500: '#5ebec4',
          600: '#4aa5ab',
          700: '#3d868b',
          800: '#356d71',
          900: '#2f5a5e',
          950: '#1c383b',
        },
        /* Pink #f92c85 — accent / CTAs */
        accent: {
          50: '#fef1f7',
          100: '#fde4f0',
          200: '#fcc9e2',
          300: '#fa9cc9',
          400: '#f75fa8',
          500: '#f92c85',
          600: '#e8186d',
          700: '#ca0f58',
          800: '#a71049',
          900: '#8b1240',
          950: '#550422',
        },
        /* Warm cream neutrals */
        neutral: {
          50: '#fdf5df',
          100: '#f9ecd0',
          200: '#f3e2bc',
          300: '#e8d4a4',
          400: '#c9b48e',
          500: '#a89472',
          600: '#8a7760',
          700: '#6d5e4d',
          800: '#4f4539',
          900: '#352e26',
        },
        secondary: {
          50: '#fdf5df',
          100: '#f9ecd0',
          200: '#f3e2bc',
          300: '#e8d4a4',
          400: '#c9b48e',
          500: '#a89472',
          600: '#8a7760',
          700: '#6d5e4d',
          800: '#4f4539',
          900: '#352e26',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient':
          'radial-gradient(at 30% 20%, rgba(94,190,196,0.18) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(249,44,133,0.12) 0px, transparent 50%), radial-gradient(at 10% 80%, rgba(253,245,223,0.6) 0px, transparent 50%)',
        'hero-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235ebec4' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'brand-gradient': 'linear-gradient(135deg, #5ebec4 0%, #f92c85 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-15px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseGlow: { '0%, 100%': { opacity: '0.35', transform: 'scale(1)' }, '50%': { opacity: '0.65', transform: 'scale(1.04)' } },
        gradientShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
