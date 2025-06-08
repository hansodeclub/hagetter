// Legacy styles converted to CSS-in-JS object format
// Note: This file can be removed when all components are migrated to Tailwind CSS

const styles = {
  tabs: {
    border: '1px solid #ccc',
  },
  outer: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  },
  header: {
    marginTop: '8px',
  },
  textField: {
    backgroundColor: '#fff',
  },
  headerContent: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '8px',
    backgroundColor: '#fff',
    padding: '8px',
  },
  content: {
    position: 'relative' as const,
    flexGrow: 1,
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '8px',
    backgroundColor: '#fff',
  },
  tootSelector: {
    flexGrow: 1,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflowY: 'scroll' as const,
    WebkitOverflowScrolling: 'touch',
    overscrollBehaviorY: 'none',
  },
  selectorButtom: {
    textAlign: 'center' as const,
    justifyContent: 'center',
    width: '100%',
    padding: '30px',
  },
  howToContainer: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box' as const,
    backgroundColor: '#fff',
    flexGrow: 1,
    marginTop: '5px',
    marginBottom: '2px',
  },
  howTo: {
    margin: '24px',
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: '#f1f1f1',
  },
  howToTitle: {
    width: '100%',
    textAlign: 'center' as const,
  },
  progress: {
    position: 'absolute' as const,
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