import { createTheme } from '@mui/material/styles';

// Couleurs inspirées du logo FOCUS
const primaryColor = '#1e3a8a'; // Bleu foncé riche (comme les triangles et "FOCUS")
const secondaryColor = '#fbbf24'; // Jaune vif (comme le triangle et "DRIVEN BY COMMITMENT")
const accentColor = '#f5f5dc'; // Beige clair (couleur d'accent)
const backgroundColor = '#ffffff'; // Blanc pur pour le background
const surfaceColor = '#ffffff'; // Blanc pour les surfaces
const sidebarColor = '#1e3a8a'; // Bleu du logo pour la sidebar
const textPrimary = '#1e293b'; // Bleu très foncé pour le texte principal
const textSecondary = '#64748b'; // Gris moyen pour le texte secondaire

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryColor,
      light: '#fcd34d',
      dark: '#f59e0b',
      contrastText: '#1e293b',
    },
    background: {
      default: backgroundColor,
      paper: surfaceColor,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    divider: 'rgba(30, 41, 59, 0.12)',
    action: {
      active: primaryColor,
      hover: 'rgba(30, 58, 138, 0.08)',
      selected: 'rgba(30, 58, 138, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: textPrimary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: textPrimary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: textPrimary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: textPrimary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: textPrimary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: textPrimary,
    },
    body1: {
      fontSize: '1rem',
      color: textPrimary,
    },
    body2: {
      fontSize: '0.875rem',
      color: textSecondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: surfaceColor,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(30, 41, 59, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: sidebarColor,
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: surfaceColor,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(30, 41, 59, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: primaryColor,
          '&:hover': {
            backgroundColor: '#1e40af',
          },
        },
        containedSecondary: {
          backgroundColor: secondaryColor,
          color: textPrimary,
          '&:hover': {
            backgroundColor: '#f59e0b',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 0',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: accentColor, // Beige pour les en-têtes de tableaux
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: textPrimary,
          backgroundColor: accentColor, // Beige pour les cellules d'en-tête
        },
        root: {
          borderBottom: '1px solid rgba(30, 41, 59, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: surfaceColor,
          border: '1px solid rgba(30, 41, 59, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorPrimary: {
          backgroundColor: primaryColor,
          color: '#ffffff',
        },
        colorSecondary: {
          backgroundColor: secondaryColor,
          color: textPrimary,
        },
        // Nouveau style pour les chips beiges
        colorDefault: {
          backgroundColor: accentColor,
          color: textPrimary,
          border: '1px solid rgba(30, 41, 59, 0.2)',
          '&:hover': {
            backgroundColor: '#f0f0d0',
          },
        },
      },
    },
    // Ajout de styles pour les éléments beiges
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardInfo: {
          backgroundColor: accentColor,
          color: textPrimary,
          border: '1px solid rgba(30, 41, 59, 0.2)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: accentColor,
          color: textPrimary,
          border: '1px solid rgba(30, 41, 59, 0.2)',
          fontSize: '0.75rem',
        },
      },
    },
  },
});
