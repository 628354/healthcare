import React, { useContext, useState } from 'react';

// material-ui
import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import AuthContext from '../Login/AuthContext';
// ==============================|| FIREBASE LOGIN ||============================== //
import '../../style/document.css'
const FirebaseLogin = () => {
  const { loginUser,user,message} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

// console.log(formData);
  const handleSubmit = (event) => {
    event.preventDefault();
    // Pass the form data to the loginUser function from AuthContext
    loginUser(formData);
    // console.log(formData);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={formData.password}
            />
          </Grid>
        </Grid>
        <Grid className='login_err'>
              {message?<Alert severity="error">{message}</Alert>:""}

              </Grid>
        <Box mt={2} marginBottom={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log In
          </Button>
        </Box>
      </form>
    </>
  );
};

export default FirebaseLogin;
