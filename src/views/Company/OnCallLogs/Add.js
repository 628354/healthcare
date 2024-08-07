import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { BASE_URL, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST,  } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';



const Add = ({ setIsAdding, setShow }) => {
  
  const {companyId}=useContext(AuthContext)
  const oversee = localStorage.getItem('user')
  const convert = JSON.parse(oversee)
  //console.log(convert);
  const finalStaff = convert?.stf_firstname;
  const staffId = convert?.stf_id
  const currentDate = new Date()

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  // const finalStaffId=convert?.stf_id;
  const [date, setDate] = useState('');
  const [time, setTime] = useState(null);
  const [staff, setStaff] = useState(finalStaff)
  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])

  const [duration, setDuration] = useState('');
  const [communicationWith, setCommunicationWith] = useState('');
  const [description, setDescription] = useState('')
  const [actions, setActions] = useState('')
  const [followUp, setFollowUp] = useState('')


 


  // get user role

  const getRole = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant+companyId)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching Participant data:', error)
    }
  }
  useEffect(() => {
    getRole();
  }, [])

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
    if (!time) {
      emptyFields.push('Time');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!communicationWith) {
      emptyFields.push('Communication with');
    }
    if (!duration) {
      emptyFields.push('Duration');
    }
    if (!description) {
      emptyFields.push('Description ');
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
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;
    //console.log(formattedDate);

    const data = {

      call_date: formattedDate,
      call_tme: formattedTime,
      call_stfid: staffId,
      call_prtcpntsid: participant,
      call_dscrptn: description,
      call_duration: duration,
      call_action: actions,
      call_with: communicationWith,
      call_follwup: followUp,
      company_id: companyId,
      created_at:currentTime

    }
    
    let endpoint = 'insertData?table=fms_call_log';
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data);
    response.then((data) => {
      
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
        <h1>Create On Call Log</h1>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY' onChange={(newValue) => { setDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Time"
            onChange={(newValue) => { setTime(newValue) }}

          />
        </LocalizationProvider>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='staff'>Staff</InputLabel>
          <Select
            labelId='staff'
            id='staff'
            value={staff}
            label='Staff'
            onChange={e => setStaff(e.target.value)}
          >
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
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
              participantList?.map((item) => {

                return (
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>

        <TextField
          required
          label='Duration'
          value={duration}
          onChange={e => {
            setDuration(e.target.value)
          }}
        />
        <TextField
          value={communicationWith}
          multiline

          label="Communication with "
          type="text"
          onChange={(e) => { setCommunicationWith(e.target.value) }}
        />
        <TextField
          value={description}
          rows={5}
          multiline
          label="Description"
          type="text"
          onChange={(e) => { setDescription(e.target.value) }}
        />
        <TextField
          value={actions}
          multiline
          rows={5}
          label="Actions"
          type="text"
          onChange={(e) => { setActions(e.target.value) }}
        />

        <TextField
          value={followUp}
          multiline
          rows={5}
          label="Followup"
          type="text"
          onChange={(e) => { setFollowUp(e.target.value) }}
        />











        <Box sx={{ width: '100ch', m: 1 }}>
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

