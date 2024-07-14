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
import Chip from '@mui/material/Chip';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
 import '../../../style/document.css'
 import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR,GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

 import { Card, CardContent, Typography, Grid } from '@mui/material';
 import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Add = ({setIsAdding,setShow }) => {

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState(null);
  const [startLocation, setStartLocation] = useState('');

  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState(null);
  const [endLocation, setEndLocation] = useState('');
  // const [staffId,setStaffId]=useState(null)

  const [staff, setStaff] = useState([]);
 const[staffList,setStaffList]=useState([])

  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])

  const [isAuthorised,setIsAuthorised]=useState('')
  const [type, setType] = useState([])
  const [typeList, setTypeList] = useState([])

  const [impact, setImpact] = useState('');

  const [injury , setInjury] = useState('');
  const [wasReportable , setWasReportable ] = useState('');
  const [anyWitness, setAnyWitness] = useState('');
  const [reason, setReason] = useState('');
  const [behaviour , setBehaviour] = useState('');
  const [actionsTakenResponse  , setActionsTakenResponse ] = useState('');
  const [alternatives , setAlternatives ] = useState('');
  const [actionTakenLeading , setActionTakenLeading] = useState('');



  const [staffOpen, setStaffOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);


  const handleClose = () => {
    setStaffOpen(false); 
    setTypeOpen(false)
  };
  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])



 
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
  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setStaffList(response.messages)
       console.log(response.messages);
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }
  
  const getRestrictive = async()=>{
  let endpoint = 'getAll?table=admin_restrictive_practice&select=admin_res_prac_id,res_prac_name';
  
    let response =await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        
      },
    })
    if(response.ok){
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


  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname= convert?.stf_lastname
      const combine =`${finalStaff} ${lname}`
      const id=convert?.stf_id
      setStaff([id])
  

    }
  }, [])


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
    formData.append('type',type);
    formData.append('impact_person',impact);
    formData.append('injury_person',injury);
    formData.append('reportable_incident',wasReportable);
    formData.append('any_witness',anyWitness);
    formData.append('reason_behind',reason);
    formData.append('describe_behaviour',behaviour);
    formData.append('actions_taken',actionsTakenResponse);
    formData.append('alternatives_considered',alternatives);
    formData.append('action_taken',actionTakenLeading);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);

  
    let endpoint = "insertReporting?table=fms_restrictive_practice_logs";
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
    <div className="small">

      <Box
      className='left_side'
        component="form"
       
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
        <h1>Create Restrictive Practice Log</h1>
 <Box className="obDiv">
<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          onChange={(newValue) => {setStartTime(newValue) }}
         
        />
         </LocalizationProvider>
         
         <TextField
          value={startLocation}
            label=" Start Location"
            type="text"
           
            onChange={(e)=>{setStartLocation(e.target.value)}}
          />
</Box>
<Box className="obDiv">
<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="End Date" format='DD/MM/YYYY' onChange={(newValue) => {setEndDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          onChange={(newValue) => {setEndTime(newValue) }}
         
        />
         </LocalizationProvider>
         
         <TextField
          value={endLocation}
            label="End Location"
            type="text"
           
            onChange={(e)=>{setEndLocation(e.target.value)}}
          />
</Box>
<FormControl className='inp_width' required>
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
        
        <FormControl className='inp_width' required>
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
                {selected?.map((value) => 
               {
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
              staffList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
       
        <FormControl className='inp_width' required>
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

        <FormControl className='inp_width' required>
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
                {selected?.map((value) => 
               {
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
              typeList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.admin_res_prac_id} value={item?.admin_res_prac_id}>{item?.res_prac_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>

     


    
        <TextField
        className='inp_width'
          value={impact}
            label="Impact on any person "
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setImpact(e.target.value)}}
          />
            <TextField className='inp_width'
          value={injury}
            label="Injury to any person"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setInjury(e.target.value)}}
          />

<FormControl className='inp_width' required>
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
        <TextField className='inp_width' 
          value={anyWitness}
            label="Any witness"
            type="text"
            onChange={(e)=>{setAnyWitness(e.target.value)}}
          />
            <TextField className='inp_width'
          value={reason}
            label="Reason behind use"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setReason(e.target.value)}}
          />
            <TextField className='inp_width'
          value={behaviour}
            label="Describe behaviour"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setBehaviour(e.target.value)}}
          />
            <TextField className='inp_width'
          value={actionsTakenResponse}
            label="Actions taken in response"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setActionsTakenResponse(e.target.value)}}
          />
           <TextField className='inp_width'
          value={alternatives}
            label="Alternatives considered"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setAlternatives(e.target.value)}}
          />
           <TextField className='inp_width'
          value={actionTakenLeading}
            label="Action taken leading up to"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setActionTakenLeading(e.target.value)}}
          />




          
          <Box  className="form_btn">
              <Stack direction="row-reverse"
                    spacing={2} >
                <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Submit</Button>
                
              </Stack>
          </Box>
      </Box>
      <Box className='right_side'>
      <Card  >
      <CardContent className='updateChild' >

      <div className="uppercase" style={{marginTop:"10px"}}>
          <Typography variant="h6">Resource</Typography>
          <div className='resource'>
            <a>
              <div className='resource_title'>
              <InsertDriveFileIcon style={{fontSize:'15px'}}/>
              <span>Medication associated </span>
              </div>
          
            </a>
          </div>
          <div className='resource'>
            <a >
              <div className='resource_title'>
              <InsertDriveFileIcon style={{fontSize:'15px'}}/>
              <span>Medication associated with swallowing problems </span>
              </div>
          
            </a>
          </div>
        
        
        </div>
   

       



      </CardContent>
    </Card>
      </Box>

      
    </div>
  );
};


export default Add;