/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8F6F1',
        card: '#FFFDF9',
        primary: '#6F7D3C',
        'primary-dark': '#5B682D',
        text: '#2F2F2F',
        secondary: '#737373',
        border: '#E7E0D3',
        available: '#10B981', // green-500 equivalent but custom for SaaS
        occupied: '#EF4444',  // red-500 equivalent
        reserved: '#F59E0B',  // amber-500
        selected: '#3B82F6',  // blue-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.05)',
        card: '0 4px 12px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};
