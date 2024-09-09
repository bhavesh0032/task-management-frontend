import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../contexts/AuthContext';
import { Button, TextField, Typography, Container, Box, Alert } from '@mui/material';
import { styled } from '@mui/material/styles'

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
  }));
  
  const SubmitButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
  }));
  
  const GoogleButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2, 0, 2),
  }));

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
        setError("Passwords don't match");
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', { firstName, lastName, email, password });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign Up
        </SubmitButton>
        <GoogleButton
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleGoogleSignup}
        >
          Sign up with Google
        </GoogleButton>
      </StyledForm>
      <Box mt={2}>
        <Typography variant="body2">
          Already have an account? <Link to="/">Login</Link>
        </Typography>
      </Box>
    </Box>
  </Container>
  )
}

export default Signup