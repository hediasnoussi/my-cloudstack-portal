/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Open Sans', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        '19': '4.75rem',
        '64': '16rem',
        '68': '17rem',
        '75': '18.75rem',
      },
      colors: {
        slate: {
          850: '#1e293b',
          750: '#334155',
        },
      },
      zIndex: {
        '990': '990',
      },
      height: {
        'sidenav': 'calc(100vh - 6rem)',
      },
      maxWidth: {
        '64': '16rem',
        '90': '22.5rem',
      },
      width: {
        '4.5': '1.125rem',
        '5.6': '1.4rem',
        '90': '22.5rem',
      },
      transitionProperty: {
        'nav-brand': 'all',
      },
      backgroundSize: {
        '150': '150%',
        '25': '25%',
      },
      backgroundPosition: {
        'x-25': '25%',
      },
      animation: {
        'nav-brand': 'nav-brand 0.15s ease-in-out',
      },
    },
  },
  plugins: [],
}
