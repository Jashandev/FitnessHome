/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        customYellow: 'rgb(221, 201, 122)',
        customGreen: 'rgb(29, 61, 36)', // Consistent background
      },
      spacing: {
        'sidebar': '220px',
      },
    },
  },
  plugins: [
    // Custom utility for hiding scrollbars
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none', // Hide scrollbar for Firefox
          '-ms-overflow-style': 'none', // IE and Edge
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none', // Hide scrollbar for WebKit-based browsers (Chrome, Safari, etc.)
        },
      });
    },
  ],
};
