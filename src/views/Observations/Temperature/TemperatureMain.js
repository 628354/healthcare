import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Temperature from './index';
import Chart from  './Chart'
import SummarizeIcon from '@mui/icons-material/Summarize';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
const TemperatureMain = () => {
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
    <Tab value="chart" icon={<PieChartOutlineIcon />} label="Chart" />

  </Tabs>
)}
  {selectedTab === 'list' && <Temperature   setShow={setShow} show={show}/>}
  {selectedTab === 'chart' && <Chart   setShow={setShow} show={show}/>}

 
</div>
  );
};

export default TemperatureMain;
