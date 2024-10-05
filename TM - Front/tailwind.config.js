
/** @type {import('tailwindcss').Config} */

export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custombgBlue: '#97B8D2',
        custombgPink: '#C69BB2',
        custombgpink2: '#EDD4DD',
        customBlack:'#332F30',
        customGrey: '#585C60',
        custombgpink3: '#FFF5F8',
        custombgBlue2: '#ABC7DD',
        custombgpink4: '#FFE3ED',
        customBrown: '#493838',
        custombgPink5: '#FFEEF3',
        customDarkBlue: '#253439',
        customGreyBrown: '#595551',
        customWhite:'#f6f4f1',
        customBlackBlue: '#101f24',
        customAlternativeBlue: '#96aed1',
        customWeakBlue: '#c9eeff',
        customWeakestBlue: '#edf9ff'
 
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      fontFamily: {
        brastika: ['Brastika', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

