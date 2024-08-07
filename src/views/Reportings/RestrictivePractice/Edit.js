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
import { IMG_BASE_URL ,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'

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
import AuthContext from 'views/Login/AuthContext';

import { Card, CardContent, Typography, Grid } from '@mui/material';
const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {

  const {companyId}=useContext(AuthContext)
  console.log(selectedData);
  const id = selectedData.practice_id;
  const [date, setDate] = useState(selectedData.start_date ? dayjs(selectedData.start_date) : null)
  const [startTime, setStartTime] = useState(selectedData.start_time ? dayjs(selectedData.start_time, 'HH:mm') : null);
  const [startLocation, setStartLocation] = useState(selectedData.start_location);

  const [endDate, setEndDate] = useState(selectedData.end_date ? dayjs(selectedData.end_date) : null)
  const [endTime, setEndTime] = useState(selectedData.end_time ? dayjs(selectedData.end_time, 'HH:mm') : null);
  const [endLocation, setEndLocation] = useState(selectedData.end_location);
  // const [staffId,setStaffId]=useState(null)

  const [staff, setStaff] = useState(selectedData.staff_id.split(','));
  const [staffList, setStaffList] = useState([])

  const [participant, setParticipant] = useState(selectedData.participant_id);
  const [participantList, setParticipantList] = useState([])

  const [isAuthorised, setIsAuthorised] = useState(selectedData.is_authorised)
  const [type, setType] = useState(selectedData.type.split(','));
  const [typeList, setTypeList] = useState([])

  const [impact, setImpact] = useState(selectedData.impact_person);

  const [injury, setInjury] = useState(selectedData.injury_person);
  const [wasReportable, setWasReportable] = useState(selectedData.reportable_incident);
  const [anyWitness, setAnyWitness] = useState(selectedData.any_witness);
  const [reason, setReason] = useState(selectedData.reason_behind);
  const [behaviour, setBehaviour] = useState(selectedData.describe_behaviour);
  const [actionsTakenResponse, setActionsTakenResponse] = useState(selectedData.actions_taken);
  const [alternatives, setAlternatives] = useState(selectedData.alternatives_considered);
  const [actionTakenLeading, setActionTakenLeading] = useState(selectedData.action_taken);



  const [staffOpen, setStaffOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

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

  const handleClose = () => {
    setStaffOpen(false);
    setTypeOpen(false)
  };

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


  const getRestrictive = async () => {
    let endpoint = 'getAll?table=admin_restrictive_practice&select=admin_res_prac_id,res_prac_name';

    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setTypeList(res.messages)
      // console.log(res);
    }

  }
  useEffect(() => {
    getRestrictive();
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
      
    } if (!startTime) {
      emptyFields.push('Start Time');
    }
    if (!endDate) {
      emptyFields.push('End date');
    }

    if (!endTime) {
      emptyFields.push('End time');
      
    } if (!startLocation) {
      emptyFields.push('Start location');
    }
    if (!endLocation) {
      emptyFields.push('End location');
    }


    if (!isAuthorised) {
      emptyFields.push('Is authorised?');
      
    } if (!type) {
      emptyFields.push('Type');
    }
    if (!impact) {
      emptyFields.push('Impact on any person');
    }

    // 
    if (!injury) {
      emptyFields.push('Injury to any person');
    }

    if (!wasReportable) {
      emptyFields.push('Was reportable incident');
      
    } if (!anyWitness) {
      emptyFields.push('Any witness');
    }
    if (!reason) {
      emptyFields.push('Reason behind use');
    }


    if (!behaviour) {
      emptyFields.push('Describe behaviour');
      
    } if (!actionsTakenResponse) {
      emptyFields.push('Actions taken in response');
    }
    if (!alternatives) {
      emptyFields.push('Alternatives considered');
    }
    if (!actionTakenLeading) {
      emptyFields.push('Action taken leading up to');
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
    const endDateFormat = endDate ? endDate.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;

    const formData = new FormData();
    formData.append('start_date', dateFormat);
    formData.append('end_date', endDateFormat);
    formData.append('start_time', formattedTime);
    formData.append('end_time', formattedEndTime);
    formData.append('start_location', startLocation);
    formData.append('end_location', endLocation);

    formData.append('staff_id', staff);
    formData.append('participant_id', participant);
    formData.append('is_authorised', isAuthorised);
    formData.append('type', type);
    formData.append('impact_person', impact);
    formData.append('injury_person', injury);
    formData.append('reportable_incident', wasReportable);
    formData.append('any_witness', anyWitness);
    formData.append('reason_behind', reason);
    formData.append('describe_behaviour', behaviour);
    formData.append('actions_taken', actionsTakenResponse);
    formData.append('alternatives_considered', alternatives);
    formData.append('action_taken', actionTakenLeading);
    formData.append('updated_at', currentTime);


    let endpoint = 'updateReporting?table=fms_restrictive_practice_logs&field=practice_id&id=' + id;
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
          <h1 className='form_heading'>Edit Restrictive Practice Log</h1>
          <Box className="obDiv">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Start Date" value={date} format='DD/MM/YYYY' onChange={(newValue) => { setDate(newValue) }} />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => { setStartTime(newValue) }}

              />
            </LocalizationProvider>

            <TextField
              value={startLocation}
              label=" Start Location"
              type="text"

              onChange={(e) => { setStartLocation(e.target.value) }}
            />
          </Box>
          <Box className="obDiv">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker value={endDate} label="End Date" format='DD/MM/YYYY' onChange={(newValue) => { setEndDate(newValue) }} />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => { setEndTime(newValue) }}

              />
            </LocalizationProvider>

            <TextField
              value={endLocation}
              label="End Location"
              type="text"

              onChange={(e) => { setEndLocation(e.target.value) }}
            />
          </Box>
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

          <FormControl sx={{ width: '50ch', m: 1 }} required>
            <InputLabel id='Staff'>Staff</InputLabel>
            <Select
              labelId='Staff'
              id='Staff'
              value={staff}
              label='Staff'
              open={staffOpen}
              onOpen={() => setStaffOpen(true)}
              onClose={() => setStaffOpen(false)}
              multiple
              onChange={(e) => {
                setStaff(e.target.value);
                handleClose(); // Close the dropdown after selecting an item
              }}
              renderValue={(selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selected?.map((value) => {
                    const selectedPractitioner = staffList.find(item => item?.stf_id === value);
                    // console.log(value);
                    return (
                      <Chip
                        key={value}
                        label={selectedPractitioner?.stf_firstname}
                        onDelete={() => handleDelete(value)} // Add onDelete function to remove the selected item
                        sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
                      />

                    )
                  })}
                </div>
              )}
            >
              {
                staffList?.map((item) => {

                  return (
                    <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

                  )

                })
              }
            </Select>
          </FormControl>

          <FormControl sx={{ width: '50ch', m: 1 }} required>
            <InputLabel id='IsAuthorised'>Is authorised?</InputLabel>
            <Select
              labelId='IsAuthorised'
              id='IsAuthorised'
              value={isAuthorised}
              label='Is authorised?'
              onChange={e => setIsAuthorised(e.target.value)}
            >

              <MenuItem value='1'>Yes</MenuItem>
              <MenuItem value='0'>No</MenuItem>



            </Select>
          </FormControl>

          <FormControl sx={{ width: '50ch', m: 1 }} required>
            <InputLabel id='type'>Type</InputLabel>
            <Select
              labelId='type'
              id='type'
              open={typeOpen}
              onOpen={() => setTypeOpen(true)}
              onClose={() => setTypeOpen(false)}
              value={type}
              label='Type'
              multiple
              onChange={(e) => {
                setType(e.target.value);
                handleClose(); // Close the dropdown after selecting an item
              }}
              renderValue={(selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selected?.map((value) => {
                    const selectedPractitioner = typeList.find(item => item?.admin_res_prac_id === value);
                    // console.log(value);
                    return (
                      <Chip
                        key={value}
                        label={selectedPractitioner?.res_prac_name}
                        onDelete={() => handleDelete(value)} // Add onDelete function to remove the selected item
                        sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
                      />

                    )
                  })}
                </div>
              )}
            >
              {
                typeList?.map((item) => {

                  return (
                    <MenuItem key={item?.admin_res_prac_id} value={item?.admin_res_prac_id}>{item?.res_prac_name}</MenuItem>

                  )

                })
              }
            </Select>
          </FormControl>





          <TextField
            value={impact}
            label="Impact on any person "
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setImpact(e.target.value) }}
          />
          <TextField
            value={injury}
            label="Injury to any person"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setInjury(e.target.value) }}
          />

          <FormControl sx={{ width: '50ch', m: 1 }} required>
            <InputLabel id='wasReportable'>Was reportable incident </InputLabel>
            <Select
              labelId='wasReportable'
              id='wasReportable'
              value={wasReportable}
              label='Was reportable incident'
              onChange={e => setWasReportable(e.target.value)}
            >

              <MenuItem value='1'>Yes</MenuItem>
              <MenuItem value='0'>No</MenuItem>



            </Select>
          </FormControl>
          <TextField
            value={anyWitness}
            label="Any witness"
            type="text"
            onChange={(e) => { setAnyWitness(e.target.value) }}
          />
          <TextField
            value={reason}
            label="Reason behind use"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setReason(e.target.value) }}
          />
          <TextField
            value={behaviour}
            label="Describe behaviour"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setBehaviour(e.target.value) }}
          />
          <TextField
            value={actionsTakenResponse}
            label="Actions taken in response"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setActionsTakenResponse(e.target.value) }}
          />
          <TextField
            value={alternatives}
            label="Alternatives considered"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setAlternatives(e.target.value) }}
          />
          <TextField
            value={actionTakenLeading}
            label="Action taken leading up to"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setActionTakenLeading(e.target.value) }}
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
