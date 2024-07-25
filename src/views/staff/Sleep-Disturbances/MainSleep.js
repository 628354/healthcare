import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SleepDist from './index';

import SummarizeIcon from '@mui/icons-material/Summarize';
const MainSleep = () => {
  const [selectedTab, setSelectedTab] = useState('list');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
    <Tabs className='list_tab_space' value={selectedTab} onChange={handleTabChange} sx={{ 
    '& .MuiTab-root': { 
      minWidth: '100px', 
    } 
  }}>
  
        <Tab value="list" icon={<SummarizeIcon />} label="List" />
      
      </Tabs>

      {selectedTab === 'list' && <SleepDist />}
     
    </div>
  );
};

export default MainSleep;
