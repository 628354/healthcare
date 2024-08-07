import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| MENULIST ||============================== //

const MenuList = () => {
  // //console.log(menuItem);
  const navItems = menuItem.items.map((item) => {
    // //console.log(item.type);
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return navItems;
};

export default MenuList;
