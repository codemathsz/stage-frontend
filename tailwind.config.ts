import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
			"./index.html",
			"./src/**/*.{js,ts,jsx,tsx}",
		],
  theme: {
  	extend: {
  		colors:{
				primary: '#002333',
				secondary: '#9197B3',
				background: '#F1F1F1'
			},
			fontFamily:{
				poppins: ['Poppins', 'sans-serif'],
			},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;