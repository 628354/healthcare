import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Upload } from 'antd';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN,companyId} from 'helper/ApiInfo';
import dayjs from 'dayjs';



const Add = ({ setIsAdding, setShow }) => {


  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const [problem, setProblem] = useState('')
  const [risk, setRisk] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('');
  const [staff, setStaff] = useState('');
  const [staffId, setStaffId] = useState(null)
  const [attachment, setAttachment] = useState([]);


  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  
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
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      setStaff(combine)
      setStaffId(id)

    }
  }, [])

  const handleAdd = e => {
    e.preventDefault();
    const emptyFields = [];

   
    if (!problem) {
      emptyFields.push('Problem');
    }
    if (!risk) {
      emptyFields.push('Risk');
    }
    if (!location) {
      emptyFields.push('Location');
    }
    if (!priority) {
      emptyFields.push('Priority ');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
   
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const formData = new FormData();
    formData.append('rpair_stfid', staffId);
    formData.append('rpair_problm', problem);
    formData.append('rpair_risk', risk);
    formData.append('rpair_priority', priority);
    formData.append('rpair_location', location);
    formData.append('company_id', companyId);



    formData.append('created_at', currentTime);

    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

  
    let endpoint = "insertAssets?table=fms_repair_request";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
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
        <h1>Create Repair Request</h1>
        <TextField
          required
          value={problem}
          multiline
          rows={5}
          label="Problem"
          type="text"
          onChange={(e) => { setProblem(e.target.value) }}
        />
        <TextField
          required
          value={risk}
          multiline
          rows={5}
          label="Risk"
          type="text"
          onChange={(e) => { setRisk(e.target.value) }}
        />
        <TextField
          value={location}
          multiline
          label="Location"
          type="text"
          onChange={(e) => { setLocation(e.target.value) }}
        />
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Priority'>Priority</InputLabel>
          <Select
            labelId='Priority'
            id='Priority'
            value={priority}
            label='Priority'
            onChange={e => setPriority(e.target.value)}
          >

            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>


          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>





        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



        
      </Box>
    </div>
  );
};


export default Add;