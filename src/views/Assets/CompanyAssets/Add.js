import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Upload } from 'antd';
import '../../../style/document.css'
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL,COMMON_ADD_FUN} from 'helper/ApiInfo';
import { useNavigate } from 'react-router';
import AuthContext from 'views/Login/AuthContext';
import { FormHelperText } from '@mui/material';



const Add = () => {
const navigate =useNavigate()
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [staff, setStaff] = useState('');
  // const [staffList, setStaffList] = useState([])

  const {companyId} = useContext(AuthContext)

  const [asset, setAsset] = useState('');
  const [location, setLocation] = useState('');

  const [description, setDescription] = useState('')
  const [staffId, setStaffId] = useState(null)
  const [attachment, setAttachment] = useState([]);

  const [errors ,setErrors]=useState()

  // const companyId = localStorage.getItem('user')



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
    if (!date) {
      newErrors.date = 'Date is required';
      hasError = true;
    }
    if (!staff) {
      newErrors.staff = 'Staff is required';
      hasError = true;
    }
   
    if (!asset) {
      newErrors.asset = 'Assets is required';
      hasError = true;
    }
   
    if (!location) {
      newErrors.location = 'Location is required';
      hasError = true;
    }
    setErrors(newErrors);

    if (hasError) {
      return;
    }
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData();
    formData.append('cmpny_stfid', staffId);
    formData.append('cmpny_date', dateFormat);
    formData.append('cmpny_asetname', asset);
    formData.append('cmpny_location', location);
    formData.append('cmpny_dscrptn', description);
    formData.append('created_at', currentTime);

    formData.append('company_id', companyId);


    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

  
    let endpoint = "insertAssets?table=fms_cmpnyasets";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      // //console.log(data.status);
    
      //console.log("check", data)
      //return data;
      //console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(() => {
          
          navigate('/assets/company-assets')
  
        }, 1700)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    });

  };

  const goBack=()=>{
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
        <h1>Create Company Assets</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
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


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' 
          onChange={(e) => {
            setStaff(e.target.value);
            if (e.target.value) {
              setErrors((prevErrors) => ({ ...prevErrors, staff: '' }));
            }
          }} error={!!errors?.staff}
                    helperText={errors?.staff}
          >
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
          <FormHelperText>{errors?.staff}</FormHelperText>
        </FormControl>

        <TextField
          required
          value={asset}
          label="Assets"
          type="text"
          onChange={(e)=>{setAsset(e.target.value);if (e.target.value){
            setErrors((prevErrors) => ({ ...prevErrors, asset: '' }));
          }
        }}

          helperText={errors? errors?.asset: ""}
          error={!!errors?.asset}
         
        
        />
        <TextField
          value={location}
          multiline
          label="Location"
          type="text"
          onChange={(e)=>{setLocation(e.target.value);if (e.target.value) {
            setErrors((prevErrors) => ({ ...prevErrors, location: '' }));
          } }}
          helperText={errors? errors?.location: ""}
          error={!!errors?.location}
        />
        <TextField
          value={description}
          multiline
          rows={4}
          label="Description"
          type="text"
          onChange={(e) => { setDescription(e.target.value) }}
        />
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