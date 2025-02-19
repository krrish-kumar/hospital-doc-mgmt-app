import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function PatientSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ patientName: '', city: '' });
  const [patients, setPatients] = useState([]);
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setSearchParams({...searchParams, [e.target.name]: e.target.value});
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      // Build query param string based on search params
      let query = Object.keys(searchParams).filter(key => searchParams[key]).map(key => `${key}=${searchParams[key]}`).join('&');
      const res = await axios.get(`http://localhost:5000/api/patients/search?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPatients(res.data.patients);
      setFeedback('');
    } catch (err) {
      setFeedback('Error fetching patients');
    }
  };

  const viewDetails = (patient) => {
    // Could navigate to a patient details page; for now, we'll just alert.
    alert(JSON.stringify(patient, null, 2));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Search Existing Patient</Typography>
        {feedback && <Typography color="error">{feedback}</Typography>}
        <Box mt={2}>
          <TextField label="Patient Name" name="patientName" onChange={handleChange} style={{ marginRight: '10px' }} />
          <TextField label="City" name="city" onChange={handleChange} />
          <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '10px' }}>
            Search
          </Button>
        </Box>
        <Box mt={4}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Date of Admission</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.dateOfAdmission}</TableCell>
                  <TableCell>{patient.city}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => viewDetails(patient)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
}

export default PatientSearch;