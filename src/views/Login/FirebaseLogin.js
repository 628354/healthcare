import React, { useContext, useState } from 'react';

// material-ui
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import AuthContext from '../Login/AuthContext';
// ==============================|| FIREBASE LOGIN ||============================== //

const FirebaseLogin = () => {
  const { loginUser } = useContext(AuthContext);
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

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log In
          </Button>
        </Box>
      </form>
    </>
  );
};

export default FirebaseLogin;
