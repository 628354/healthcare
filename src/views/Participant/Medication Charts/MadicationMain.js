import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MadicationChart from './index';

import SummarizeIcon from '@mui/icons-material/Summarize';
const MadicationMain = () => {
  const [selectedTab, setSelectedTab] = useState('list');
  const [show,setShow]=useState(false)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
       {!show && (
    <Tabs className='list_tab_space' value={selectedTab} onChange={handleTabChange} sx={{ 
    '& .MuiTab-root': { 
      minWidth: '100px', 
    } 
  }}>
  
        <Tab value="list" icon={<SummarizeIcon />} label="List" />
      
      </Tabs>
 )}
      {selectedTab === 'list' && <MadicationChart   setShow={setShow} show={show}/>}
     
    </div>
  );
};

export default MadicationMain;
