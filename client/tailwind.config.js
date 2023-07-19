const { colors } = require('@mui/material');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        pink: '0px 0px 25px #FF3569',
        card: '3px 3px 11px rgba(254, 62, 122, 0.30)'
      },
      boxShadow: {
        pink: '0px 4px 8px rgba(255, 51, 102, 0.53)',
        blue: '0px 4px 4px  rgba(51, 51, 153, 0.60)'
      }
    },
    fontFamily: {
      mulish: 'Mulish, sans-serif',
      inter: 'Inter, sans-serif'
    },
    colors: {
      primary: {
        0: '#ffffff',
        10: '#e6e6e8',
        20: '#ceced2',
        30: '#b5b5bb',
        40: '#9c9ca5',
        50: '#83838d',
        60: '#6b6b77',
        70: '#525260',
        80: '#393949',
        90: '#212133',
        100: '#08081c'
      },
      secondary: {
        10: '#ebebf5',
        20: '#d6d6eb',
        30: '#c2c2e1',
        40: '#adadd6',
        50: '#9898cb',
        60: '#8585c3',
        70: '#7171b8',
        80: '#5c5cab',
        90: '#4848a4',
        100: '#333399'
      },
      accent1: {
        10: '#ffebf0',
        20: '#fed7e0',
        30: '#ffc2d2',
        40: '#ffaec2',
        50: '#ff98d2',
        60: '#ff85a3',
        70: '#ff7095',
        80: '#ff5c85',
        90: '#ff4876',
        100: '#ff3366'
      },
      accent2: {
        10: '#fffbeb',
        20: '#fffbd6',
        30: '#fff9c2',
        40: '#fff7ac',
        50: '#fff498',
        60: '#fff385',
        70: '#fff171',
        80: '#fff05c',
        90: '#ffed49',
        100: '#ffeb33'
      }
    }
  },
  plugins: []
};
