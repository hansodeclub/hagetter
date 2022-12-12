import React from 'react'

import LockIcon from '@mui/icons-material/Lock'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SortIcon from '@mui/icons-material/Sort'
import LoadingButton from '@mui/lab/LoadingButton'
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import { observer, useEditor } from '@/stores'

export const BottomBar: React.FC<{ onSubmit: () => any; submitting: boolean }> =
  observer(({ onSubmit, submitting }) => {
    const editor = useEditor()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const menuOpen = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    React.useEffect(() => {
      if (editor.hasPrivateStatus && editor.visibility === 'public')
        editor.setVisibility('unlisted')
    }, [editor.hasPrivateStatus])

    const handleUnlistedChange = (event) => {
      console.log(event)
      if (editor.hasPrivateStatus) {
        editor.setVisibility('unlisted')
      } else {
        console.log(event.target.checked)
        editor.setVisibility(event.target.checked ? 'unlisted' : 'public')
      }
    }

    return (
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
          backgroundColor: '#fff',
          color: '#000',
          borderTop: '1px solid #ddd',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <LoadingButton
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: '30px', width: 140, fontWeight: 800 }}
            loadingPosition="start"
            loading={submitting}
            onClick={onSubmit}
          >
            投稿
          </LoadingButton>
          <Tooltip title="未収載にすると一覧に表示されなくなります。非公開ポストを含む場合は未収載のみ選択可能です。">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                width: '180px',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      editor.visibility !== 'public' || editor.hasPrivateStatus
                    }
                    onChange={handleUnlistedChange}
                    disabled={editor.hasPrivateStatus}
                    value="unlisted"
                  />
                }
                label="未収載"
                sx={{ ml: 2 }}
              />
              {editor.hasPrivateStatus && (
                <LockIcon fontSize="small" sx={{ color: 'red' }} />
              )}
            </Box>
          </Tooltip>
          <Box>
            <IconButton
              id="global-menu-button"
              size="small"
              sx={{ border: '1px solid #aaa' }}
              onClick={handleClick}
              aria-controls={menuOpen ? 'global-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
            <Menu
              id="global-menu"
              open={menuOpen}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'global-menu-button',
              }}
            >
              <MenuItem
                onClick={() => {
                  editor.sort()
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <SortIcon fontSize="small" />
                </ListItemIcon>
                全体を時系列順でソート
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    )
  })

export default BottomBar
