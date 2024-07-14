import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

       
      
       
       
      </Box>
    </div>
  );
};


export default Add;

