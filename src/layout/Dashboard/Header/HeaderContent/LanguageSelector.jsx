import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

export default function LanguageSelector() {
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        sx={{
          color: 'text.primary',
          bgcolor: 'transparent',
        }}
        aria-label="language selector"
      >
        🌍
      </IconButton>
    </Box>
  );
} 