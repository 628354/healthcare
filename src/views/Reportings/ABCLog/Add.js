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

import Swal from 'sweetalert2';
import { BASE_URL, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Add = ({setIsAdding,setShow,show,participantId}) => {
  const oversee=localStorage.getItem('user')
  const convert=JSON.parse(oversee)
  const finalStaff=convert?.stf_firstname;
   const staffId =convert?.stf_id
  const currentDate = new Date()
 
  // const finalStaffId=convert?.stf_id;
  const [date, setDate] = useState('');
  const[staff,setStaff]=useState(finalStaff)
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])
  const [startTime, setstartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [antecedents, setAntecedents] = useState('');
  const [behaviour , setBehaviour ] = useState('');
  const [consequences ,setConsequences] = useState('');
 

  
  

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


useEffect(()=>{
getRole();

},[])


useEffect(() => {

  if(setShow){
    setShow(true)
  return () => setShow(false)

  }
  
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
      emptyFields.push('Start Time');
    }
    if (!endTime) {
      emptyFields.push('End Time');
    }

    if (!antecedents) {
      emptyFields.push('Antecedents ');
      
    } if (!behaviour) {
      emptyFields.push('Behaviour');
    }
    if (!consequences) {
      emptyFields.push('Consequences');
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
      
      abc_date:formattedDate,
      abc_strttime:formattedTime,
      abc_endtime:formattedEndTime,
      abc_stfid:staffId,
      abc_prtcpntid:participant,
      abc_antecedent:antecedents,
      abc_behaviour:behaviour,
      abc_consequences:consequences,
      created_at:currentTime,
      company_id:companyId
         
    }
  
    
    let endpoint = 'insertData?table=fms_ABC_Logs';
    let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
      response.then((data)=>{
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
         <h1>Create ABC Log</h1>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
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
        <FormControl sx={{ width: '50ch', m: 1 }} required>
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

         

       
     
    
        <TextField
          required
          label='Antecedents'
          value={antecedents}
          onChange={e => {
            setAntecedents(e.target.value)
          }}
        />
        <TextField
          value={behaviour}
            label="Behaviour"
            type="text"
            onChange={(e)=>{setBehaviour(e.target.value)}}
          />
           <TextField
          value={consequences}
            label="Consequences "
            type="text"
            onChange={(e)=>{setConsequences(e.target.value)}}
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

