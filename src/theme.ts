import { createTheme } from '@mui/material/styles'

// comment out when using custom theme
declare module '@mui/material/styles' {
  interface Theme {
    header: {
      light: string
      main: string
      dark: string
      borderBottom: string
    }
    app: {
      border: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    header: {
      light: string
      main: string
      dark: string
    }
    app: {
      border: string
    }
  }
}

const theme = createTheme({
  header: {
    light: '#ffffff',
    main: '#f5f5f5',
    dark: '#000000',
  },
  // override lg by material-ui v4 breakpoint values
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
  palette: {
    /*primary: {
      //light: '#ffffff',
      main: '#a5a5a5',
      dark: '#002884',
    }, */
  },
  app: {
    border: '1px solid #ccc',
  },
  /*item: {
    borderBottom: '1px solid #cccccc'
  }*/
})

export default theme
