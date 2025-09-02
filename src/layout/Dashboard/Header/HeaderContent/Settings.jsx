import React, { useState, useRef } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Popper, Divider, Card, CardContent, ClickAwayListener, useMediaQuery } from '@mui/material';
import { SettingOutlined, UserOutlined, LockOutlined, BellOutlined, GlobalOutlined, SkinOutlined, DashboardOutlined, ThunderboltOutlined, SafetyCertificateOutlined, KeyOutlined, FileTextOutlined, ClockCircleOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleToggle = () => {
    console.log('🔧 Settings button clicked! Current open state:', open);
    setOpen((prevOpen) => {
      const newState = !prevOpen;
      console.log('🔧 Setting open state to:', newState);
      return newState;
    });
  };

  const handleClose = (event) => {
    console.log('🔧 Closing settings menu');
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  console.log('🔧 Settings component rendering, open state:', open);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        ref={anchorRef}
        color="secondary"
        sx={{
          color: 'text.secondary',
          bgcolor: 'transparent',
          '&:hover': { color: 'primary.main' }
        }}
        aria-label="settings"
        onClick={handleToggle}
        onMouseEnter={() => console.log('🔧 Mouse enter on settings button')}
        onMouseLeave={() => console.log('🔧 Mouse leave on settings button')}
      >
        <SettingOutlined />
      </IconButton>
      
      {open && (
        <Popper
          placement={downMD ? 'bottom' : 'bottom-start'}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
        >
          <Paper sx={{ boxShadow: 3, width: '100%', minWidth: 350, maxWidth: 500 }}>
            <ClickAwayListener onClickAway={handleClose}>
              <Card elevation={0}>
                <CardContent sx={{ p: 0 }}>
                  <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 36 } }}>
                    <ListItem>
                      <ListItemText
                        primary={t('header.settings')}
                        primaryTypographyProps={{ variant: 'h6' }}
                      />
                    </ListItem>
                    <Divider />
                    
                    {/* Paramètres de base */}
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <UserOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.profileSettings')}
                          secondary={t('header.profileSettingsDesc')}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <LockOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.security')}
                          secondary={t('header.securityDesc')}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <BellOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.notifications')}
                          secondary={t('header.notificationsDesc')}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <UserSwitchOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.privacy')}
                          secondary={t('header.privacyDesc')}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <GlobalOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.language')}
                          secondary={t('header.languageDesc')}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <Divider />
                    
                    {/* Personnalisation de l'interface */}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {t('header.interfaceCustomization')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <GlobalOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.languageAndRegion')}
                          secondary={`${t('header.timezone')}, ${t('header.dateFormat')}, ${t('header.numberFormat')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <SkinOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.theme')}
                          secondary={`${t('header.lightMode')}, ${t('header.darkMode')}, ${t('header.compactLayout')}, ${t('header.comfortableLayout')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.dashboardCustomization')}
                          secondary={`${t('header.widgets')}, ${t('header.defaultViews')}, ${t('header.refreshIntervals')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <ThunderboltOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.quickActions')}
                          secondary={`${t('header.customShortcuts')}, ${t('header.favoriteTemplates')}, ${t('header.frequentOfferings')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <Divider />
                    
                    {/* Sécurité avancée */}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {t('header.advancedSecurity')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <SafetyCertificateOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.twoFactorAuth')}
                          secondary={`${t('header.enable2FA')}, ${t('header.disable2FA')}, ${t('header.backupCodes')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <ClockCircleOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.sessionManagement')}
                          secondary={`${t('header.autoLogout')}, ${t('header.concurrentSessions')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <KeyOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.apiKeys')}
                          secondary={`${t('header.generateApiKey')}, ${t('header.manageApiKeys')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <FileTextOutlined />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('header.accessLogs')}
                          secondary={`${t('header.loginHistory')}, ${t('header.apiUsageLogs')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </ClickAwayListener>
          </Paper>
        </Popper>
      )}
    </Box>
  );
};

export default Settings; 