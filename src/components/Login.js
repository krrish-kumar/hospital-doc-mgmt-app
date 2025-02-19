import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@material-ui/core';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospital: '',
    userId: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch(err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4">Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField label="Hospital Name" name="hospital" fullWidth margin="normal" value={formData.hospital} onChange={handleChange} />
          <TextField label="User ID" name="userId" fullWidth margin="normal" value={formData.userId} onChange={handleChange} />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} />
          <Button variant="contained" color="primary" type="submit">Login</Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;