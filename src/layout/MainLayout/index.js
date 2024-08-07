import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';

// project import
import { drawerWidth } from 'config.js';
import Header from './Header';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { showSidebar } from '../../store/actions';

// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3)
  },
  padding: theme.spacing(5)
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const showDrawer =useSelector((state)=>state.SidebarData?.drawerOpen)
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  // //console.log(screenSize);

  useEffect(() => {
      const handleResize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      };
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

  const dispatch = useDispatch();

useEffect(()=>{
  if(screenSize.width > 1000){
    dispatch(showSidebar(true));

  }

},[screenSize])

  const handleDrawerToggle = () => {
    dispatch(showSidebar(!showDrawer));

  };

  React.useEffect(() => {
    showSidebar(matchUpMd);
  }, [matchUpMd]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar position="fixed" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <Header  drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerToggle={handleDrawerToggle} />
      <Main
        style={{
          ...(showDrawer ===true && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
            marginRight: 'inherit'
          })
        }}
      >
        <Box sx={theme.mixins.toolbar} />
        <OutletDiv>
          <Outlet class='test'/>
        </OutletDiv>
      </Main>
    </Box>
  );
};

export default MainLayout;
