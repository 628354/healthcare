import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RpDhsResources from './index';

import SummarizeIcon from '@mui/icons-material/Summarize';
const RpDhsResourcesMain = () => {
  const [selectedTab, setSelectedTab] = useState('list');
  const [show,setShow]=useState(false)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    
    <div>
        {!show && (
      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ 
    '& .MuiTab-root': { 
      minWidth: '100px', // Adjust the width as needed 
    } 
  }}
>
  
        <Tab value="list" icon={<SummarizeIcon />} label="List" />
      
      </Tabs>
 )}
      {selectedTab === 'list' && <RpDhsResources   setShow={setShow} show={show}/>}
     
    </div>
  );
};

export default RpDhsResourcesMain;
