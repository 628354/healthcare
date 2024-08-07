import React, { useContext, useEffect, useState } from 'react';
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
  import AuthContext from 'views/Login/AuthContext'
  import { useLocation, useNavigate } from 'react-router';
const Edit = () => {
  // const currentDate = new Date();

  const {companyId}=useContext(AuthContext)
  const locationD = useLocation()

  const { allowPre, selectedData } = locationD.state
  const id = selectedData.slpdis_id;
const navigate =useNavigate()
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
  const [errors ,setErrors]=useState(null)

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
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant+companyId)
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
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.staff+companyId)
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
    let hasError = false;
    const newErrors = {};

    if (!date) {
      newErrors.date = 'Date is required';
      hasError = true;
    }
    if (!participant) {
      newErrors.participant = 'Participant is required';
      hasError = true;
    }
    if (!staff) {
      newErrors.staff = 'Staff is required';
      hasError = true;
    }
    if (!startTime) {
      newErrors.startTime = 'Start Time is required';
      hasError = true;
    }
    if (!endTime) {
      newErrors.endTime = 'End Time is required';
      hasError = true;
    }
    if (!totalHours) {
      newErrors.totalHours = 'Total Hours is required';
      hasError = true;
    }
    if (!description) {
      newErrors.description = 'Description is required';
      hasError = true;
    }
    if (!action) {
      newErrors.action = 'Action is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
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
      // //console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          
          navigate('/staff/sleep-disturbances')
  
        }, 1700)
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

  const goBack=()=>{
    navigate(-1)
  }

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
            required
            onChange={newValue => {
              setDate(newValue);
              if (newValue) {
                setErrors((prevErrors) => ({ ...prevErrors, date: '' }));
              }
            }}
            
            slotProps={{
              textField: {
                helperText: errors?.date,
               
              },
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={dayjs(startTime, 'HH:mm')}
            label="Start Time"
            onChange={(newValue) => { setStartTime(newValue)
              if (newValue) {
                setErrors((prevErrors) => ({ ...prevErrors, startTime: '' }));
              }
             }}
             slotProps={{
              textField: {
                helperText: errors?.startTime,
               
              },
            }}
            required
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={dayjs(endTime, 'HH:mm')}
            label="End Time"
            onChange={(newValue) => { setEndTime(newValue)
              if (newValue) {
                setErrors((prevErrors) => ({ ...prevErrors, endTime: '' }));
              }
             }}
             
             slotProps={{
              textField: {
                helperText: errors?.endTime,
               
              },
            }}
          />
        </LocalizationProvider>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select required labelId='Staff' id='Staff' value={staff} label='Staff'onChange={(e) => {
    setStaff(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, staff: '' }));
    }
  }} error={!!errors?.staff}
            helperText={errors?.staff}>
            {staffList?.map(item => {
              return (
                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                  {item?.stf_firstname} {item?.stf_lastname}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id="participant">Participant</InputLabel>
          <Select
            labelId="participant"
            id="participant"
            value={participant}
            label="Participant"
            onChange={(e) => {
              setParticipant(e.target.value);
              if (e.target.value) {
                setErrors((prevErrors) => ({ ...prevErrors, participant: '' }));
              }
            }}
            error={!!errors?.participant}
            helperText={errors?.participant}
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
          onChange={(e)=>{setTotalHours(e.target.value);if (totalHours) {
            setErrors((prevErrors) => ({ ...prevErrors, totalHours: '' }));
          } }}
          helperText={errors? errors?.totalHours: ""}
          error={!!errors?.totalHours}
        />
        <TextField
          value={description}
          multiline
          rows={5}
          label="Description"
          type="text"
          onChange={(e)=>{setDescription(e.target.value);if (e.target.value) {
            setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
          }}}
          required
          helperText={errors? errors?.description: ""}
          error={!!errors?.description}
        />
        <TextField
          value={action}
          multiline
          label="Action"
          type="text"
          onChange={(e)=>{setAction(e.target.value);if (e.target.value) {
            setErrors((prevErrors) => ({ ...prevErrors, action: '' }));
          }}}
          rows={5}
          helperText={errors? errors?.action: ""}
          error={!!errors?.action}
        />

        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={goBack} type="button">
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
