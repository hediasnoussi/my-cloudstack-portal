import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import { Support as SupportIcon } from '@mui/icons-material';

const UserSupport = ({ open, onClose, supportTickets }) => {
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simuler la création d'un ticket
    console.log('Nouveau ticket:', newTicket);
    setNewTicket({ subject: '', description: '', priority: 'Medium' });
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'error';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <SupportIcon sx={{ mr: 1 }} />
          Support et tickets
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Créer un nouveau ticket
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Sujet"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Priorité</InputLabel>
              <Select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                label="Priorité"
              >
                <MenuItem value="Low">Basse</MenuItem>
                <MenuItem value="Medium">Moyenne</MenuItem>
                <MenuItem value="High">Haute</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          Mes tickets de support
        </Typography>
        
        {supportTickets && supportTickets.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Sujet</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Priorité</TableCell>
                  <TableCell>Créé le</TableCell>
                  <TableCell>Dernière mise à jour</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supportTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status}
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority}
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.last_update).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            Aucun ticket de support pour le moment.
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!newTicket.subject || !newTicket.description}
        >
          Créer le ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSupport;
