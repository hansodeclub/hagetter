import { SxProps, Theme } from '@mui/material/styles'

const styles: { [key: string]: SxProps<Theme> } = {
  tabs: {
    border: (theme: Theme) => theme.app.border,
  },
  outer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    marginTop: 1,
  },
  textField: {
    backgroundColor: '#fff',
  },
  headerContent: {
    border: (theme) => theme.app.border,
    borderRadius: '5px',
    marginTop: 1,
    backgroundColor: '#fff',
    padding: 1,
  },
  content: {
    position: 'relative',
    flexGrow: 1,
    border: (theme) => theme.app.border,
    borderRadius: '5px',
    marginTop: 1,
    backgroundColor: '#fff',
  },
  tootSelector: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflowY: 'scroll',
    '-webkit-overflow-scrolling': 'touch',
  } as SxProps<Theme>,
  selectorButtom: {
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '30px',
  },
  howToContainer: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    flexGrow: 1,
    marginTop: '5px',
    marginBottom: '2px',
  },
  howTo: {
    margin: 3,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#f1f1f1',
  },
  howToTitle: {
    width: '100%',
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2,
  },
  toot: {
    borderBottom: '1px solid #ccc',
  },
}

export default styles
