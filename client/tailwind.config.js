/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#030303',
                foreground: '#fafafa',
                primary: {
                    DEFAULT: '#3b82f6',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#1f2937',
                    foreground: '#fafafa',
                },
                accent: {
                    DEFAULT: '#1f2937',
                    foreground: '#fafafa',
                },
                muted: {
                    DEFAULT: '#1f2937',
                    foreground: '#a1a1aa',
                },
                border: '#1f2937',
            }
        },
    },
    plugins: [],
}
