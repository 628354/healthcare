import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import General from './General';
import SummarizeIcon from '@mui/icons-material/Summarize';
import '../../../style/Roster.css'
import Services from './Services/index'
import PayLevels from './PayLevel'
import PayItem from './PayItem'

import { useSearchParams } from 'react-router-dom';




const RosterAllTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(searchParams.get('tab') || 'general');

  useEffect(() => {
    // Update URL parameter when selected tab changes
    setSearchParams({ tab: selectedTab });
  }, [selectedTab, setSearchParams]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


  return (
<div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          '& .MuiTab-root': {
            minWidth: '100px',
          },
        }}
      >
        <Tab value="general" label="General" />
        <Tab value="services" label="Services" />
        <Tab value="payLevels" label="Pay Levels" />
        <Tab value="payItems" label="Pay Items" />
      </Tabs>

      {/* Render different components based on the selected tab */}
      {selectedTab === 'general' && <General />}
      {selectedTab === 'services' && <Services />}
      {selectedTab === 'payLevels' && <PayLevels />}
      {selectedTab === 'payItems' && <PayItem />}
    </div>
  );
};

export default RosterAllTabs;
