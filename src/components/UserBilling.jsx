import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

const UserBilling = ({ open, onClose, billingInfo }) => {
  if (!billingInfo || !billingInfo.invoices) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ReceiptIcon sx={{ mr: 1 }} />
          Historique des factures
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Résumé de facturation
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1">
              Solde actuel: <strong>{billingInfo.current_balance}€</strong>
            </Typography>
            <Typography variant="body1">
              Total mensuel: <strong>{billingInfo.monthly_total}€</strong>
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Prochaine facturation: {billingInfo.next_billing_date}
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Factures récentes
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numéro</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingInfo.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}€</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={invoice.status === 'Paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserBilling;
