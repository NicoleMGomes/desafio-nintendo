export const themes = {
  main: {
    primary: '#F29441',
    secondary: '#0F528C',
    'secondary-dark': '#062540',
    success: '#218739',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#128091',
    black: '#1b1f23',
    gray: '#586069',
    'gray-light': '#6a737d',
    'gray-dark': '#24292e',
  },
}

export type ThemeName = keyof typeof themes
export type ThemeType = typeof themes.main
