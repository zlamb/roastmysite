/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
          './pages/**/*.{js,ts,jsx,tsx,mdx}',
          './components/**/*.{js,ts,jsx,tsx,mdx}',
          './app/**/*.{js,ts,jsx,tsx,mdx}',
        ],
    theme: {
          extend: {
                  colors: {
                            fire: {
                                        50: '#fff7ed',
                                        100: '#ffedd5',
                                        200: '#fed7aa',
                                        300: '#fdba74',
                                        400: '#fb923c',
                                        500: '#f97316',
                                        600: '#ea580c',
                                        700: '#c2410c',
                                        800: '#9a3412',
                                        900: '#7c2d12',
                            }
                  },
                  animation: {
                            'flame': 'flame 1.5s ease-in-out infinite',
                            'score-reveal': 'scoreReveal 1s ease-out forwards',
                  },
                  keyframes: {
                            flame: {
                                        '0%, 100%': { transform: 'scaleY(1) translateY(0)' },
                                        '50%': { transform: 'scaleY(1.1) translateY(-2px)' },
                            },
                            scoreReveal: {
                                        '0%': { transform: 'scale(0)', opacity: '0' },
                                        '50%': { transform: 'scale(1.2)' },
                                        '100%': { transform: 'scale(1)', opacity: '1' },
                            }
                  }
          },
    },
    plugins: [],
}
