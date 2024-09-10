import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../contexts/AuthContext';
import { Button, TextField, Typography, Container, Box, Alert } from '@mui/material'
// import { styled } from '@mui/material/styles'



// const StyledForm = styled('form')(({ theme }) => ({
//     width: '100%',
//     marginTop: theme.spacing(1),
//   }));
  
//   const SubmitButton = styled(Button)(({ theme }) => ({
//     margin: theme.spacing(3, 0, 2),
//   }));
  
//   const GoogleButton = styled(Button)(({ theme }) => ({
//     margin: theme.spacing(2, 0, 2),
//   }));
  
  function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()
    const location = useLocation();
  
    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
    //   const errorMessage = queryParams.get('error');


      if (token) {
        console.log("Token received:", token)
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    //   else if (errorMessage){
    //     setError(decodeURIComponent(errorMessage));
    //   }
    }, [location, navigate, setIsAuthenticated]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    //   setError('');
      try {
        const res = await axios.post('/api/auth/login', { email, password });
        console.log("Login response:", res.data)
        localStorage.setItem('token', res.data.token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || 'An error occurred during login');
      }
    };
  
    const handleGoogleLogin = () => {
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
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            sx={{ mt: 1, mb: 1 }}
          >
            Sign In with Google
          </Button>
        </Box>
        <Link to="/signup">
          {"Don't have an account? Sign Up"}
        </Link>
      </Box>
      </Container>
    );
  }
  
  export default Login;