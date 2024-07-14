import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Upload } from 'antd';
import Swal from 'sweetalert2';
import {COMMON_ADD_FUN,BASE_URL,GET_PARTICIPANT_LIST,COMMON_GET_PAR,companyId, COMMON_UPDATE_FUN} from '../../../helper/ApiInfo'


const Add = ({ setIsAdding, setShow }) => {


  const currentDate = new Date()
  const [name, setName] = useState('');
  const [version, setVersion] = useState('')
  const [nextReviewDate, setNextReviewDate] = useState('')
  const [notes, setNotes] = useState('')
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





  const handleAdd = e => {
    e.preventDefault();
    const emptyFields = [];
    if (!name) {
      emptyFields.push('name');
    }
    if (!version) {
      emptyFields.push('Version');
    }
    if (!attachment) {
      emptyFields.push('Attechment');
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
    const dateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null
    const formData = new FormData();

    formData.append('intreg_name', name);
    formData.append('intreg_vrsn', version);
    formData.append('intreg_rvudate', dateFormat);
    formData.append('intreg_note', notes);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);


    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });


    let endpoint = "insertCompliance?table=fms_internal_registers";
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check", data)
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
        <h1>Create Policy</h1>

        <TextField
          value={name}
          label="Name"
          type="text"
          onChange={(e) => { setName(e.target.value) }}
        />

        <TextField
          value={version}

          label="Version "
          type="text"
          onChange={(e) => { setVersion(e.target.value) }}
        />

        <TextField
          value={notes}

          label="Notes "
          type="text"
          onChange={(e) => { setNotes(e.target.value) }}
        />


        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next review date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setNextReviewDate(newValue)
            }}
          />
        </LocalizationProvider>
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