import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { Card, CardContent, Typography } from '@mui/material'
import Swal from 'sweetalert2';
import { Upload } from 'antd';
import { IMG_BASE_URL,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from 'helper/ApiInfo';

const Edit = ({ selectedData, setIsEditing, allowPre  }) => {
  // const currentDate = new Date();
  console.log(selectedData);
  const id = selectedData.services_id;
  const [code, setCode] = useState(selectedData.service_code)
  const [serviceName, setServiceName] = useState(selectedData.services_name)

  const [rateType, setRateType] = useState(selectedData.rate_type)

  const [price, setPrice] = useState(selectedData.price)

  const [effectiveDate, setEffectiveDate] = useState(selectedData.effective_date ? dayjs(selectedData.effective_date) : dayjs())















  const handleUpdate = (e) => {
    e.preventDefault();
    const emptyFields = [];

    if (!code) {
      emptyFields.push('Code');
    }
    if (!serviceName) {
      emptyFields.push('Name');
    } 
    if (!rateType) {
      emptyFields.push('Rate Type');
    }

    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const formattedDate = dayjs(effectiveDate).format('YYYY-MM-DD'); 

    const formData = new FormData()
    formData.append('effective_date', formattedDate)
    formData.append('services_name', serviceName)
    formData.append('service_code', code)
    formData.append('rate_type', rateType)
    formData.append('price', price)
   
    let endpoint = 'updateAll?table=services&field=services_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        });
      }
    });
  };

  return (

    <>
     <div className="small-container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleUpdate}
      >
      
      <h1>Create Service</h1>
      <TextField
          value={code}
          multiline
          label='Code'
          type='text'
          onChange={e => {
            setCode(e.target.value)
          }}
        />
 <TextField
          value={serviceName}
          multiline
          label='Name'
          type='text'
          onChange={e => {
            setServiceName(e.target.value)
          }}
        />

        

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='rateType'>Rate type</InputLabel>
          <Select
            labelId='rateType'
            id='rateType'
            value={rateType}
            label='Rate Type'
            onChange={e => setRateType(e.target.value)}
          >

                <MenuItem value='Fixed'>Fixed</MenuItem>
                <MenuItem value='Per Unit'>Per Unit</MenuItem>

          </Select>
        </FormControl>
        <TextField
          label='Price'
          type='text'
          id='price'
          value={price}
          onChange={e => {
            setPrice(e.target.value)
          }}
        />

<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Effective date" format='DD/MM/YYYY'  value={dayjs(effectiveDate)} onChange={(newValue) => {setEffectiveDate(newValue) }}  />
        </LocalizationProvider>


        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </Button>
            {allowPre.edit ? (
              <Button variant="outlined" type="submit">
                Update
              </Button>
            ) : (
              ''
            )}
          </Stack>
        </Box>
      </Box>
    </div>
    

    </>
   
  );
};

export default Edit;
