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
import '../../../style/document.css'

import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { BASE_URL, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo';

const Add = ({ setIsAdding, setShow }) => {
  const oversee = localStorage.getItem('user')
  const convert = JSON.parse(oversee)
  const finalStaff = convert?.stf_firstname;
  const staffId = convert?.stf_id
  const currentDate = new Date()

  // const finalStaffId=convert?.stf_id;
  const [date, setDate] = useState('');
  const [startTime, setstartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [staff, setStaff] = useState(finalStaff)
  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])



  const [inputValues, setInputValues] = useState([]);
console.log(inputValues);

  const calculateTimeRanges = () => {
    const timeRanges = [];
    if (startTime && endTime) {
      const startHour = dayjs(startTime).hour();
      const endHour = dayjs(endTime).hour();
      for (let i = startHour; i < endHour; i++) {
        const rangeStart = dayjs(startTime).set('hour', i).format('h:mm A');
        const rangeEnd = dayjs(startTime).set('hour', i + 1).format('h:mm A');
        timeRanges.push(`${rangeStart} - ${rangeEnd}`);
        
      }
    }
    return timeRanges;
  };


  // get user role

  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }


  const handleInputChange = (index, field, value, time) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = { ...newInputValues[index], [field]: value, time: time };
    setInputValues(newInputValues);
    console.log(newInputValues);
  };


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
 
    if (!startTime) {
      emptyFields.push('Shift start time');
    }
    if (!endTime) {
      emptyFields.push('Shift end time');
    }
 
    if (!staff) {
      emptyFields.push('Staff');
    }
    
    if (!participant) {
      emptyFields.push('Participant');
    }

    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
 
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;

    const data = {
      slp_date: formattedDate,
      slp_start_time: formattedTime,
      slp_end_time: formattedEndTime,
      slp_stfid: staffId,
      slp_prtcpntid: participant,
      slp_cmnt: inputValues,
      company_id: companyId,
      created_at: currentTime

    }

    let endpoint = 'insertSleepLog?table=fms_slplog';
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data);
    response.then((data) => {
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
        <h1>Create Sleep Log</h1>

        <Box className="obDiv">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date" format='DD/MM/YYYY' onChange={(newValue) => { setDate(newValue) }} minDate={dayjs(currentDate)} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              onChange={(newValue) => { setstartTime(newValue) }}

            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="End Time"
              onChange={(newValue) => { setEndTime(newValue) }}

            />
          </LocalizationProvider>

        </Box>


        <FormControl sx={{ width: '50ch', m: 1 }} required>
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
              participantList?.map((item) => {

                return (
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>


        {calculateTimeRanges().map((timeRange, index) => (
          <div key={index}>
            <FormControl sx={{ width: '50ch', m: 1 }} required>
              <InputLabel id='staff'>{`Activity From ${timeRange}`}</InputLabel>
              <Select
                value={inputValues[index]?.activityFrom || 'Sleep'}
                label={`Activity From ${timeRange}`}
                onChange={(e) => handleInputChange(index, 'activityFrom', e.target.value, timeRange)}
              >
                <MenuItem value="Sleep">Sleep</MenuItem>
                <MenuItem value="Awake">Awake</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>

              </Select>
            </FormControl>

            {/* <TextField
      value={inputValues[index]?.activityFrom || ''}
      label={`Activity From ${timeRange}`}
      type="text"
      onChange={(e) => handleInputChange(index, 'activityFrom', e.target.value,timeRange)}
    /> */}

            <TextField
              value={inputValues[index]?.comments || ''}
              label={`Comments`}
              type="text"
              onChange={(e) => handleInputChange(index, 'comments', e.target.value, timeRange)}
            />
          </div>))}



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

