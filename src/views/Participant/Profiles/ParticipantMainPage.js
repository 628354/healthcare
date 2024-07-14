import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ParticipantProfiles from './index';
import ArchiveList from './Archive/index';

import { AccountCircle, Archive, BarChart } from '@mui/icons-material';
const ParticipantProfilesPage = () => {
  const [selectedTab, setSelectedTab] = useState('active');
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
        <Tab value="active" icon={<AccountCircle />} label="Active" />
        <Tab value="archive" icon={<Archive />} label="Archived" /> 
        <Tab value="reports" icon={<BarChart />} label="Reports" />
      </Tabs>
)}
      {selectedTab === 'active' && <ParticipantProfiles   setShow={setShow} show={show}/>}
      {selectedTab === 'archive' && <ArchiveList   setShow={setShow} show={show}/>}
     
    </div>
  );
};

export default ParticipantProfilesPage;
