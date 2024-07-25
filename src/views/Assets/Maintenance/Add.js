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

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN } from 'helper/ApiInfo';
import '../../../style/document.css'
import { useNavigate } from 'react-router';
// import Switch from '@mui/material/Switch';


const Add = ({setIsAdding,setShow }) => {

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [staff, setStaff] = useState('');
  // const [staffList, setStaffList] = useState([])
  const [time, setTime] = useState('');

  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');

  const [description, setDescription] = useState('')
  const [staffId,setStaffId]=useState(null)
  const [attachment, setAttachment] = useState([]);

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const navigate  =useNavigate()
  const goBack = () => {
    navigate(-1)
  }



  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); // Push only the file objects
    }
    setAttachment(fileList);
  };


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

  const handleAdd = e => {
    e.preventDefault();

    const emptyFields = [];

   
    if (!date) {
      emptyFields.push('Date');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!time) {
      emptyFields.push('Time');
    }
    if (!subject) {
      emptyFields.push('Subject');
    }
    if (!description) {
      emptyFields.push('Description');
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
    const formattedTime = dayjs(time).format('HH:mm');

    const formData = new FormData();
    formData.append('mnten_stfid', staffId);
    formData.append('mnten_date',dateFormat);
    formData.append('mnten_time',formattedTime);
    formData.append('mnten_subjct', subject);
    formData.append('mnten_loca', location);
    formData.append('mnten_dscrptn',description);
    formData.append('company_id', companyId);


    formData.append('created_at', currentTime);
    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
  
    let endpoint = "insertAssets?table=fms_maintenance";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log("check",data)
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: data.messages,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {

          navigate('/assets/maintenance')

        }, 1700)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.messages,
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
        <h1>Create Maintenance Logs</h1>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker

            label="Time"
            onChange={(newValue) => {setTime(newValue) }}

          />
        </LocalizationProvider>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
          <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>

   
        <TextField
            required
            value={subject}
            label="Subject"
            type="text"
            onChange={(e)=>{setSubject(e.target.value)}}
          />
          <TextField
          value={description}
            multiline
            rows={4}
            label="Description"
            type="text"
            onChange={(e)=>{setDescription(e.target.value)}}
          />
          	<TextField
          value={location}
            multiline
            label="Location"
            type="text"
            onChange={(e)=>{setLocation(e.target.value)}}
          />
		
            <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple  listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>


          
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