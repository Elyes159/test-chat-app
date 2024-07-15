import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Ajouter des tailles personnalisées dans `theme.extend`
      width: {
        '1/5': '20%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        '1/7': '14.285714%',
        '2/7': '28.571429%',
        '3/7': '42.857143%',
        '4/7': '57.142857%',
        '5/7': '71.428571%',
        '6/7': '85.714286%',
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
        '1/9': '11.111111%',
        '2/9': '22.222222%',
        '3/9': '33.333333%',
        '4/9': '44.444444%',
        '5/9': '55.555556%',
        '6/9': '66.666667%',
        '7/9': '77.777778%',
        '8/9': '88.888889%',
      },
      height: {
        '20%':'20vh',
        'screen-1/2': '50vh', // 50% de la hauteur de l'écran
        'screen-3/4': '75vh', // 75% de la hauteur de l'écran
        'screen-4/5': '80vh',
        'screen-5/5': '90vh',// 80% de la hauteur de l'écran
      },
      // Vous pouvez ajouter d'autres personnalisations comme les couleurs, les polices, etc.
    },
  },
  plugins: [],
};

export default config;
