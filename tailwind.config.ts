import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EDFAF0',
          100: '#D4F5DC',
          200: '#A8EBB9',
          300: '#6FD98A',
          400: '#3CC460',
          500: '#1FA845',
          600: '#168937',
          700: '#116B2C',
          800: '#0D5122',
          900: '#083618',
          950: '#041C0C',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        earth: '#8B6F47',
        canvas: '#FAFAF8',
        ink: '#0D1F12',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 2s ease-out forwards',
        'border-spin': 'borderSpin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-green': 'radial-gradient(at 40% 20%, #116B2C 0px, transparent 50%), radial-gradient(at 80% 0%, #0D5122 0px, transparent 50%), radial-gradient(at 0% 50%, #083618 0px, transparent 50%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 40px rgba(31, 168, 69, 0.25)',
        'glow-amber': '0 0 40px rgba(245, 158, 11, 0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.1)',
        'elevated': '0 20px 60px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
