/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./index.html"],
    theme: {
        extend: {
            colors: {
                "bg-color": "var(--bg-color)",
                fail: "var(--fail)",
                gradient: "var(--gradient)",
                primgreen: "var(--primgreen)",
                primpurple: "var(--primpurple)",
                primyellow: "var(--primyellow)",
                success: "var(--success)",
                texthigh: "var(--texthigh)",
                textlow: "var(--textlow)",
                textmid: "var(--textmid)",
            },
            fontFamily: {
                "body-b": "var(--body-b-font-family)",
                "body-r": "var(--body-r-font-family)",
                "caption-b": "var(--caption-b-font-family)",
                "caption-r": "var(--caption-r-font-family)",
                "heading-b": "var(--heading-b-font-family)",
                "heading-r": "var(--heading-r-font-family)",
                typography: "var(--typography-font-family)",
            },
            screens: {
                xxs: "320px",  // Galaxy S8+
                xs: "440px",   // wide phones
                sm: "640px",   
                md: "768px",
                lg: "1024px",
            },
            animation: {
                'fade-in': 'fade-in 1s ease forwards',
                'fade-up': 'fade-up 1s ease forwards',
                'marquee': 'marquee var(--duration) infinite linear',
                'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
                'shimmer': 'shimmer 8s infinite',
            },
            keyframes: {
                'fade-in': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-10px)',
                    },
                    'to': {
                        opacity: '1',
                        transform: 'none',
                    }
                },
                'fade-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    'to': {
                        opacity: '1',
                        transform: 'none',
                    }
                },
                'shimmer': {
                    '0%, 90%, to': {
                        'background-position': 'calc(-100% - var(--shimmer-width)) 0',
                    },
                    '30%, 60%': {
                        'background-position': 'calc(100% + var(--shimmer-width)) 0',
                    }
                },
                'marquee': {
                    '0%': {
                        transform: 'translate(0)',
                    },
                    'to': {
                        transform: 'translateX(calc(-100% - var(--gap)))',
                    }
                },
                'marquee-vertical': {
                    '0%': {
                        transform: 'translateY(0)',
                    },
                    'to': {
                        transform: 'translateY(calc(-100% - var(--gap)))',
                    }
                }
            }
        },
    },
    plugins: [],
};
