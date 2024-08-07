import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST,  } from 'helper/ApiInfo'
import AuthContext from 'views/Login/AuthContext';
import { useNavigate } from 'react-router';

import '../../../style/document.css'
import { FormHelperText } from '@mui/material';

const Add = () => {

  const {companyId } = useContext(AuthContext)
  const [hours, setHours] = useState(0);
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [staff, setStaff] = useState('');

  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])
  const [totalHours, setTotalHours] = useState();
  const [description, setDescription] = useState('')
  const [action, setAction] = useState('');
  const [staffId,setStaffId]=useState(null)
  const navigate  =useNavigate()
const [errors ,setErrors]=useState()
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const differenceInMilliseconds = Math.abs(end - start);
      const hours = differenceInMilliseconds / (1000 * 60 * 60);
      const hrs =hours.toFixed(2); // Update hours state
      if(hrs>0){
        setTotalHours(hrs)
      }
    }
  }, [startTime,endTime]);
  //console.log(hours); 



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

  
  const goBack=()=>{
    navigate(-1)
  }
  const handleAdd = e => {
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


    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    //const id = employees.length + 1+1;
    const data = {
      slpdis_stfid:staffId,
      slpdis_date:date,
      slpdis_starttime:startTime,
      slpdis_endtime:endTime,
      slpdis_prtcpnt:participant,
      slpdis_hour:totalHours,
      slpdis_dscrptn:description,
      slpdis_action:action,
      company_id:companyId,
      created_at:currentTime,

    };
    
    
    let endpoint = 'insertData?table=fms_stf_slepdisterbnc';
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
            setTimeout(() => {
          
              navigate('/staff/sleep-disturbances')
      
            }, 1700)
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

  //console.log(totalHours);
  
  return (
    <div className="small-container">

      <Box
        component="form"
       
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
        <h1>Create Sleep Disturbance</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
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
            required

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
          <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
          <FormHelperText>{errors?.staff}</FormHelperText>
        </FormControl>

       
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
            required

            labelId='participant'
            id='participant'
            value={participant}
            label='Participant'
            onChange={(e) => {
              setParticipant(e.target.value);
              if (e.target.value) {
                setErrors((prevErrors) => ({ ...prevErrors, participant: '' }));
              }
            }}
            error={!!errors?.participant}
            helperText={errors?.participant}
          >
            {
              participantList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
          <FormHelperText>{errors?.participant}</FormHelperText>
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
		
		


          
          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"
                    spacing={2}>
                <Button variant="outlined" color="error" onClick={goBack} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Submit</Button>
                
              </Stack>
          </Box>
      </Box>
    </div>
  );
};


export default Add;