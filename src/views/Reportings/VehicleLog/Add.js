import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
 import '../../../style/document.css'


const Add = ({setIsAdding,setShow }) => {

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState(null);
 
  const [endTime, setEndTime] = useState(null);

  const [odometerReadingS, setOdometerReadingS] = useState('');
  const [odometerReadingE, setOdometerReadingE] = useState('');

  const [totalKm, setTotalKm] = useState('');
  const [purposeJourney, setPurposeJourney] = useState('');

  const [vehicle , setVehicle ] = useState('');



  const [staff, setStaff] = useState('');
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([]) 
  const [staffId,setStaffId]=useState(null)


  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])



 


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
  
 

  useEffect(() => {
    getRole();
  }, [])
  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname= convert?.stf_lastname
      const combine =`${finalStaff} ${lname}`
      const id=convert?.stf_id
      setStaff(combine)
      setStaffId(id)

    }
  }, [])
  const handleAdd = e => {
    e.preventDefault();
    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!startTime) {
      emptyFields.push('Start Time');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    }
    if (!participant) {
      emptyFields.push('Participant');
      
    } 
     if (!endTime) {
      emptyFields.push('End Time');
    }
    if (!odometerReadingS) {
      emptyFields.push('Odometer reading start');
    }
    if (!odometerReadingE) {
      emptyFields.push('Odometer reading End');
    }

    if (!totalKm) {
      emptyFields.push('Total K.M.');
      
    } if (!purposeJourney) {
      emptyFields.push('Purpose of the journey');
    }
    if (!vehicle) {
      emptyFields.push('Vehicle');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;

    const formData = new FormData();
    formData.append('vehicle_date', dateFormat);
    formData.append('vehicle_starttime', formattedTime);
    formData.append('vehicle_endtime', formattedEndTime);
    formData.append('odometer_reading_start', odometerReadingS);
    formData.append('odometer_reading_end', odometerReadingE);
    formData.append('total_km', totalKm);
    formData.append('staff', staffId);
    formData.append('participant', participant);
    formData.append('purpose_journey', purposeJourney);
    formData.append('vehicle',vehicle);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);

  
    let endpoint = "insertReporting?table=fms_vehicle_log";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check",data)
      //return data;
      console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdding(false);
      } else {
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
        <h1>Create Vehicle Log</h1>

<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          onChange={(newValue) => {setStartTime(newValue) }}
         
        />
         </LocalizationProvider>
         


        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          onChange={(newValue) => {setEndTime(newValue) }}
         
        />
         </LocalizationProvider>
         
        

        <TextField
          value={odometerReadingS}
            label="Odometer reading start"
            type="text"
            onChange={(e)=>{setOdometerReadingS(e.target.value)}}
          />

<TextField
          value={odometerReadingE}
            label="Odometer reading End"
            type="text"
            onChange={(e)=>{setOdometerReadingE(e.target.value)}}
          />  
          <TextField
          value={totalKm}
            label="Total K.M."
            type="text"
            onChange={(e)=>{setTotalKm(e.target.value)}}
          />   

          <TextField
          value={purposeJourney}
            label="Purpose of the journey"
            type="text"
            onChange={(e)=>{setPurposeJourney(e.target.value)}}
          />  
             <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Vehicle '>Vehicle</InputLabel>
          <Select
            labelId='Vehicle'
            id='Vehicle'
            value={vehicle}
            label='Vehicle'
            onChange={e => setVehicle(e.target.value)}
          >
          
                  <MenuItem value='Company'>Company</MenuItem>
                  <MenuItem value='Private'>Private</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>



             
          </Select>
        </FormControl>


<FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
          <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>

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
        
     
          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"spacing={2}>
                <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Submit</Button>
                
              </Stack>
          </Box>
      </Box>
    </div>
  );
};


export default Add;