import PropTypes from 'prop-types';
import React, { useContext } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, Typography } from '@mui/material';

// project import
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import AuthContext from 'views/Login/AuthContext';
// import { useSelector } from 'react-redux';

// ==============================|| NAVGROUP ||============================== //

const NavGroup = ({ item }) => {
  const theme = useTheme();
  const {allowUser} =useContext(AuthContext);

  // //console.log(item.children);
  // //console.log(allowUser);gggggg
  
  // const filteredMenuChildrenData = useSelector((state) => state.filteredMenuChildrenData);
  // //console.log(filteredMenuChildrenData);

  const filteredMenuChildren = item.children?.map((item) => {
    // //console.log(item);
    const filteredChildren = item?.children?.filter((res) => {
      // //console.log(res);
        const matchedItem = allowUser?.find((data) =>data.user === item.title || data.user === res.title);
        return matchedItem;
    });
    if (( filteredChildren && filteredChildren?.length > 0) || allowUser?.some(data => data.user === item.title) || item.title ==="Dashboard"    ) {
        return {
            title: item.title,
            childrenLength: filteredChildren?.length,
            type: item.type,
            id:item.id,
            url:item.url,
            icon:item.icon,
            children:item.children
        };
    } else {
        return null; // Return null for items with no matching children
    }
}).filter(item => item !== null); // Filter out the null items

// //console.log(filteredMenuChildren);
// admin34@gmail.com

  const items = filteredMenuChildren.map((menu) => {
   
   
      // //console.log(menu);
      switch (menu.type) {
        case 'collapse':
          return <NavCollapse key={menu.id} menu={menu} level={1} />;
        case 'item':
          return <NavItem key={menu.id} item={menu} level={1} />;
        default:
          return (
            <Typography key={menu.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
     

    }
   
  });

  return (
    <List
      subheader={
        <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
          {item.title}
          {item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )}
        </Typography>
      }
    >
      {items}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  children: PropTypes.object,
  title: PropTypes.string,
  caption: PropTypes.string
};

export default NavGroup;
