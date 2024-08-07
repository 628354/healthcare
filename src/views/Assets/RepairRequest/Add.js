import React, { useContext, useEffect, useState } from 'react';
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
import { BASE_URL, COMMON_ADD_FUN} from 'helper/ApiInfo';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import '../../../style/document.css'
import AuthContext from 'views/Login/AuthContext';
import { FormHelperText } from '@mui/material';



const Add = () => {
  const {companyId } = useContext(AuthContext)

const navigate =useNavigate();
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const [problem, setProblem] = useState('')
  const [risk, setRisk] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('');
  const [staff, setStaff] = useState('');
  const [staffId, setStaffId] = useState(null)
  const [attachment, setAttachment] = useState([]);

  const [errors ,setErrors]=useState()


  
  const handleChange = (e) => {
    const files = e.fileList;
    //console.log(files);
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
    let hasError = false;
    const newErrors = {};

   
    if (!problem) {
      newErrors.problem = 'Problem is required';
      hasError = true;
    }
    if (!risk) {
      newErrors.risk = 'Risk is required';
      hasError = true;
    }
    if (!location) {
      newErrors.location = 'Location is required';
      hasError = true;
    }
    if (!priority) {
      newErrors.priority = 'Priority is required';
      hasError = true;
    }
    if (!staff) {
      newErrors.staff = 'Staff is required';
      hasError = true;
    }
   
    setErrors(newErrors);

    if (hasError) {
      return;
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
      //console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {

          navigate('/assets/Repair-Requests')

        }, 1700)
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

  const goBack = () => {
    navigate(-1)
  }

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
          onChange={(e)=>{setProblem(e.target.value);if (e.target.value){
            setErrors((prevErrors) => ({ ...prevErrors, problem: '' }));
          }
        }}

          helperText={errors? errors?.problem: ""}
          error={!!errors?.problem}
        />
        <TextField
          required
          value={risk}
          multiline
          rows={5}
          label="Risk"
          type="text"
          onChange={(e)=>{setRisk(e.target.value);if (e.target.value){
            setErrors((prevErrors) => ({ ...prevErrors, risk: '' }));
          }
        }}

          helperText={errors? errors?.risk: ""}
          error={!!errors?.risk}
        />
        <TextField
        required
          value={location}
          multiline
          label="Location"
          type="text"
          onChange={(e)=>{setLocation(e.target.value);if (e.target.value){
            setErrors((prevErrors) => ({ ...prevErrors, location: '' }));
          }
        }}

          helperText={errors? errors?.location: ""}
          error={!!errors?.location}
        />
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Priority'>Priority</InputLabel>
          <Select
            labelId='Priority'
            id='Priority'
            value={priority}
            label='Priority'
            onChange={(e) => {
              setPriority(e.target.value);
              if (e.target.value) {
                setErrors((prevErrors) => ({ ...prevErrors, priority: '' }));
              }
            }} error={!!errors?.priority}
                      helperText={errors?.priority}
          >

            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>


          </Select>
          <FormHelperText>{errors?.priority}</FormHelperText>

        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff'  onChange={(e) => {
            setStaff(e.target.value);
            if (e.target.value) {
              setErrors((prevErrors) => ({ ...prevErrors, staff: '' }));
            }
          }} error={!!errors?.staff}
                    helperText={errors?.staff}>
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
          <FormHelperText>{errors?.staff}</FormHelperText>

        </FormControl>





        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



        <Box sx={{ width: '100ch', m: 1 }}>
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