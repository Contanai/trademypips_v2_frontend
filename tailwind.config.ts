import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"primary": "#a4e6ff",
				"secondary-container": "#27ff97",
				"on-primary-fixed-variant": "#004e60",
				"on-secondary-fixed-variant": "#00522c",
				"on-surface-variant": "#bbc9cf",
				"outline-variant": "#3c494e",
				"on-tertiary-container": "#414f64",
				"on-tertiary-fixed-variant": "#3a485c",
				"on-primary-fixed": "#001f28",
				"surface-bright": "#3a3939",
				"tertiary-fixed-dim": "#b9c7e0",
				"primary-fixed": "#b7eaff",
				"surface": "#131313",
				"inverse-primary": "#00677f",
				"on-secondary": "#00391d",
				"surface-container": "#201f1f",
				"on-surface": "#e5e2e1",
				"primary-fixed-dim": "#4cd6ff",
				"tertiary-container": "#b3c1da",
				"primary-container": "#00d1ff",
				"error-container": "#93000a",
				"on-primary": "#003543",
				"tertiary-fixed": "#d5e3fd",
				"surface-container-highest": "#353534",
				"inverse-surface": "#e5e2e1",
				"on-secondary-fixed": "#00210e",
				"secondary": "#f5fff3",
				"on-error-container": "#ffdad6",
				"on-error": "#690005",
				"surface-container-lowest": "#0e0e0e",
				"on-tertiary": "#233144",
				"secondary-fixed": "#5bffa1",
				"surface-dim": "#131313",
				"on-tertiary-fixed": "#0d1c2f",
				"on-background": "#e5e2e1",
				"surface-container-low": "#1c1b1b",
				"error": "#ffb4ab",
				"on-secondary-container": "#00723f",
				"tertiary": "#ceddf6",
				"surface-container-high": "#2a2a2a",
				"inverse-on-surface": "#313030",
				"on-primary-container": "#00566a",
				"secondary-fixed-dim": "#00e383",
				"surface-tint": "#4cd6ff",
				"surface-variant": "#353534",
				"outline": "#859399",
				"background": "#131313"
			},
			fontFamily: {
				"headline": ["Space Grotesk", "sans-serif"],
				"body": ["Inter", "sans-serif"],
				"label": ["Inter", "sans-serif"]
			},
			borderRadius: {
				"DEFAULT": "0.125rem",
				"lg": "0.25rem",
				"xl": "0.5rem",
				"full": "0.75rem"
			},
			keyframes: {
				pulse: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: ".5" },
				},
			},
			animation: {
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
		},
	},
	plugins: [animate],
} satisfies Config;
