import React, { useEffect, useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box } from '@mui/system';

const Add = () => {
    const [range,setRange]=useState('')
    const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])
 
  const getRole= async()=>{
    let url = "https://tactytechnology.com/mycarepoint/api/";
  let endpoint = 'getWhereAll?table=fms_prtcpnt_details&field=prtcpnt_archive&value=1';
  
    let response =await fetch(`${url}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setParticipantList(res.messages)
  // console.log(res);
    }
  
  }
  
  useEffect(()=>{
  getRole();
  },[])
 
  return (
    <div className="small-container" style={{paddingBottom:"20px !important"}}>

      <Box
        component="form"
       
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        // onSubmit={handleAdd}
      >
         <h1>Temperature Chart</h1>

       
      
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
            labelId='participant'
            id='participant'
            value={participant}
            label='Participant'
            onChange={e => setParticipant(e.target.value)}
          >
            {
              participantList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
       
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Range'>Rasnge</InputLabel>
          <Select
            labelId='range'
            id='range'
            value={range}
            label='range'
            onChange={e => setRange(e.target.value)}
          >
            
            <MenuItem value="Last 7 days">Last 7 days </MenuItem>
            <MenuItem value="Last 14 days">Last 14 days </MenuItem>
            <MenuItem value="Last 30 days">Last 30 days </MenuItem>
            <MenuItem value="Last 60 days">Last 60 days </MenuItem>


          </Select>
        </FormControl>
       
      </Box>
    </div>
  );
};


export default Add;

