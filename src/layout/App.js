import React from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// third-party
import { useSelector } from 'react-redux';

// project import
import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';
import { AuthProvider } from 'views/Login/AuthContext';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <>
      {
        <NavigationScroll>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
              <CssBaseline />
              <AuthProvider>
              <Routes />
              </AuthProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </NavigationScroll>
      }
    </>
  );
};

export default App;
