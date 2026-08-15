export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        lilac: '#EEEDFE',
        lilacDeep: '#DEDCFA',
        hotpink: '#D4537E',
        hotpinkDark: '#B93F68',
        pinkfill: '#FBEAF0',
        pinktext: '#993556',
        amber: {
          border: '#F0997B',
          text: '#633806',
          fill: '#FDF0E9',
        },
        ink: '#2B2340',
        muted: '#6B6480',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
