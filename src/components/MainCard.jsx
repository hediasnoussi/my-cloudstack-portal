// src/components/MainCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography, Chip } from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

const MainCard = ({ 
  title, 
  subtitle, 
  children, 
  elevation = 0,
  sx = {},
  headerSx = {},
  contentSx = {},
  showTrend = false,
  trendValue = 0,
  trendLabel = '',
  status = 'default',
  statusLabel = '',
  ...props 
}) => {
  const getTrendIcon = () => {
    if (trendValue > 0) return <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />;
    if (trendValue < 0) return <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />;
    return <RemoveIcon sx={{ color: 'text.secondary', fontSize: 16 }} />;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'success.main';
      case 'warning': return 'warning.main';
      case 'error': return 'error.main';
      case 'info': return 'info.main';
      default: return 'primary.main';
    }
  };

  return (
    <Card
      elevation={elevation}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(30, 41, 59, 0.12)',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
        },
        ...sx
      }}
      {...props}
    >
      {(title || subtitle || showTrend || statusLabel) && (
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                letterSpacing: '0.5px'
              }}>
                {title}
              </Typography>
              
              {statusLabel && (
                <Chip
                  label={statusLabel}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24
                  }}
                />
              )}
              
              {showTrend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getTrendIcon()}
                  <Typography variant="caption" sx={{ 
                    color: trendValue > 0 ? 'success.main' : trendValue < 0 ? 'error.main' : 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}>
                    {trendValue > 0 ? '+' : ''}{trendValue}% {trendLabel}
                  </Typography>
                </Box>
              )}
            </Box>
          }
          subheader={
            subtitle && (
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                mt: 1,
                fontSize: '0.875rem',
                letterSpacing: '0.3px'
              }}>
                {subtitle}
              </Typography>
            )
          }
          sx={{
            pb: 1,
            '& .MuiCardHeader-content': {
              minWidth: 0
            },
            ...headerSx
          }}
        />
      )}
      
      <CardContent sx={{ 
        pt: 0,
        '&:last-child': { pb: 3 },
        ...contentSx
      }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MainCard;
