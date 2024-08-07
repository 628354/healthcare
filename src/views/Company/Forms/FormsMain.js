import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Forms from './index';

import SummarizeIcon from '@mui/icons-material/Summarize';
const FormsMain = () => {
  const [selectedTab, setSelectedTab] = useState('General');
  const [show,setShow]=useState(false)
// //console.log(selectedTab);
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
  
        <Tab value="General" icon={<SummarizeIcon />} label="General" />
        <Tab value="Participant" icon={<SummarizeIcon />} label="Participant" />
        <Tab value="Staff" icon={<SummarizeIcon />} label="Staff" />
      
      </Tabs>
 )}
      {selectedTab === 'General' && <Forms   setShow={setShow} show={show} selectedTab={selectedTab}/>}
      {selectedTab === 'Participant' && <Forms   setShow={setShow} show={show} selectedTab={selectedTab}/>}
      {selectedTab === 'Staff' && <Forms   setShow={setShow} show={show} selectedTab={selectedTab}/>}
     
     
    </div>
  );
};

export default FormsMain;
