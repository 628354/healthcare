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
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// css import 
// import '../../../../style/document.css'
import { Upload } from 'antd';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo';
// import { useSelector } from 'react-redux';
// import { UploadOutlined } from '@ant-design/icons';


const Add = ({setIsAdding }) => {
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const currentDate = new Date()

  const oversee=localStorage.getItem('user')
  const convert=JSON.parse(oversee)
  console.log(convert);
  const finalStaff=convert?.stf_firstname;
  const finalStaffId=convert?.stf_id;
  const [date, setDate] = useState('');
  const [time, setTime] = useState(null);
  const[staff,setStaff]=useState(finalStaff)
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])

  const [subject, setSubject] = useState('');
  const [communicationWith, setCommunicationWith] = useState('');
  const [description, setDescription] = useState('')
  const [attachment, setAttachment] = useState([]);

//  const companyId = 1
  
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
    // Handle the error as needed, such as showing a message to the user.
  }
}

useEffect(()=>{
getRole();
},[])




const handleChange = (e) => {
  const files = e.fileList;
  console.log(files);
  const fileList = [];
  for (let i = 0; i < files.length; i++) {
    fileList.push(files[i].originFileObj); 
  }
  setAttachment(fileList);
};




  const handleAdd = e => {
    e.preventDefault();
   
    const emptyFields = [];

    // Simple form validation
    if (!date) {
      emptyFields.push('Date');
    }
    if (!time) {
      emptyFields.push('Time');
    }
    if (!subject) {
      emptyFields.push('Subject');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Satff');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    //const id = employees.length + 1+1;
    // const fileName = attachment.split('\\').pop().split('/').pop();
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); 
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;


    const formData = new FormData();
    formData.append('comm_date', formattedDate);
    formData.append('comm_stfid', finalStaffId);
    formData.append('comm_prtcpntid', participant);
    formData.append('comm_time', formattedTime);
    formData.append('comm_dscrptn', description);
    formData.append('comm_subj',subject);
    formData.append('comm_with',communicationWith);
    formData.append('company_id',companyId);
    formData.append('created_at', currentTime);


    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    
    let endpoint = 'insertMedia?table=fms_commlogs';
    let response = COMMON_ADD_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
  
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(false);
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
         <h1>Create Communication Log</h1>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)} onChange={(newValue) => {setDate(newValue) }} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Time"
          onChange={(newValue) => {setTime(newValue) }}
         
        />
         </LocalizationProvider>

         <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='staff'>Staff</InputLabel>
          <Select
            labelId='staff'
            id='staff'
            value={staff}
            label='Staff'
            onChange={e => setStaff(e.target.value)}
          >
              <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
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
          required
          label='Subject'
          value={subject}
          onChange={e => {
            setSubject(e.target.value)
          }}
        />
        <TextField
          value={communicationWith}
            multiline
            label="Communication with "
            type="text"
            onChange={(e)=>{setCommunicationWith(e.target.value)}}
          />
           <TextField
          value={description}
            multiline
            label="Description"
            type="text"
            onChange={(e)=>{setDescription(e.target.value)}}
          />

		

			
     
         
       
<Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
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

