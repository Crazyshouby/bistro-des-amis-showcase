
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Updated Bistro des Amis custom colors
				bistro: {
					'brick': '#6B2D2D', // Bordeaux chaleureux
					'brick-light': '#823636',
					'sand': '#F5E9D7', // Beige crème
					'sand-light': '#FFF8E7',
					'wood': '#3A2E1F', // Marron foncé
					'wood-light': '#5A4B37',
					'olive': '#4A5E3A', // Vert olive profond
					'olive-light': '#5F7946',
				}
			},
			fontFamily: {
				'playfair': ['"Playfair Display"', 'serif'],
				'montserrat': ['Montserrat', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in-up': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					},
				},
				'image-shine': {
					'0%': {
						'background-position': '200% 0'
					},
					'100%': {
						'background-position': '-200% 0'
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'image-shine': 'image-shine 3s ease infinite'
			},
			backgroundImage: {
				'texture-light': "url('data:image/png;base64,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')",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
