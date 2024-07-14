import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import '../../../style/document.css'

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'

import Swal from 'sweetalert2';
import { Card, CardContent,Typography } from '@mui/material'
const Edit = ({ selectedData, setIsEditing, allowPre,setShow }) => {
  // const currentDate = new Date();

  const id = selectedData.balance_id;
  const [date, setDate] = useState(selectedData.date? dayjs(selectedData.date): null)
  const [time, setTime] = useState(selectedData.time ? dayjs(selectedData.time, 'HH:mm') : null);

  const [staff, setStaff] = useState(selectedData.staff_id);
  const[staffList,setStaffList]=useState([])

  const [participant, setParticipant] = useState(selectedData.participant_id);
  const [participantList,setParticipantList]=useState([])

  const [name, setName] = useState(selectedData.name);
  const [balance  , setBalance] = useState(selectedData.balance);


  
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  
  useEffect(() => {
    if (selectedData) {
      const updateData = selectedData && selectedData.updated_at
  
      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedData.created_at
  
      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedData]);useEffect(() => {
    if (selectedData) {
      const updateData = selectedData && selectedData.updated_at
  
      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedData.created_at
  
      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedData]);

 useEffect(() => {
  setShow(true);
  return () => setShow(false); 
}, [setShow]);

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
const getStaff = async () => {
  try {
    let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
    if(response.status) {  
      setStaffList(response.messages)
     
    } else {
      throw new Error('Network response was not ok.')
    }
  } catch (error) {
    console.error('Error fetching staff data:', error)
  }
}

useEffect(() => {

  getStaff();
  getRole();
}, [])


  const handleUpdate = (e) => {
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
      
    } if (!time) {
      emptyFields.push('Time');
    }
    if (!name) {
      emptyFields.push('Name');
    }

    if (!balance) {
      emptyFields.push('Balance');
      
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
   
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();
    formData.append('staff_id', staff);
    formData.append('date', dateFormat);
    formData.append('time', formattedTime);
    formData.append('participant_id', participant);
    formData.append('name', name);
    formData.append('balance', balance);
    formData.append('updated_at', currentTime);

    let endpoint = 'updateReporting?table=fms_prn_balance&field=balance_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
     
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        });
      }
    });
  };

  return (
    <>
    <div className="small-container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleUpdate}
      >
        <h1>Edit PRN Balance</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
           value={dayjs(date)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>
       
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Time"
          value={time}
          onChange={(newValue) => {setTime(newValue) }}
         
        />
         </LocalizationProvider>
         <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
          {staffList?.map(item => {
              return (
                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                  {item?.stf_firstname} {item?.stf_lastname}
                </MenuItem>
              )
            })}
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
        <TextField
          value={name}
            label="Name "
           
            type="text"
            onChange={(e)=>{setName(e.target.value)}}
          />
<TextField
          value={balance}
            label="Balance"
           
            type="text"
            onChange={(e)=>{setBalance(e.target.value)}}
          />
          
          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"
                    spacing={2}>
                <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                {allowPre.edit ? (
                <Button variant="outlined" type="submit">
                  Update
                </Button>
              ) : (
                ''
              )}
                
              </Stack>
          </Box>

      </Box>
    </div>
    <Card className='update_card' >
        <CardContent className='updateChild' >
          <div className="uppercase">
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>
    
  );
};

export default Edit;
