import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Input } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function AddPatient() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    patientName: '',
    dateOfAdmission: '',
    dateOfDischarge: '',
    patientAddress: '',
    city: ''
  });
  const [documents, setDocuments] = useState([]);
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setPatientData({...patientData, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if(files.length > 5) {
      setFeedback('You can upload maximum 5 images.');
      return;
    }
    // Validate file size
    for (let file of files) {
      if(file.size > 10 * 1024 * 1024) { // 10MB
        setFeedback(`File ${file.name} exceeds 10MB.`);
        return;
      }
    }
    setDocuments(files);
    setFeedback('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (documents.length === 0) {
      setFeedback('Please upload at least one image.');
      return;
    }
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.keys(patientData).forEach(key => formData.append(key, patientData[key]));
    documents.forEach(file => formData.append('documents', file));
    try {
      await axios.post('http://localhost:5000/api/patients/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setFeedback('Patient added successfully.');
      navigate('/dashboard');
    } catch(err) {
      setFeedback('Error adding patient.');
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Add New Patient</Typography>
        {feedback && <Typography color="error">{feedback}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField label="Patient Name" name="patientName" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Date of Admission" name="dateOfAdmission" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField label="Date of Discharge" name="dateOfDischarge" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField label="Patient Address" name="patientAddress" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="City" name="city" fullWidth margin="normal" onChange={handleChange} />
          <Box mt={2}>
            <Input type="file" inputProps={{ accept: 'image/*', multiple: true }} onChange={handleFileChange} />
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit">Submit</Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default AddPatient;