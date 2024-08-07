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
import '../../../style/document.css'
import { IMG_BASE_URL } from '../../../helper/ApiInfo'
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import Swal from 'sweetalert2';
import { Upload } from 'antd';
import Chip from '@mui/material/Chip';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import {COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import AuthContext from 'views/Login/AuthContext';

const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {
 


  const {companyId}=useContext(AuthContext)


  const id = selectedData.vehicle_id;
  const [date, setDate] = useState(selectedData.vehicle_date ? dayjs(selectedData.vehicle_date) : null)
  const [startTime, setStartTime] = useState(selectedData.vehicle_starttime ? dayjs(selectedData.vehicle_starttime, 'HH:mm') : null);
  const [endTime, setEndTime] = useState(selectedData.vehicle_endtime ? dayjs(selectedData.vehicle_endtime, 'HH:mm') : null);
  // const [staffId,setStaffId]=useState(null)

  const [odometerReadingS, setOdometerReadingS] = useState(selectedData.odometer_reading_start);
  const [odometerReadingE, setOdometerReadingE] = useState(selectedData.odometer_reading_end);

  const [totalKm, setTotalKm] = useState(selectedData.total_km);
  const [purposeJourney, setPurposeJourney] = useState(selectedData.purpose_journey);

  const [vehicle, setVehicle] = useState(selectedData.vehicle);



  const [staff, setStaff] = useState(selectedData.staff);
  const [staffList, setStaffList] = useState([])

  const [participant, setParticipant] = useState(selectedData.participant);
  const [participantList, setParticipantList] = useState([])

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
    setShow(true);
    return () => setShow(false);
  }, [setShow]);

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
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
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
    formData.append('staff', staff);
    formData.append('participant', participant);
    formData.append('purpose_journey', purposeJourney);
    formData.append('vehicle', vehicle);
    formData.append('updated_at', currentTime);
    // formData.append('action_taken', actionTakenLeading);


    let endpoint = 'updateReporting?table=fms_vehicle_log&field=vehicle_id&id=' + id;
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
  
  <div className="small-container" >
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '50ch' }
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleUpdate}
        >
          <h1 className='form_heading'>Edit Vehicle Log</h1>

          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker label="Start Date" format='DD/MM/YYYY'  value={date}  onChange={(newValue) => { setDate(newValue) }} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
          
            value={startTime}
              label="Start Time"
              onChange={(newValue) => { setStartTime(newValue) }}

            />
          </LocalizationProvider>



          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
          
            value={endTime}
              label="End Time"
              onChange={(newValue) => { setEndTime(newValue) }}

            />
          </LocalizationProvider>



          <TextField
            value={odometerReadingS}
            label="Odometer reading start"
            type="text"
            onChange={(e) => { setOdometerReadingS(e.target.value) }}
          />

          <TextField
            value={odometerReadingE}
            label="Odometer reading End"
            type="text"
            onChange={(e) => { setOdometerReadingE(e.target.value) }}
          />
          <TextField
           
            value={totalKm}
            label="Total K.M."
            type="text"
            onChange={(e) => { setTotalKm(e.target.value) }}
          />

          <TextField
            value={purposeJourney}
            label="Purpose of the journey"
            type="text"
            onChange={(e) => { setPurposeJourney(e.target.value) }}
          />
          <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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


          <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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



          <Box >
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
