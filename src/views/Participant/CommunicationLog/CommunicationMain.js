import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CommunicationLog from './index';

import SummarizeIcon from '@mui/icons-material/Summarize';
const CommunicationLog = () => {
  const [selectedTab, setSelectedTab] = useState('list');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ 
    '& .MuiTab-root': { 
      minWidth: '100px', // Adjust the width as needed 
    } 
  }}
>
  
        <Tab value="list" icon={<SummarizeIcon />} label="List" />
      
      </Tabs>

      {selectedTab === 'list' && <CommunicationLog />}
     
    </div>
  );
};

export default CommunicationLog;
