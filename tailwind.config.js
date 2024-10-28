// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',     // Corrected wildcard
    './pages/**/*.{js,ts,jsx,tsx,mdx}',   // Corrected wildcard
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Corrected wildcard

    // If using src directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',     // Corrected wildcard
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
