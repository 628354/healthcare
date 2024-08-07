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

//select field

import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';



const Add = ({ setIsAdding, setShow }) => {

  const {companyId} = useContext(AuthContext)

  const currentDate = new Date()
  const [reviewedOn, setReviewedOn] = useState('')
  const [domain, setDomain] = useState('');
  const [legislativeReference, setLegislativeReference] = useState('');
  const [documentReference, setDocumentReference] = useState('');
  const [monitoringMechanism, setMonitoringMechanism] = useState('')
  const [nextReviewDate, setNextReviewDate] = useState('')
  const [attachment, setAttachment] = useState([]);

  const minSelectableDate = dayjs(reviewedOn).add(1, 'day');



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



  const handleAdd = e => {
    e.preventDefault();
 const emptyFields = [];

    if (!reviewedOn) {
      emptyFields.push('Review On');
    }
    if (!domain) {
      emptyFields.push('Domain');
    }
    if (!legislativeReference) {
      emptyFields.push('Legislative reference');
    }
    if (!documentReference) {
      emptyFields.push('Document reference ');
    }
    if (!monitoringMechanism) {
      emptyFields.push('Monitoring mechanism');
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
    const nextReviewDateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null
    const dateFormat = reviewedOn ? reviewedOn.format('YYYY-MM-DD') : null
    const formData = new FormData();

    formData.append('legis_rvuon', dateFormat);
    formData.append('legis_domain', domain);
    formData.append('regis_refrnc', legislativeReference);
    formData.append('regis_docref', documentReference);
    formData.append('regis_monimech', monitoringMechanism);
    formData.append('regis_rvudate', nextReviewDateFormat);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);
    
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = "insertCompliance?table=fms_legislation_registers";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      //console.log(data);
      //console.log("check", data)
      //return data;
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
        <h1>Create Legislation Register</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Review On'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setReviewedOn(newValue)
            }}
          />
        </LocalizationProvider>

        <TextField
          required
          multiline
          rows={4}
          value={domain}
          label="Domain"
          type="text"
          onChange={(e) => { setDomain(e.target.value) }}
        />
        <TextField
          value={legislativeReference}
          multiline
          rows={4}
          label="Legislative reference"
          type="text"
          onChange={(e) => { setLegislativeReference(e.target.value) }}
        />
        <TextField
          value={documentReference}
          multiline
          rows={4}
          label="Document reference"
          type="text"
          onChange={(e) => { setDocumentReference(e.target.value) }}
        />
        <TextField
          value={monitoringMechanism}
          multiline
          rows={4}
          label="Monitoring mechanism"
          type="text"
          onChange={(e) => { setMonitoringMechanism(e.target.value) }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next review date'
            format='DD/MM/YYYY'
            minDate={dayjs(minSelectableDate)}
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