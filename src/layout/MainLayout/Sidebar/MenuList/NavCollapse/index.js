import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, ListItemIcon, ListItemText, Collapse, List, ListItemButton } from '@mui/material';

// project import
import NavItem from '../NavItem';

// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AuthContext from 'views/Login/AuthContext';
import {navCollapse} from '../../../../../store/actions'
import { useDispatch } from 'react-redux';
// ==============================|| NAV COLLAPSE ||============================== //

const NavCollapse = ({ menu, level, contextStateData }) => {
  const {allowUser} =useContext(AuthContext);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
const dispatch=useDispatch();

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
  };

  // //console.log(menu.children);

  const filteredMenuChildren = menu.children?.filter((item) => {
    // //console.log(item.title);
    const matchedItem = allowUser?.find((data) => data.user === item.title);
    return matchedItem !== undefined;
    
  });
  // //console.log(filteredMenuChildren);

  useEffect(() => {
   
      dispatch(navCollapse(filteredMenuChildren));
    
  }, [dispatch]); 
  

  const menus =filteredMenuChildren?.map((item) => {
    // //console.log(item);
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} contextStateData={contextStateData} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? <Icon /> : <ArrowForwardIcon fontSize={level > 0 ? 'inherit' : 'default'} />;

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: '5px',
          mb: 0.6,
          pl: `${level * 16}px`,
          ...(level > 1 && { backgroundColor: 'transparent !important', py: 1, borderRadius: '5px' })
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ minWidth: !menu.icon ? '25px' : 'unset' }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={selected === menu.id ? 'subtitle1' : 'body1'} color="inherit" sx={{ pl: 1.9 }}>
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, pl: 2 }} display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  contextStateData: PropTypes.array,
};

export default NavCollapse;
