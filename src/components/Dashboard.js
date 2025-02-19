import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Box, Typography } from '@material-ui/core';

function Dashboard() {
  const navigate = useNavigate();
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Dashboard</Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/add-patient')} style={{ marginRight: '10px' }}>
            Add New Patient
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate('/search')}>
            Search Existing Patient
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Dashboard;