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

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Swal from 'sweetalert2';
import {COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
const Edit = ({ selectedData, setIsEditing, allowPre }) => {
  // const currentDate = new Date();

  const id = selectedData.slpdis_id;

  const [date, setDate] = useState(dayjs(selectedData.slpdis_date));
  const [startTime, setStartTime] = useState(selectedData.slpdis_starttime);
  const [endTime, setEndTime] = useState(selectedData.slpdis_endtime);
  const [staff, setStaff] = useState(selectedData.slpdis_stfid);
  const [participant, setParticipant] = useState(selectedData.slpdis_prtcpnt);
  const [participantList, setParticipantList] = useState([]);
  const [totalHours, setTotalHours] = useState(selectedData.slpdis_hour);
  const [description, setDescription] = useState(selectedData.slpdis_dscrptn);
  const [action, setAction] = useState(selectedData.slpdis_action);
  const [staffList, setStaffList] = useState([])

 // const [staffId, setStaffId] = useState(null);
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
 }, [selectedData]);
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const differenceInMilliseconds = Math.abs(end - start);
      const hours = differenceInMilliseconds / (1000 * 60 * 60);
      const hrs = hours.toFixed(2); // Update hours state
      if (hrs > 0) {
        setTotalHours(hrs);
      }
    }
  }, [startTime, endTime]);
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
    getRole();
    getStaff()
  }, []);

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
      
    } if (!startTime) {
      emptyFields.push('Start Time');
    }
    if (!endTime) {
      emptyFields.push('End time');
    }

    if (!totalHours) {
      emptyFields.push('Total hours');
      
    } if (!description) {
      emptyFields.push('Description');
    }
    if (!action) {
      emptyFields.push('Actions');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }


    const dateFormat = date ? date.format('YYYY-MM-DD') : null;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();

 
    formData.append('slpdis_stfid', staff);
    formData.append('slpdis_date',dateFormat)
    formData.append('slpdis_starttime',startTime)
    formData.append('slpdis_endtime',endTime)
    formData.append('slpdis_prtcpnt', participant);
    formData.append('slpdis_hour', totalHours);
    formData.append('slpdis_dscrptn', description);
    formData.append('slpdis_action', action);
    formData.append('updated_at', currentTime);

    let endpoint = 'updateAll?table=fms_stf_slepdisterbnc&field=slpdis_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      // console.log(data.status);
      //return data;
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
        <h1>Edit Sleep Disturbance</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dayjs(date)}
            format="DD/MM/YYYY"
            
            onChange={(newValue) => {
              setDate(newValue);
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={dayjs(startTime, 'HH:mm')}
            label="Start Time"
            onChange={(newValue) => {
              setStartTime(newValue.format('HH:mm'));
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={dayjs(endTime, 'HH:mm')}
            label="End Time"
            onChange={(newValue) => {
              setEndTime(newValue.format('HH:mm'));
            }}
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
          <InputLabel id="participant">Participant</InputLabel>
          <Select
            labelId="participant"
            id="participant"
            value={participant}
            label="Participant"
            onChange={(e) => setParticipant(e.target.value)}
          >
            {participantList?.map((item) => {
              return (
                <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>
                  {item?.prtcpnt_firstname} {item?.prtcpnt_lastname}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          required
          value={totalHours}
          // label="Total Hours"
          type="text"
          onChange={(e) => {
            setTotalHours(e.target.value);
          }}
        />
        <TextField
          value={description}
          multiline
          label="Description"
          type="text"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TextField
          value={action}
          multiline
          label="Action"
          type="text"
          onChange={(e) => {
            setAction(e.target.value);
          }}
        />

        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </Button>
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
