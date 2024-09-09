import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login'
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

const theme = createTheme();



const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}


// function RequireAuth({ children }) {
//   const { isAuthenticated } = React.useContext(AuthContext);
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }


export default App