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
import { Upload } from 'antd';
import Chip from '@mui/material/Chip';

//select field
import { BASE_URL,COMMON_ADD_FUN,COMMON_GET_FUN,COMMON_GET_PAR,GET_PARTICIPANT_LIST,companyId} from 'helper/ApiInfo';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
 import '../../style/document.css'
// import Switch from '@mui/material/Switch';


const Add = ({setIsAdding}) => {

  
  const currentDate = new Date()
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState(null);

  const [endTime, setEndTime] = useState(null);

  const [staff, setStaff] = useState([]);
 const[staffList,setStaffList]=useState([])

  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])



  const [service , setService] = useState('');
  const [serviceL , setServiceL] = useState([]);

  const [claimType , setClaimType] = useState('');
  const [claimTypeL, setClaimTypeL] = useState([]);

  const [notes, setNotes] = useState('');
  
  const [attachment, setAttachment] = useState([]);

  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setAttachment(fileList);
  };

 
  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
       console.log(response);
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
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
      // Handle the error as needed, such as showing a message to the user.
    }
  }
  const getServices= async()=>{
  let endpoint = 'getAll?table=services&select=services_id,services_name';
  
    let response =await COMMON_GET_FUN(BASE_URL,endpoint)
     console.log(response);
    if(response.status){
     
      setServiceL(response.messages)
    }
  
  } 
  const getClaimType= async()=>{
    let endpoint = 'getAll?table=claim_type&select=claim_type_id,claim_name';

  
    let response =await COMMON_GET_FUN(BASE_URL,endpoint)
     console.log(response);
    if(response.status){
     
      setClaimTypeL(response.messages)
    }
  
  }
  
  

  useEffect(() => {
    getServices();
    getClaimType();
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
    if (!startTime) {
      emptyFields.push('Start Time');
    }
    if (!endTime) {
      emptyFields.push('End Time');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!service) {
      emptyFields.push('Service');
    }
    if (!claimType) {
      emptyFields.push('Claim Type');
    }
    if (!notes) {
      emptyFields.push('notes');
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

    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;

    const formData = new FormData();
    formData.append('srvc_date', dateFormat);
    formData.append('srvc_strttime', formattedTime);
    formData.append('srvc_endtime', formattedEndTime);
  

    formData.append('srvc_stfid', staff);
    formData.append('srvc_prtcpntid', participant);
    formData.append('srvc_service',service);

    formData.append('srvc_claim', claimType);
    formData.append('srvc_note', notes);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);


    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
    let endpoint = "insertService?table=fms_srvcdlvry";
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
        <h1>Create Service Delivery</h1>
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
         
         
          <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          onChange={(newValue) => {setEndTime(newValue) }}
         
        />
         </LocalizationProvider>
</Box>
<FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select
            labelId='Staff'
            id='Staff'
            value={staff}
            label='Staff'
           
            onChange={e => setStaff(e.target.value)}
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
        
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='participant'>Service</InputLabel>
          <Select
            labelId='Service'
            id='Service'
            value={service}
            label='Service'
            onChange={e => setService(e.target.value)}
          >
            {
              serviceL?.map((item)=>{
             
                return(
                  <MenuItem key={item?.services_id} value={item?.services_id}>{item?.services_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='participant'>Claim Type</InputLabel>
          <Select
            labelId='claimType'
            id='claimType'
            value={claimType}
            label='claimType'
            onChange={e => setClaimType(e.target.value)}
          >
            {
              claimTypeL?.map((item)=>{
             
                return(
                  <MenuItem key={item?.claim_type_id} value={item?.claim_type_id}>{item?.claim_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
        <TextField
            value={notes}
            label="Notes"
            type="text"
            multiline
            rows={5}
            onChange={(e) => { setNotes(e.target.value) }}
          />
  
  <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple  listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>

     


    
     



          
          <Box sx={{width: '100ch',m:1}}>
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