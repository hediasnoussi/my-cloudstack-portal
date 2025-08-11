import React, { useState } from 'react';
import MainLayout from '../../layout/MainLayout';
import MainCard from '../../components/MainCard';
import { Button, Grid, Typography, Box, Chip } from '@mui/material';
import { FiPower, FiMonitor, FiPlay, FiPause, FiCamera } from 'react-icons/fi';

const DashboardClient = () => {
  const [vmList, setVmList] = useState([
    { id: 1, name: 'VM-001', status: 'Running', cpu: 2, ram: 4096 },
    { id: 2, name: 'VM-002', status: 'Stopped', cpu: 1, ram: 2048 }
  ]);

  const createVM = () => {
    const newId = vmList.length + 1;
    const newVM = {
      id: newId,
      name: `VM-00${newId}`,
      status: 'Running',
      cpu: 1,
      ram: 2048
    };
    setVmList([...vmList, newVM]);
  };

  return (
    <MainLayout>
      <MainCard title="VPS Dashboard">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={createVM}>
            + New VM
          </Button>
        </Box>

        <Grid container spacing={3}>
          {vmList.map((vm) => (
            <Grid item xs={12} sm={6} md={4} key={vm.id}>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 2
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{vm.name}</Typography>
                  <Chip
                    label={vm.status}
                    color={vm.status === 'Running' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary">
                  CPU: <strong>{vm.cpu}</strong> vCPU
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  RAM: <strong>{vm.ram}</strong> MB
                </Typography>

                <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                  <Button variant="outlined" size="small" startIcon={<FiMonitor />}>
                    Console
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color={vm.status === 'Running' ? 'warning' : 'success'}
                    startIcon={vm.status === 'Running' ? <FiPause /> : <FiPlay />}
                  >
                    {vm.status === 'Running' ? 'Stop' : 'Start'}
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<FiCamera />} color="secondary">
                    Snapshot
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </MainCard>
    </MainLayout>
  );
};

export default DashboardClient;
