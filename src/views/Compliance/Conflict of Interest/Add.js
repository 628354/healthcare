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
import {COMMON_ADD_FUN,BASE_URL} from '../../../helper/ApiInfo'

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import AuthContext from 'views/Login/AuthContext';



const Add = ({ setIsAdding, setShow }) => {

  const {companyId} = useContext(AuthContext)

  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [staff, setStaff] = useState('');
  const [confdesc, setConfDesc] = useState('');
  const [mitigationStrategy, setMitigationStrategy] = useState('');
  const [staffId, setStaffId] = useState(null)
  const [attachment, setAttachment] = useState([]);


  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])


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
    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!confdesc) {
      emptyFields.push('Conflict description');
    }
    if (!mitigationStrategy) {
      emptyFields.push('Mitigation strategy');
    }
    
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData();
    formData.append('coi_stfid', staffId);
    formData.append('coi_date', dateFormat);
    formData.append('coi_dscrptn', confdesc);
    formData.append('coi_mtigatn', mitigationStrategy);

    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);


    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });


    let endpoint = "insertCompliance?table=fms_conflictofInterest";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      //console.log(data);
      //console.log("check", data)
      //console.log(data);
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
        <h1>Create Conflict Of Interest</h1>
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


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>


        <TextField
          required
          multiline
          rows={4}
          value={confdesc}
          label="Conflict description"
          type="text"
          onChange={(e) => { setConfDesc(e.target.value) }}
        />
        <TextField
          value={mitigationStrategy}
          multiline
          rows={4}
          label="Mitigation strategy"
          type="text"
          onChange={(e) => { setMitigationStrategy(e.target.value) }}
        />

        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



        <Box sx={{ width: '100ch', m: 1 }}>
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