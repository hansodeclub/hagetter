import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// comment out when using custom theme
declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    item: {
      borderBottom: string;
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    item?: {
      borderBottom?: string;
    };
  }
}

const theme = createMuiTheme({
  item: {
    borderBottom: '1px solid #cccccc'
  }
});

export default theme;