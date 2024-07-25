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
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';

import Switch from '@mui/material/Switch';


const Add = ({setIsAdding,setShow }) => {

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [userName, setUserName] = useState('')
  const [email,   setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [youAreA, setYouAreA] = useState('');
  const [typeFeedback, setTypeFeedback] = useState('');

  const [feedback, setFeedback] = useState('');
  
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
    if (!youAreA) {
      emptyFields.push('You are a?');
    }
    if (!typeFeedback) {
      emptyFields.push('Type of feedback');
      
    } if (!feedback) {
      emptyFields.push('Feedback');
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
   
    const formData = new FormData();
    formData.append('fedbck_date', dateFormat);
    formData.append('fedbck_name', userName);
    formData.append('fedbck_email', email);
    formData.append('fedbck_phone', phone);
    formData.append('You_are_a', youAreA);
    formData.append('fedbck_type',typeFeedback);
    formData.append('feedback',feedback);
    formData.append('company_id',companyId);
    formData.append('created_at',currentTime);

  



    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
  
    
    let endpoint = "insertReporting?table=fms_feedback";
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
        <h1>Create Feedback</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>
        <TextField
          value={userName}
            label="Name"
            type="text"
            onChange={(e)=>{setUserName(e.target.value)}}
          />
           <TextField
          value={email}
            label="Email"
            type='email'
            onChange={(e)=>{setEmail(e.target.value)}}
          />
           <TextField
          value={phone}
            label="Phone"
            type="number"
            onChange={(e)=>{setPhone(e.target.value)}}
          />

           <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Youarea?'>You are a?</InputLabel>
          <Select labelId='Youarea?' id='Youarea?' value={youAreA} label='You are a?' onChange={e => setYouAreA(e.target.value)}>
          <MenuItem  value='Family or Guardian'>Family or Guardian</MenuItem>
          <MenuItem  value='Participant'>Participant</MenuItem>
          <MenuItem  value='Staff'>Staff</MenuItem>
          <MenuItem  value='Support Coordinator'>Support Coordinator</MenuItem>
          <MenuItem  value='other'>other</MenuItem>

          </Select>


        </FormControl>
        
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='typeFeedback'>Type of feedback</InputLabel>
          <Select labelId='typeFeedback' id='Youarea?' value={typeFeedback} label='Type of feedback' onChange={e => setTypeFeedback(e.target.value)}>
          <MenuItem  value='Complaint'>Complaint</MenuItem>
          <MenuItem  value='Compliment'>Compliment</MenuItem>
          <MenuItem  value='FeedBack'>FeedBack</MenuItem>
          </Select>


        </FormControl>

        <TextField
          value={feedback}
          multiline
          rows={5}
            label="FeedBack"
            type="text"
            onChange={(e)=>{setFeedback(e.target.value)}}
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