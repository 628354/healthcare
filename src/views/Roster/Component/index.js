import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import General from './General';
import SummarizeIcon from '@mui/icons-material/Summarize';
import '../../../style/Roster.css'

const RosterAllTabs = ({showTab}) => {
  const [selectedTab, setSelectedTab] = useState('general');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleChange=()=>{
    console.log('yesh');
  }

  return (
    <div>
  
  <Tabs value={selectedTab} onChange={handleTabChange} sx={{ 
'& .MuiTab-root': { 
  minWidth: '100px',
} 
}}
>

  <Tab value="general" label="General" />
    
  <Tab value="services" label="Services"  onClick={handleChange}/>
  <Tab value="payLevels" label="Pay Levels" />
  <Tab value="payItems" label="Pay Items" />

  </Tabs>

  {selectedTab === 'general' && <General  />}

 
</div>
  );
};

export default RosterAllTabs;
