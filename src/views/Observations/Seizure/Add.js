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
import { BASE_URL, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo';
import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Add = ({setIsAdding,setShow }) => {
  const oversee=localStorage.getItem('user')
  const convert=JSON.parse(oversee)
  const finalStaff=convert?.stf_firstname;
   const staffId =convert?.stf_id
  const currentDate = new Date()
 
  const [date, setDate] = useState('');
  const [startTime, setstartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [seizure, setSeizure] = useState('');
  const [seizureList, setSeizureList] = useState([]);






  const[staff,setStaff]=useState(finalStaff)
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])

  const [actions , setActions] = useState('');
  const [recovery , setRecovery] = useState('');
  const [reported , setReported] = useState('');
  const [comments , setComments] = useState('');

  

// get user role

const getRole = async () => {
  try {
    let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant)
    if(response.status) {  
      setParticipantList(response.messages)
     
    } else {
      throw new Error('Network response was not ok.')
    }
  } catch (error) {
    console.error('Error fetching staff data:', error)
  }
}
const getSeizure = async () => {
  let endpoint = 'getAll?table=seizure_catgry&select=seizure_id,seizure_catgry_name,';

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const res = await response.json();
      setSeizureList(res.messages);
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Error fetching seizure data:', error);
  }
}


useEffect(()=>{
getRole();
getSeizure();
},[])

useEffect(() => {
  setShow(true)
  return () => setShow(false)
}, [setShow])

  const handleAdd = e => {
    e.preventDefault();
   
    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    } if (!startTime) {
      emptyFields.push('Start time');
    }
    if (!endTime) {
      emptyFields.push('End time');
    }

    if (!seizure) {
      emptyFields.push('Seizure');
    }
    if (!actions) {
      emptyFields.push('Actions taken by staff');
    } if (!recovery) {
      emptyFields.push('Recovery');
    }
    if (!reported) {
      emptyFields.push('Reported to');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }


    const formattedDate = dayjs(date).format('YYYY-MM-DD'); 
    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');


    const data = {   
      szr_date:formattedDate,
      szr_strttime:formattedTime,
      szr_endtime:formattedEndTime,
      szr_stfid:staffId,
      szr_seizure:seizure,
      szr_prtcpntid:participant,
      szr_action:actions,
      szr_report:reported,
      szr_rcvry:recovery,
      szr_cmnt:comments,
      company_id:companyId,
      created_at:currentTime,
      
         
    }
  
    
    let endpoint = 'insertData?table=fms_seizure';
    let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
      response.then((data)=>{
          // console.log(data.status);
          // console.log("check",data)
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(false);
          }else{
            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something Went Wrong.',
            showConfirmButton: true,
      });
          }
      });
    
  };

  return (
    <div className="small-container">

      <Box
        component="form"
       
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
         <h1>Create Seizure</h1>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          onChange={(newValue) => {setstartTime(newValue) }}
         
        />
         </LocalizationProvider>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          onChange={(newValue) => {setEndTime(newValue) }}
         
        />
         </LocalizationProvider>

         <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Seizure '>Seizure </InputLabel>
          <Select
            labelId='Seizure '
            id='Seizure '
            value={seizure}
            label='Seizure '
            onChange={e => setSeizure(e.target.value)}
          >
            {
              seizureList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.seizure_id} value={item?.seizure_id}>{item?.seizure_catgry_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>

         <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='staff'>Staff</InputLabel>
          <Select
            labelId='staff'
            id='staff'
            value={staff}
            label='Staff'
            onChange={e => setStaff(e.target.value)}
          >
              <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>
     
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
       
        <TextField
          required
          label='Actions taken by staff'
          value={actions}
          onChange={e => {
            setActions(e.target.value)
          }}
        />
        <TextField
          value={recovery}
            label="Recovery "
            type="text"
            onChange={(e)=>{setRecovery(e.target.value)}}
          />
           <TextField
          value={reported}
            label="Reported to"
            type="text"
            onChange={(e)=>{setReported(e.target.value)}}
          />
           <TextField
          value={comments}
            label="Comments"
            type="text"
            onChange={(e)=>{setComments(e.target.value)}}
          />

          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"
                    spacing={2}>
                <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Submit</Button>
                
              </Stack>
          </Box>
      </Box>
    </div>
  );
};


export default Add;

